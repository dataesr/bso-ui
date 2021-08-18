import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { getGraphOptions, getPercentageYAxis } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import SimpleSelect from '../../../../SimpleSelect';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import GraphTitle from '../../../graph-title';
import useGetData from './get-data-taux-ouverture';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = () => {
  const chartRef = useRef();
  const intl = useIntl();
  const graphId = 'app.sante-publi.general.impact-financement.chart-taux-ouverture';
  const [agency, setAgency] = useState();
  const { observationDates, updateDate } = useGlobals();
  const { allData, isLoading, agencies } = useGetData(
    observationDates[0],
    agency,
  );
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
  optionsGraph.plotOptions = {
    column: {
      dataLabels: {
        enabled: true,
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

        <SimpleSelect
          label={intl.formatMessage({ id: 'app.agencies-label' })}
          onChange={(e) => setAgency(e.target.value)}
          options={agencies || []}
          selected={agency}
        />

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
