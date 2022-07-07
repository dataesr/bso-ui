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
import { withContext, withDomain } from '../../../../../utils/helpers';
import SimpleSelect from '../../../../SimpleSelect';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ hasFooter, hasComments, domain, id, studyType }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [sponsorType, setSponsorType] = useState('*');
  const [chartComments, setChartComments] = useState('');
  const { allData, isLoading, isError } = useGetData(studyType, sponsorType);
  const { dataGraph2 } = allData;
  const idWithDomainAndStudyType = withContext(id, domain, studyType);
  const translationId = sponsorType !== '*' ? `app.sponsor.${sponsorType}` : '';
  const sponsorTypeTitle = sponsorType !== '*'
    ? ` (${intl.formatMessage({ id: translationId })})`
    : '';
  const dataTitle = { sponsorTypeTitle };
  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    dataGraph2,
    studyType,
    dataTitle,
  );

  useEffect(() => {
    setChartComments(customComments(allData, idWithDomainAndStudyType, intl));
  }, [allData, idWithDomainAndStudyType, intl]);

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
  id: 'resultats.type-diffusion.chart-repartition-par-type',
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
