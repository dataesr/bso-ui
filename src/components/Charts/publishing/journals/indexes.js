/* eslint-disable react/require-default-props */
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import customComments from '../../../../utils/chartComments';
import { chartOptions } from '../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../utils/constants';
import { withDomain } from '../../../../utils/helpers';
import ChartWrapper from '../../../ChartWrapper';
import GraphComments from '../../graph-comments';
import useGetData from './get-data-sources';

HCExporting(Highcharts);
HCExportingData(Highcharts);

function Chart({ domain = '', hasComments = true, hasFooter = true, id = 'publishing.journals.indexes' }) {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const { data, isError, isLoading } = useGetData(['DDH', 'DOAJ', 'Hal', 'ROAD']);
  const idWithDomain = withDomain(id, domain);
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    data,
  );

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl));
  }, [data, idWithDomain, intl]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      date={process.env.REACT_APP_PUBLISHING_UPDATE}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !data}
    >
      <HighchartsReact
        highcharts={Highcharts}
        id={idWithDomain}
        options={optionsGraph}
        ref={chartRef}
      />
      {hasComments && chartComments && (
        <GraphComments comments={chartComments} hasFooter={hasFooter} />
      )}
    </ChartWrapper>
  );
}

Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
