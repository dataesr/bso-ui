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
  const graphId = 'app.sante-publi.general.dynamique-ouverture.chart-evolution-proportion';
  const graphConfig = config.find((gf) => gf.id === graphId);
  const { observationDates, updateDate } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationDates);

  if (isLoading) {
    return <>Loading...</>;
  }
  if (isError) {
    return <>Error</>;
  }

  const { dataGraph2 } = data;

  const optionsGraph2 = {
    chart: {
      type: 'spline',
    },
    title: {
      text: intl.formatMessage({ id: `${graphId}.title` }),
      align: 'left',
    },
    xAxis: {
      title: {
        text: 'Années de publication',
      },
    },
    legend: {
      verticalAlign: 'top',
    },
    plotOptions: {
      series: {
        pointStart: 2013,
      },
    },
    series: dataGraph2,
  };

  return (
    <>
      {/* <GraphFilters /> */}
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph2}
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
