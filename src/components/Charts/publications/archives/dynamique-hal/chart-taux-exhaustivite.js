/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import WrapperChart from '../../../../WrapperChart';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments }) => {
  const chartRef = useRef();
  const graphId = 'publi.repositories.dynamique-hal.chart-taux exhaustivite';

  return (
    <WrapperChart
      id={graphId}
      domain=''
      chartRef={chartRef}
      graphComments={graphComments}
      graphFooter={graphFooter}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={{}}
        ref={chartRef}
        id={graphId}
      />
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
};

export default Chart;
