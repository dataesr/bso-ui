/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import { domains, graphIds } from '../../../../../utils/constants';
import { getGraphOptions } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();

  const { observationSnaps } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationSnaps, domain);
  const { publicationYears, dataGraph2 } = data;
  const optionsGraph = getGraphOptions(id, intl);

  optionsGraph.chart.type = 'column';
  optionsGraph.xAxis = {
    publicationYears,
  };
  optionsGraph.legend = {
    title: {
      text: intl.formatMessage({ id: `${id}.legend` }),
    },
  };
  optionsGraph.plotOptions = {
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: true,
        style: {
          textOutline: 'none',
        },
      },
    },
  };
  optionsGraph.series = dataGraph2;

  return (
    <WrapperChart
      isLoading={isLoading || !dataGraph2}
      isError={isError}
      id={id}
      chartRef={chartRef}
      graphComments={graphComments}
      graphFooter={graphFooter}
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
  id: 'app.national-publi.repositories.dynamique-hal.chart-couverture-hal',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
