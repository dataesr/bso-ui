/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';

// import { getGraphOptions } from '../../../../../utils/helpers';
import WrapperChart from '../../../../WrapperChart';
// import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments }) => {
  const chartRef = useRef();
  const graphId = 'app.sante-publi.repositories.dynamique-hal.chart-taux exhaustivite';

  // const { observationSnaps, updateDate } = useGlobals();
  // const { data, isLoading, isError } = useGetData(observationSnaps);
  // const { dataGraph2 } = data;

  // if (isLoading || !dataGraph2) {
  //   return <Loader />;
  // }
  // if (isError) {
  //   return <>Error</>;
  // }

  return (
    <WrapperChart
      id={graphId}
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
