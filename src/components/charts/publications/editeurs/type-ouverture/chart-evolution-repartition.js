import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import { getGraphOptions, getPercentageYAxis } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import GraphTitle from '../../../graph-title';
import useGetData from './get-data-evolution-repartition';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = () => {
  const chartRef = useRef();
  const intl = useIntl();
  const graphId = 'app.sante-publi.publishers.type-ouverture.chart-evolution-repartition';
  const { observationDates, updateDate } = useGlobals();
  const { allData, isLoading, isError } = useGetData(
    observationDates[0] || '2020',
  );
  const { categories, dataGraph } = allData;

  if (isLoading || !allData) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  const optionsGraph = getGraphOptions(graphId, intl);
  optionsGraph.chart.type = 'area';
  optionsGraph.yAxis = getPercentageYAxis(false);
  optionsGraph.xAxis = {
    categories,
    tickmarkPlacement: 'on',
    title: {
      enabled: false,
    },
  };
  optionsGraph.plotOptions = {
    area: {
      stacking: 'normal',
      lineColor: '#fff',
      lineWidth: 3,
      marker: {
        lineWidth: 1,
        lineColor: '#fff',
      },
    },
  };
  optionsGraph.series = dataGraph;

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
        <GraphTitle title={intl.formatMessage({ id: `${graphId}.title` })} />
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsGraph}
          ref={chartRef}
          id={graphId}
        />
        <GraphComments
          comments={intl.formatMessage({ id: `${graphId}.comments` })}
        />
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
