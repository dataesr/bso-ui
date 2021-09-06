/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import { archiveouverte100 } from '../../../../../style/colours.module.scss';
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
  const { lastObservationSnap } = useGlobals();
  const { data, isLoading, isError } = useGetData(lastObservationSnap, domain);
  const optionsGraph = getGraphOptions(id, intl);

  optionsGraph.chart.type = 'bar';
  optionsGraph.chart.height = '700px';
  optionsGraph.colors = [archiveouverte100];
  optionsGraph.yAxis = { visible: false };
  optionsGraph.xAxis = {
    type: 'category',
    lineWidth: 0,
    tickWidth: 0,
    labels: {
      style: {
        color: 'var(--g800)',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
  };
  optionsGraph.series = [
    {
      data,
      showInLegend: false,
    },
  ];

  return (
    <WrapperChart
      id={id}
      chartRef={chartRef}
      graphComments={graphComments}
      graphFooter={graphFooter}
      isLoading={isLoading || !data}
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
  graphFooter: true,
  graphComments: true,
  id: 'app.national-publi.repositories.plus-utilisees.chart-nombre-documents',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
