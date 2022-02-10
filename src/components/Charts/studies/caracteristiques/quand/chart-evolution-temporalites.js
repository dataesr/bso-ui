import '../../../graph.scss';

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
import {
  domains,
  graphIds,
  studiesTypes,
} from '../../../../../utils/constants';
import { withDomain, withtStudyType } from '../../../../../utils/helpers';
import SimpleSelect from '../../../../SimpleSelect';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id, studyType }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [sponsorType, setSponsorType] = useState('*');
  const [chartComments, setChartComments] = useState('');
  const { search } = useLocation();
  const { allData, isLoading, isError } = useGetData(studyType, sponsorType);
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
    idWithDomainAndStudyType,
    studyType,
    dataTitle,
  );

  useEffect(() => {
    setChartComments(
      customComments(allData, idWithDomainAndStudyType, intl, search),
    );
  }, [allData, idWithDomainAndStudyType, intl, search]);

  return (
    <WrapperChart
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !allData}
      studyType={studyType}
    >
      <SimpleSelect
        firstLabel={intl.formatMessage({ id: 'app.all-sponsor-types' })}
        firstValue='*'
        label={intl.formatMessage({ id: 'app.sponsor-type-filter-label' })}
        onChange={(e) => setSponsorType(e.target.value)}
        options={allData?.sponsorTypes || []}
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
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: 'health',
  hasComments: true,
  hasFooter: true,
  id: 'caracteristiques.quand.chart-evolution-temporalites',
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
