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
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = () => {
  const chartRef = useRef();
  const intl = useIntl();
  const graphId = 'app.sante-publi.general.voies-ouverture.chart-repartition-taux';
  const { observationDates, updateDate } = useGlobals();
  const { allData, isLoading } = useGetData(observationDates[0]);
  const { dataGraph, categories } = allData;

  if (isLoading || !dataGraph || !categories) {
    return <Loader />;
  }

  const optionsGraph = getGraphOptions(graphId, intl);
  optionsGraph.chart.type = 'column';
  optionsGraph.xAxis = {
    categories,
  };
  optionsGraph.yAxis = getPercentageYAxis();
  optionsGraph.legend = {
    title: {
    // TODO: translation
      text: "Type d'hébergement",
    },
  };
  optionsGraph.tooltip = {
    headerFormat: '<b>{point.x}</b><br/>',
    // TODO: translation
    pointFormat: "• Taux d'accès ouvert <br> avec hébergement {series.name} :<br> {point.y:.2f} % ({point.y_abs} / {point.y_tot}) <br/> • Taux d'accès ouvert total :<br> {point.stackTotal:.2f} %",
  };
  optionsGraph.plotOptions = {
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: true,
        // eslint-disable-next-line
        formatter: function () {
        // eslint-disable-next-line
          return this.y.toFixed(1).concat(' %');
        },
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
