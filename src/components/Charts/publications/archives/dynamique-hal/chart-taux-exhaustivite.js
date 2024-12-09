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
import ChartWrapper from '../../../../ChartWrapper';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ hasFooter, hasComments, id, domain }) => {
  const chartRef = useRef();
  const idWithDomain = withDomain(id, domain);

  const { beforeLastObservationSnap, lastObservationSnap } = useGlobals();
  const { isError, isLoading } = useGetData(
    beforeLastObservationSnap,
    lastObservationSnap,
    domain,
  );

  return (
    <ChartWrapper
      chartRef={chartRef}
      domain={domain}
      hasComments={hasComments}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading}
    >
      <HighchartsReact
        highcharts={Highcharts}
        id={idWithDomain}
        options={{}}
        ref={chartRef}
      />
    </ChartWrapper>
  );
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.repositories.dynamique-hal.chart-taux exhaustivite',
};

Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
