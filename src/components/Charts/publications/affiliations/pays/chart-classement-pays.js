import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasFooter, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { lastObservationSnap } = useGlobals();
  const { allData, isLoading, isError } = useGetData(
    lastObservationSnap,
    domain,
  );
  const { categories2, dataGraph2 } = allData;
  const idWithDomain = withDomain(id, domain);
  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    categories2,
    dataGraph2,
  );

  return (
    <WrapperChart
      chartRef={chartRef}
      domain={domain}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !dataGraph2 || !categories2}
    >
      <HighchartsReact
        highcharts={Highcharts}
        id={idWithDomain}
        options={optionsGraph}
        ref={chartRef}
      />
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  hasFooter: true,
  id: 'publi.affiliations.pays.chart-classement-pays',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};
export default Chart;
