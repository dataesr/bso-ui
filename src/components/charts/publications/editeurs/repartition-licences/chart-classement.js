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

const Chart = ({ graphFooter, graphComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();

  const { observationSnaps } = useGlobals();
  const { data, isLoading, isError } = useGetData(
    observationSnaps,
    false,
    '*',
    domain,
  );
  const { dataGraphBar, categories } = data;
  const optionsGraph = getGraphOptions(id, intl);
  optionsGraph.chart.type = 'bar';
  optionsGraph.xAxis = {
    categories,
  };
  optionsGraph.yAxis = getPercentageYAxis(false);
  optionsGraph.legend = {
    title: {
      text: intl.formatMessage({ id: `${id}.legend` }),
    },
  };
  optionsGraph.plotOptions = {
    series: {
      stacking: 'normal',
      dataLabels: {
        style: {
          textOutline: 'none',
        },
        enabled: true,
        // eslint-disable-next-line
        formatter: function () {
          // eslint-disable-next-line
          return this.y.toFixed(1).concat(' %');
        },
      },
    },
  };
  optionsGraph.series = dataGraphBar;

  return (
    <WrapperChart
      id={id}
      chartRef={chartRef}
      graphFooter={graphFooter}
      graphComments={graphComments}
      isError={isError}
      isLoading={isLoading || !dataGraphBar || !categories}
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
  graphFooter: true,
  graphComments: true,
  id: 'app.national-publi.publishers.repartition-licences.chart-classement',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
