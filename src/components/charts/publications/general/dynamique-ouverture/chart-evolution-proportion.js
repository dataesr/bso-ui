/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import { domains, graphIds } from '../../../../../utils/constants';
import {
  getGraphOptions,
  getPercentageYAxis,
} from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { observationSnaps } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationSnaps, domain);
  const { dataGraph2 } = data;

  if (isLoading || !dataGraph2) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  const optionsGraph2 = getGraphOptions(id, intl);
  optionsGraph2.chart.type = 'spline';
  optionsGraph2.xAxis = {
    title: { text: intl.formatMessage({ id: `${id}.xAxis` }) },
  };
  optionsGraph2.yAxis = getPercentageYAxis();
  optionsGraph2.legend = { verticalAlign: 'top' };
  optionsGraph2.plotOptions = { series: { pointStart: 2013 } };
  optionsGraph2.series = dataGraph2;

  const indMax = dataGraph2[1]?.data.length - 1;
  const chartComments = intl.formatMessage(
    { id: `${id}.comments` },
    {
      a: dataGraph2[1]?.name,
      b: dataGraph2[0]?.name,
      c: 2013 + indMax,
      d: dataGraph2[0]?.data[indMax] - dataGraph2[1]?.data[indMax],
      e: dataGraph2[1]?.data[indMax],
      f: dataGraph2[0]?.data[indMax],
      g: 2013 + indMax - 1,
      h: dataGraph2[0]?.data[indMax - 1] - dataGraph2[1]?.data[indMax - 1],
      i: dataGraph2[1]?.data[indMax - 1],
      j: dataGraph2[0]?.data[indMax - 1],
      k: dataGraph2[1]?.data[indMax - 1] - dataGraph2[2]?.data[indMax - 1],
      l: dataGraph2[2]?.name,
      m: dataGraph2[1]?.name,
    },
  );

  return (
    <WrapperChart
      id={id}
      chartRef={chartRef}
      graphComments={false}
      graphFooter={graphFooter}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph2}
        ref={chartRef}
        id={id}
      />
      {graphComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  domain: '',
  id: 'app.national-publi.general.dynamique-ouverture.chart-evolution-proportion',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  domain: PropTypes.oneOf(domains),
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
