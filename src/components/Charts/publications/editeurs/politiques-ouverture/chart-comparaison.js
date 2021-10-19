/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import HCMore from 'highcharts/highcharts-more';
import HighchartsAnnotations from 'highcharts/modules/annotations';
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
HCMore(Highcharts);
HighchartsAnnotations(Highcharts);

const Chart = ({ hasFooter, hasComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();

  const { lastObservationSnap } = useGlobals();
  const { allData, isLoading, isError } = useGetData(
    lastObservationSnap,
    domain,
  );
  const { bubbleGraph } = allData;
  const idWithDomain = withDomain(id, domain);
  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    bubbleGraph,
  );

  return (
    <WrapperChart
      id={id}
      domain={domain}
      chartRef={chartRef}
      hasFooter={hasFooter}
      hasComments={hasComments}
      isLoading={isLoading || !bubbleGraph}
      isError={isError}
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
  id: 'publi.publishers.politiques-ouverture.chart-comparaison',
  domain: '',
};
Chart.propTypes = {
  hasFooter: PropTypes.bool,
  hasComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
