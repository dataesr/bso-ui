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

const Chart = ({ hasFooter, hasComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();

  const { observationSnaps } = useGlobals();
  const { data, isLoading, isError } = useGetData(
    observationSnaps,
    false,
    '*',
    domain,
  );
  const { dataGraphBar, categories } = data;
  const idWithDomain = withDomain(id, domain);
  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    categories,
    dataGraphBar,
  );

  return (
    <WrapperChart
      id={id}
      domain={domain}
      chartRef={chartRef}
      hasFooter={hasFooter}
      hasComments={hasComments}
      isError={isError}
      isLoading={isLoading || !dataGraphBar || !categories}
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
  hasFooter: true,
  hasComments: true,
  id: 'publi.publishers.repartition-licences.chart-classement',
  domain: '',
};
Chart.propTypes = {
  hasFooter: PropTypes.bool,
  hasComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
