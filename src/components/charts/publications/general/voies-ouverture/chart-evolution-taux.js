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
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ id, domain }) => {
  const today = new Date();
  const chartRef = useRef();
  const intl = useIntl();
  const { lastObservationSnap } = useGlobals();
  const { allData, isLoading, isError } = useGetData(
    lastObservationSnap || today.getFullYear() - 1,
    domain,
  );
  const { dataGraph, categories } = allData;
  const optionsGraph = getGraphOptions(id, intl);

  optionsGraph.chart.type = 'area';
  optionsGraph.xAxis = {
    categories,
    tickmarkPlacement: 'on',
    title: {
      enabled: false,
    },
  };
  optionsGraph.yAxis = getPercentageYAxis();
  optionsGraph.legend = {
    title: {
      text: intl.formatMessage({ id: `${id}.legend` }),
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
      isLoading={isLoading || !dataGraph || !categories}
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
  domain: '',
  id: 'app.national-publi.general.voies-ouverture.chart-evolution-taux',
};
Chart.propTypes = {
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
