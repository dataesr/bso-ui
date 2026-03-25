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
import { capitalize, withDomain, withtStudyType } from '../../../../../utils/helpers';
import ChartWrapper from '../../../../ChartWrapper';
import SimpleSelect from '../../../../SimpleSelect';
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
  const [options, setOptions] = useState([]);
  const [optionsGraph, setOptionsGraph] = useState(null);
  const [sponsorType, setSponsorType] = useState('*');

  const sponsorTypeTitle = sponsorType !== '*'
    ? ` (${intl.formatMessage({ id: `app.sponsor.${sponsorType}` })})`
    : '';
  const { data, isError, isLoading } = useGetData(studyType, sponsorType);
  const idWithDomain = withDomain(id, domain);
  const idWithDomainAndStudyType = withtStudyType(idWithDomain, studyType);

  useEffect(() => {
    const opts = data?.sponsorTypes || [];
    opts.unshift({
      label: capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
      value: '*',
    });
    setOptions(opts);
  }, [data, intl]);

  useEffect(() => {
    (data?.dataGraph ?? [])?.forEach((line, index) => {
      const nextLine = data.dataGraph.find((l) => l.year === line.year + 1);
      (line?.data ?? [])?.forEach((point) => {
        // eslint-disable-next-line no-param-reassign
        point.high = nextLine?.data?.find((p) => p.year === point.year)?.low ?? point?.low;
        if (index === data.dataGraph.length - 2) {
          // eslint-disable-next-line no-param-reassign
          point.label = `${Math.round(point.high)} % (${point.y_abs} / ${point.y_tot})`;
        }
      });
    });
    setOptionsGraph(chartOptions[id].getOptions(idWithDomain, intl, data.dataGraph, studyType));
  }, [data.dataGraph, id, idWithDomain, intl, studyType]);

  useEffect(() => {
    const exampleYear = 2020;
    const comments = { comments: {
      exampleValue: Math.round(data?.dataGraph?.[data?.dataGraph?.length - 1]?.data?.find((item) => item.year === exampleYear)?.low),
      exampleYear,
      obsMin: data?.dataGraph?.[0]?.year,
    } };
    setChartComments(customComments(comments, idWithDomainAndStudyType, intl));
  }, [data?.dataGraph, idWithDomainAndStudyType, intl]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      dataTitle={{ sponsorTypeTitle, year: data?.dataGraph?.[0].data?.[0]?.year }}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !data || data.length <= 0}
      studyType={studyType}
    >
      <SimpleSelect
        label={intl.formatMessage({ id: 'app.sponsor-type-filter-label' })}
        onChange={(e) => setSponsorType(e.target.value)}
        options={options}
        selected={sponsorType}
      />
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
