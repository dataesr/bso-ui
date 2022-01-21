/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import customComments from '../../../../../utils/chartComments';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ hasFooter, hasComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();

  const { lastObservationSnap } = useGlobals();
  const [chartComments, setChartComments] = useState('');
  const { data, isLoading, isError } = useGetData(lastObservationSnap, domain);
  const { publicationYears, dataGraph2 } = data;
  const idWithDomain = withDomain(id, domain);
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    publicationYears,
    dataGraph2,
  );
  const { search } = useLocation();

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl, search));
  }, [data, idWithDomain, intl, search]);

  return (
    <WrapperChart
      chartRef={chartRef}
      domain={domain}
      hasComments={false}
      isLoading={isLoading || !dataGraph2}
      isError={isError}
      id={id}
      hasFooter={hasFooter}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={idWithDomain}
      />
      {hasComments && chartComments && (
        <GraphComments comments={chartComments} />
      )}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.repositories.dynamique-hal.chart-couverture-hal',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
