import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import config from '../../../config';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import useGetData from './get-data';

const Chart = () => {
  const chartRef = useRef();
  const intl = useIntl();
  const graphId = 'app.sante-publi.general.voies-ouverture.chart-repartition-taux';
  const graphConfig = config.find((gf) => gf.id === graphId);
  const { observationDates, updateDate } = useGlobals();
  const { allData, isLoading, isError } = useGetData(observationDates[0] || 2020);

  if (isLoading) {
    return <>Loading...</>;
  }
  if (isError) {
    return <>Error</>;
  }

  const { dataGraph, categories } = allData;

  const optionsGraph = {
    chart: {
      type: 'column',
    },
    title: {
      text: intl.formatMessage({ id: `${graphId}.title` }),
      align: 'left',
    },
    xAxis: {
      categories,
    },
    legend: {
      verticalAlign: 'top',
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: dataGraph,
  };

  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={graphId}
      />
      <GraphComments comments={intl.formatMessage({ id: `${graphId}.comments` })} />
      <GraphFooter
        date={updateDate}
        source={graphConfig.source}
        graphId={graphId}
      />
    </>
  );
};

export default Chart;
