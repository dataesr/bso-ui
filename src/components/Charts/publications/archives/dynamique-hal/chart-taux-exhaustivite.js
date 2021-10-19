/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import { domains, graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ hasFooter, hasComments, id, domain }) => {
  const chartRef = useRef();
  const idWithDomain = withDomain(id, domain);

  const { lastObservationSnap } = useGlobals();
  const { _, isLoading, isError } = useGetData(lastObservationSnap, domain);

  return (
    <WrapperChart
      id={id}
      domain={domain}
      chartRef={chartRef}
      hasComments={hasComments}
      hasFooter={hasFooter}
      isLoading={isLoading}
      isError={isError}
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
  hasFooter: true,
  hasComments: true,
  id: 'publi.repositories.dynamique-hal.chart-taux exhaustivite',
  domain: '',
};

Chart.propTypes = {
  hasFooter: PropTypes.bool,
  hasComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
