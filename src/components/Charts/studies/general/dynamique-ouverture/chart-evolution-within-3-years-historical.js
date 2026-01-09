import '../../../graph.scss';

import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import customComments from '../../../../../utils/chartComments';
import { chartOptions } from '../../../../../utils/chartOptions';
import {
  domains,
  graphIds,
  studiesTypes,
} from '../../../../../utils/constants';
import {
  capitalize,
  isInProduction,
  withDomain,
  withtStudyType,
} from '../../../../../utils/helpers';
import useLang from '../../../../../utils/Hooks/useLang';
import ChartWrapper from '../../../../ChartWrapper';
import SearchableSelect from '../../../../SearchableSelect';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data-historical';

HCExporting(Highcharts);
HCExportingData(Highcharts);

function Chart({ domain, hasComments, hasFooter, id, studyType }) {
  const chartRef = useRef();
  const intl = useIntl();
  const { lang, urls } = useLang();
  const { pathname } = useLocation();
  const [chartComments, setChartComments] = useState('');
  const [options, setOptions] = useState([]);
  const [sponsor, setSponsor] = useState('*');
  const { allData, isError, isLoading } = useGetData(studyType, sponsor);
  const { dataGraphWithin3Years } = allData;
  const idWithDomain = withDomain(id, domain);
  const idWithDomainAndStudyType = withtStudyType(idWithDomain, studyType);

  useEffect(() => {
    const opts = allData?.sponsors || [];
    opts.unshift({
      label: capitalize(intl.formatMessage({ id: 'app.all-sponsors' })),
      value: '*',
    });
    setOptions(opts);
  }, [allData.sponsors, intl]);

  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    dataGraphWithin3Years,
    studyType,
  );

  useEffect(() => {
    setChartComments(customComments(allData, idWithDomainAndStudyType, intl));
  }, [allData, idWithDomainAndStudyType, intl]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !allData}
      studyType={studyType}
    >
      {!isInProduction() && pathname === urls.santeEssais.tabs[2][lang] && (
        <SearchableSelect
          label={intl.formatMessage({ id: 'app.sponsor-filter-label' })}
          onChange={(e) => (e.length > 0 ? setSponsor(e) : null)}
          options={options}
          selected={sponsor}
        />
      )}
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

Chart.defaultProps = {
  domain: 'health',
  hasComments: true,
  hasFooter: true,
  id: 'general.dynamique.chart-evolution-within-3-years-historical',
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
