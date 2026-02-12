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
import {
  domains,
  graphIds,
  studiesTypes,
} from '../../../../../utils/constants';
import { capitalize, withDomain, withtStudyType } from '../../../../../utils/helpers';
import ChartWrapper from '../../../../ChartWrapper';
import SimpleSelect from '../../../../SimpleSelect';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data-within-3-years-historical';

HCExporting(Highcharts);
HCExportingData(Highcharts);

function Chart({
  domain = 'health',
  hasComments = true,
  hasFooter = true,
  id = 'general.dynamique.chart-evolution-within-3-years-historical-academic',
  studyType = 'Interventional',
}) {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedDelay, setSelectedDelay] = useState('3y');
  const [sponsorType, setSponsorType] = useState('*');
  const { allData, isError, isLoading } = useGetData(studyType, sponsorType, selectedDelay);
  const { dataGraphWithin3YearsWithType, sponsorTypes, year } = allData;
  const idWithDomain = withDomain(id, domain);
  const idWithDomainAndStudyType = withtStudyType(idWithDomain, studyType);
  const sponsorTypeTitle = sponsorType !== '*'
    ? ` (${intl.formatMessage({ id: `app.sponsor.${sponsorType}` })})`
    : '';
  const selectedDelayTitle = intl.formatMessage({ id: `app.sponsor-results-delay-${selectedDelay}` });
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    dataGraphWithin3YearsWithType,
    studyType,
  );

  useEffect(() => {
    const optionsTmp = sponsorTypes || [];
    optionsTmp.unshift({
      label: capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
      value: '*',
    });
    setOptions(optionsTmp);
  }, [intl, sponsorTypes]);

  useEffect(() => {
    setChartComments(customComments(allData, idWithDomainAndStudyType, intl));
  }, [allData, idWithDomainAndStudyType, intl]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      dataTitle={{ selectedDelayTitle, sponsorTypeTitle, year }}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !allData}
      studyType={studyType}
    >
      <SimpleSelect
        label={intl.formatMessage({ id: 'app.sponsor-type-filter-label' })}
        onChange={(e) => setSponsorType(e.target.value)}
        options={options}
        selected={sponsorType}
      />
      <SimpleSelect
        label={intl.formatMessage({ id: 'app.sponsor-results-delay-filter-label' })}
        onChange={(e) => setSelectedDelay(e.target.value)}
        options={[
          { label: intl.formatMessage({ id: 'app.sponsor-results-delay-1y' }), value: '1y' },
          { label: intl.formatMessage({ id: 'app.sponsor-results-delay-3y' }), value: '3y' },
        ]}
        selected={selectedDelay}
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
