/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

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
  const { observationSnaps } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationSnaps, domain);
  const [chartComments, setChartComments] = useState('');
  const { dataGraph2 } = data;
  const idWithDomain = withDomain(id, domain);
  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    dataGraph2,
  );
  useEffect(() => {
    // TODO manage variables in comment
    setChartComments('comments');
    // setChartComments(customComments(dataGraph2, idWithDomain, intl));
  }, [dataGraph2, idWithDomain, intl]);

  return (
    <WrapperChart
      id={id}
      domain={domain}
      chartRef={chartRef}
      hasComments={false}
      hasFooter={hasFooter}
      isLoading={isLoading || !dataGraph2}
      isError={isError}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={idWithDomain}
      />
      {hasComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};
// TODO remove publi studyType from id
Chart.defaultProps = {
  hasFooter: true,
  hasComments: true,
  domain: '',
  id: 'publi.general.dynamique-ouverture.chart-evolution-proportion',
};
Chart.propTypes = {
  hasFooter: PropTypes.bool,
  hasComments: PropTypes.bool,
  domain: PropTypes.oneOf(domains),
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
