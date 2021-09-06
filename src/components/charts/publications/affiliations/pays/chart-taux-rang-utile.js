import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import { getGraphOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { getPercentageYAxis } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { lastObservationSnap } = useGlobals();
  const { allData, isLoading } = useGetData(lastObservationSnap, domain);
  const { dataGraph, categories } = allData;

  const optionsGraph = getGraphOptions(id, intl);
  optionsGraph.chart.type = 'column';
  optionsGraph.xAxis = {
    categories,
  };
  optionsGraph.yAxis = getPercentageYAxis();
  optionsGraph.legend = {
    title: {
      text: intl.formatMessage({ id: `${id}.legend` }),
    },
  };
  optionsGraph.plotOptions = {
    column: {
      dataLabels: {
        enabled: true,
        // eslint-disable-next-line
        formatter: function () {
          // eslint-disable-next-line
          return this.y.toFixed(0).concat(' %');
        },
      },
    },
  };
  optionsGraph.series = dataGraph;

  return (
    <WrapperChart
      isLoading={isLoading || !dataGraph || !categories}
      id={id}
      chartRef={chartRef}
      graphComments={false}
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
  id: 'app.national-publi.affiliations.pays.chart-taux-rang-utile',
  domain: '',
};
Chart.propTypes = {
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
