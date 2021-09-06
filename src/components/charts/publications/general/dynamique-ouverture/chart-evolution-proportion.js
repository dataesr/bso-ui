/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import {
  getGraphOptions,
  longComments,
} from '../../../../../utils/chartHelpers';
import { domains, graphIds } from '../../../../../utils/constants';
import { getPercentageYAxis } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
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
  const [chartComments, setChartComments] = useState('');
  const { dataGraph2 } = data;
  const optionsGraph2 = getGraphOptions(id, intl);
  optionsGraph2.chart.type = 'spline';
  optionsGraph2.xAxis = {
    title: { text: intl.formatMessage({ id: `${id}.xAxis` }) },
  };
  optionsGraph2.yAxis = getPercentageYAxis();
  optionsGraph2.legend = { verticalAlign: 'top' };
  optionsGraph2.plotOptions = { series: { pointStart: 2013 } };
  optionsGraph2.series = dataGraph2;

  useEffect(() => {
    setChartComments(longComments(dataGraph2, id, intl));
  }, [dataGraph2, id, intl]);

  return (
    <WrapperChart
      id={id}
      chartRef={chartRef}
      graphComments={false}
      graphFooter={graphFooter}
      isLoading={isLoading || !dataGraph2}
      isError={isError}
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
