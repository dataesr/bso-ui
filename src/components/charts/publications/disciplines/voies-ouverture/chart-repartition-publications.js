/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import { graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import WrapperChart from '../../../../WrapperChart';
// import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, id }) => {
  const chartRef = useRef();
  const idWithDomain = withDomain(id);

  // const { observationSnaps, updateDate } = useGlobals();
  // const { data, isLoading, isError } = useGetData(observationSnaps);
  // const { dataGraph2 } = data;

  return (
    <WrapperChart
      id={id}
      idWithDomain={idWithDomain}
      chartRef={chartRef}
      graphFooter={graphFooter}
      graphComments={graphComments}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={{}}
        ref={chartRef}
        id={idWithDomain}
      />
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  id: 'publi.disciplines.voies-ouverture.chart-repartition-publications',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
