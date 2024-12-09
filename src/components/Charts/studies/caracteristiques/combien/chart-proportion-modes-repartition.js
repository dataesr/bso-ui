import '../../../graph.scss';

import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import customComments from '../../../../../utils/chartComments';
import { chartOptions } from '../../../../../utils/chartOptions';
import {
  domains,
  graphIds,
  studiesTypes,
} from '../../../../../utils/constants';
import {
  capitalize,
  withDomain,
  withtStudyType,
} from '../../../../../utils/helpers';
import ChartWrapper from '../../../../ChartWrapper';
import SimpleSelect from '../../../../SimpleSelect';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ hasFooter, hasComments, domain, id, studyType }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const [options, setOptions] = useState([]);
  const [sponsorType, setSponsorType] = useState('*');
  const { allData, isError, isLoading } = useGetData(
    studyType,
    sponsorType,
    id,
    domain,
  );
  const idWithDomain = withDomain(id, domain);
  const idWithDomainAndStudyType = withtStudyType(idWithDomain, studyType);
  const translationId = sponsorType !== '*' ? `app.sponsor.${sponsorType}` : '';
  const sponsorTypeTitle = sponsorType !== '*'
    ? ` (${intl.formatMessage({ id: translationId })})`
    : '';
  const dataTitle = { sponsorTypeTitle };
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    allData,
    studyType,
    dataTitle,
  );

  useEffect(() => {
    const opts = allData?.sponsorTypes || [];
    opts.unshift({
      label: capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
      value: '*',
    });
    setOptions(opts);
  }, [allData.sponsorTypes, intl]);

  useEffect(() => {
    setChartComments(customComments(allData, idWithDomainAndStudyType, intl));
  }, [allData, idWithDomainAndStudyType, intl]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isLoading={isLoading || !allData}
      isError={isError}
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
};

Chart.defaultProps = {
  domain: 'health',
  hasComments: true,
  hasFooter: true,
  id: 'caracteristiques.combien.chart-proportion-modes-repartition',
  studyType: 'Interventional',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  studyType: PropTypes.oneOf(studiesTypes),
};

export default Chart;
