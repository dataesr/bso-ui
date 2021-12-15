import '../../../graph.scss';

import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
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
highchartsMore(Highcharts);

const Chart = ({ hasFooter, hasComments, domain, id, studyType }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [sponsorType, setSponsorType] = useState('*');
  const [chartComments, setChartComments] = useState('');
  const { search } = useLocation();
  const { allData, isLoading, isError } = useGetData(
    studyType,
    sponsorType,
    id,
  );
  const idWithDomainAndStudyType = withtStudyType(
    withDomain(id, domain),
    studyType,
  );

  useEffect(() => {
    setChartComments(
      customComments(allData, idWithDomainAndStudyType, intl, search),
    );
  }, [allData, idWithDomainAndStudyType, intl, search]);

  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    allData,
    studyType,
  );

  return (
    <WrapperChart
      isLoading={isLoading || !allData}
      isError={isError}
      id={id}
      domain={domain}
      studyType={studyType}
      chartRef={chartRef}
      hasFooter={hasFooter}
      hasComments={false}
    >
      <SimpleSelect
        label={intl.formatMessage({ id: 'app.sponsor-type-filter-label' })}
        onChange={(e) => setSponsorType(e.target.value)}
        options={allData?.sponsorTypes || []}
        selected={sponsorType}
        firstValue='*'
        firstLabel={intl.formatMessage({ id: 'app.all-sponsor-types' })}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={idWithDomainAndStudyType}
      />
      {hasComments && chartComments && (
        <GraphComments comments={chartComments} />
      )}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  hasFooter: true,
  hasComments: true,
  domain: 'health',
  studyType: 'Interventional',
  id: 'resultats.delai-diffusion.chart-distribution',
};
Chart.propTypes = {
  hasFooter: PropTypes.bool,
  hasComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
  studyType: PropTypes.oneOf(studiesTypes),
};

export default Chart;
