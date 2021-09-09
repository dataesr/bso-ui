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

const Chart = ({ id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { lastObservationSnap } = useGlobals();
  const { allData, isLoading } = useGetData(lastObservationSnap, domain);
  const { categories2, dataGraph2 } = allData;
  const idWithDomain = withDomain(id, domain);
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    categories2,
    dataGraph2,
  );

  return (
    <WrapperChart
      id={id}
      domain={domain}
      chartRef={chartRef}
      isLoading={isLoading || !dataGraph2 || !categories2}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={idWithDomain}
      />
    </WrapperChart>
  );
};

Chart.defaultProps = {
  id: 'publi.affiliations.pays.chart-classement-pays',
  domain: '',
};
Chart.propTypes = {
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};
export default Chart;
