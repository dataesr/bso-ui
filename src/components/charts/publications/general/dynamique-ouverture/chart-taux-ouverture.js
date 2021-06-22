import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import useGetData from './get-data';

const Chart = () => {
  const chartRef = useRef();
  const intl = useIntl();
  const graphId = 'app.sante-publi.general.dynamique-ouverture.chart-taux-ouverture';
  const { observationDates, updateDate } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationDates);

  if (isLoading) {
    return <>Loading...</>;
  }
  if (isError) {
    return <>Error</>;
  }

  const { dataGraph1 } = data;

  const optionsGraph1 = {
    colors: ['#FF6F4C'],
    chart: {
      type: 'bar',
    },
    title: {
      text: intl.formatMessage({ id: `${graphId}.title` }),
      align: 'left',
    },
    // yAxis: { visible: false },
    tooltip: { valueSuffix: '%' },
    plotOptions: {
      bar: {
        dataLabels: { enabled: true },
      },
    },
    credits: { enabled: false },
    xAxis: {
      type: 'category',
      lineWidth: 0,
      tickWidth: 0,
    },
    series: [
      {
        data: dataGraph1,
        showInLegend: false,
      },
    ],
  };
  return (
    <>
      {/* <GraphFilters /> */}
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph1}
        ref={chartRef}
        id='chart1'
      />
      <GraphComments
        comments={intl.formatMessage({ id: `${graphId}.comments` })}
      />
      <GraphFooter
        date={updateDate}
        source={intl.formatMessage({ id: `${graphId}.source` })}
        graphId={graphId}
      />
    </>
  );
};

export default Chart;
