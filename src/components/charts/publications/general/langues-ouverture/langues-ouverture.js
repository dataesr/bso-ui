import { Toggle } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import treemapModule from 'highcharts/modules/treemap';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import {
  getFormattedDate,
  getGraphOptions,
} from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import useLang from '../../../../../utils/Hooks/useLang';
import Loader from '../../../../Loader';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import GraphTitle from '../../../graph-title';
import useGetData from './get-data';

treemapModule(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { lang } = useLang();
  const [isOa, setIsOa] = useState(false);
  const { updateDate, lastObservationSnap } = useGlobals();
  const {
    allData: { dataGraph },
    isLoading,
    isError,
  } = useGetData(lastObservationSnap || '2020', isOa, domain);

  if (isLoading || !dataGraph) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  const optionsGraph = getGraphOptions(id, intl);
  optionsGraph.series = [
    {
      type: 'treemap',
      layoutAlgorithm: 'stripes',
      alternateStartingDirection: true,
      levels: [
        {
          level: 1,
          layoutAlgorithm: 'sliceAndDice',
          dataLabels: {
            enabled: true,
            align: 'left',
            verticalAlign: 'top',
            style: {
              fontSize: '15px',
              fontWeight: 'bold',
            },
          },
        },
      ],
      data: dataGraph,
    },
  ];
  const exportChartPng = () => {
    chartRef.current.chart.exportChart({
      type: 'image/png',
    });
  };
  const exportChartCsv = () => {
    chartRef.current.chart.downloadCSV();
  };

  let chartComments = 'comment par defaut';
  if (!isOa) {
    const journalArticleOpened = dataGraph.find(
      (el) => el.key === 'journal-article' && el.parent === 'opened',
    )?.value;
    const journalArticleClosed = dataGraph.find(
      (el) => el.key === 'journal-article' && el.parent === 'closed',
    )?.value;
    const ratio1 = journalArticleOpened / (journalArticleOpened + journalArticleClosed);
    const bookChapterOpened = dataGraph.find(
      (el) => el.key === 'book-chapter' && el.parent === 'opened',
    )?.value;
    const bookChapterClosed = dataGraph.find(
      (el) => el.key === 'book-chapter' && el.parent === 'closed',
    )?.value;
    const ratio2 = bookChapterOpened / (bookChapterOpened + bookChapterClosed);

    chartComments = intl.formatMessage(
      { id: `${id}.comments` },
      {
        a: lastObservationSnap,
        b: journalArticleOpened,
        c: journalArticleClosed,
        d: Math.floor(ratio1 * 100),
        e: bookChapterOpened,
        f: bookChapterClosed,
        g: Math.floor(ratio2 * 100),
      },
    );
  }

  return (
    <>
      <div className='graph-container'>
        <GraphTitle title={intl.formatMessage({ id: `${id}.title` })} />
        <Toggle
          isChecked={isOa}
          onChange={() => setIsOa(!isOa)}
          label={intl.formatMessage({ id: `${id}.toggle-label` })}
        />
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsGraph}
          ref={chartRef}
          id={id}
        />
        <GraphComments comments={chartComments} />
      </div>
      <GraphFooter
        date={getFormattedDate(updateDate, lang)}
        source={intl.formatMessage({ id: `${id}.source` })}
        graphId={id}
        onPngButtonClick={exportChartPng}
        onCsvButtonClick={exportChartCsv}
      />
    </>
  );
};

Chart.defaultProps = {
  domain: '',
  id: 'app.national-publi.general.langues-ouverture.chart-repartition-publications',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(['health', '']),
  id: PropTypes.oneOf([
    'app.nationalpubli.general.langues-ouverture.chart-repartition-publications',
    'app.sante-publi.general.langues-ouverture.chart-repartition-publications',
  ]),
};

export default Chart;
