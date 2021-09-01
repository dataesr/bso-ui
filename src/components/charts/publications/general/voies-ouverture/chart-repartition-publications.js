import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import treemapModule from 'highcharts/modules/treemap';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
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
  const { lastObservationSnap, updateDate } = useGlobals();
  const { allData, isLoading, isError } = useGetData(
    lastObservationSnap || '2020',
    domain,
  );
  const { dataGraph3 } = allData;

  if (isLoading || !dataGraph3) {
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
      data: dataGraph3,
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

  return (
    <>
      <div className='graph-container'>
        <GraphTitle title={intl.formatMessage({ id: `${id}.title` })} />
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsGraph}
          ref={chartRef}
          id={id}
        />
        <GraphComments
          comments={intl.formatMessage({ id: `${id}.comments` })}
        />
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
  id: 'app.national-publi.general.voies-ouverture.chart-repartition-publications',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(['health', '']),
  id: PropTypes.oneOf([
    'app.national-publi.general.voies-ouverture.chart-repartition-publications',
    'app.sante-publi.general.voies-ouverture.chart-repartition-publications',
  ]),
};

export default Chart;
