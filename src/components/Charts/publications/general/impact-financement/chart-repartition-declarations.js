import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import treemapModule from 'highcharts/modules/treemap';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data-repartition-declarations';

treemapModule(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { lastObservationSnap } = useGlobals();
  const {
    allData: { dataGraph },
    isError,
    isLoading,
  } = useGetData(lastObservationSnap, domain);
  const idWithDomain = withDomain(id, domain);
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    dataGraph,
  );

  return (
    <WrapperChart
      chartRef={chartRef}
      domain={domain}
      id={id}
      isError={isError}
      isLoading={isLoading || !dataGraph}
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
  id: 'publi.general.impact-financement.chart-repartition-financements',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
