import { Toggle } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import treemapModule from 'highcharts/modules/treemap';
import HighchartsReact from 'highcharts-react-official';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { getGraphOptions } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import GraphTitle from '../../../graph-title';
import useGetData from './get-data';

treemapModule(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = () => {
  const chartRef = useRef();
  const intl = useIntl();
  const [isOa, setIsOa] = useState(false);
  const graphId = 'app.sante-publi.general.genres-ouverture.chart-repartition-genres';
  const { observationDates, updateDate } = useGlobals();
  const { allData, isLoading, isError } = useGetData(
    observationDates[0] || 2020,
    isOa,
  );

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  const { dataGraph } = allData;

  const optionsGraph = getGraphOptions(graphId, intl);
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
      { id: `${graphId}.comments` },
      {
        a: observationDates[0],
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
        <GraphTitle title={intl.formatMessage({ id: `${graphId}.title` })} />
        <Toggle
          isChecked={isOa}
          onChange={() => setIsOa(!isOa)}
          label={intl.formatMessage({ id: `${graphId}.toggle-label` })}
        />
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsGraph}
          ref={chartRef}
          id={graphId}
        />
        <GraphComments comments={chartComments} />
      </div>
      <GraphFooter
        date={updateDate}
        source={intl.formatMessage({ id: `${graphId}.source` })}
        graphId={graphId}
        onPngButtonClick={exportChartPng}
        onCsvButtonClick={exportChartCsv}
      />
    </>
  );
};

export default Chart;
