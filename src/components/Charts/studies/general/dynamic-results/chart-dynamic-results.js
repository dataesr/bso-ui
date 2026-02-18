/* eslint-disable react/require-default-props */
/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import highchartsDumbbell from 'highcharts/modules/dumbbell';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import customComments from '../../../../../utils/chartComments';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds, studiesTypes } from '../../../../../utils/constants';
import { withDomain, withtStudyType } from '../../../../../utils/helpers';
import ChartWrapper from '../../../../ChartWrapper';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

highchartsMore(Highcharts);
highchartsDumbbell(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

function Chart({
  domain = 'health',
  hasComments = true,
  hasFooter = true,
  id = 'general.dynamic-results',
  studyType = 'Interventional',
}) {
  const intl = useIntl();
  const chartRef = useRef();

  const [chartComments, setChartComments] = useState('');
  const [optionsGraph, setOptionsGraph] = useState(null);

  const { data, isError, isLoading } = useGetData(studyType);
  const idWithDomain = withDomain(id, domain);
  const idWithDomainAndStudyType = withtStudyType(idWithDomain, studyType);

  useEffect(() => {
    data?.dataGraph?.forEach((line) => {
      const nextLine = data.dataGraph.find((l) => l.name === `${Number(line.name) + 1}`);
      line.data.forEach((point) => {
        // eslint-disable-next-line no-param-reassign
        point.high = nextLine?.data?.find((p) => p.name === point.name)?.low ?? point?.low;
      });
    });
    setOptionsGraph(chartOptions[id].getOptions(idWithDomain, intl, data.dataGraph, studyType));
  }, [data.dataGraph, id, idWithDomain, intl, studyType]);

  useEffect(() => {
    setChartComments(customComments(data, idWithDomainAndStudyType, intl));
  }, [data, idWithDomainAndStudyType, intl]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !data || data.length <= 0}
      studyType={studyType}
    >
      <HighchartsReact
        highcharts={Highcharts}
        id={idWithDomainAndStudyType}
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
