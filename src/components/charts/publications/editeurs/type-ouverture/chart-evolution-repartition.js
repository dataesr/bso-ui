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
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data-evolution-repartition';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { lastObservationSnap } = useGlobals();
  const { allData, isLoading, isError } = useGetData(
    lastObservationSnap || '2020',
    domain,
  );
  const { categories, dataGraph } = allData;
  const optionsGraph = getGraphOptions(id, intl);
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

  return (
    <WrapperChart
      id={id}
      chartRef={chartRef}
      isLoading={isLoading || !allData}
      isError={isError}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={id}
      />
    </WrapperChart>
  );
};

Chart.defaultProps = {
  id: 'app.national-publi.publishers.type-ouverture.chart-evolution-repartition',
  domain: '',
};
Chart.propTypes = {
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
