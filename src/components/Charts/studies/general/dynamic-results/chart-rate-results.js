/* eslint-disable react/require-default-props */
import '../../../graph.scss';

import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import customComments from '../../../../../utils/chartComments';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds, studiesTypes } from '../../../../../utils/constants';
import { getCSSValue, withDomain } from '../../../../../utils/helpers';
import ChartWrapper from '../../../../ChartWrapper';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

function Chart({
  domain = 'health',
  hasComments = true,
  hasFooter = true,
  id = 'general.rate-results',
  studyType = 'Interventional',
}) {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const { data, isError, isLoading } = useGetData(studyType);
  const idWithDomain = withDomain(id, domain);
  const dataYears = (data?.dataGraph ?? []).map((d, index) => {
    if (d.data.length > 0) {
      const res = d.data.find((item) => item.year === d.year - 3);
      return {
        color: index === (data.dataGraph.length - 1) ? getCSSValue('--blue-soft-150') : getCSSValue('--blue-soft-100'),
        completionDate: res.year,
        name: d.year,
        y: res.low,
        y_abs: res.y_abs,
        y_tot: res.y_tot,
      };
    }
    return {};
  });
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    [{ data: dataYears.reverse() }],
  );

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl));
  }, [data, idWithDomain, intl]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !data.dataGraph}
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
  studyType: PropTypes.oneOf(studiesTypes),
};

export default Chart;
