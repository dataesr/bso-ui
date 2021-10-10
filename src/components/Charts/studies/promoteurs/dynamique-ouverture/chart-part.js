import '../../../graph.scss';

import Axios from 'axios';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import customComments from '../../../../../utils/chartComments';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
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

const Chart = ({ graphFooter, graphComments, domain, id, studyType }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [sponsors, setSponsors] = useState([]);
  const [sponsor, setSponsor] = useState('*');
  const [chartComments, setChartComments] = useState('');
  const { allData, isLoading, isError } = useGetData(studyType, sponsor);
  const { dataGraph1 } = allData;
  const query = getFetchOptions('sponsorsList', '', studyType);
  useEffect(() => {
    Axios.post(ES_STUDIES_API_URL, query, HEADERS).then((response) => {
      setSponsors(
        response.data.aggregations.by_sponsor.buckets.map((item) => item.key),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const idWithDomainAndStudyType = withtStudyType(
    withDomain(id, domain),
    studyType,
  );

  useEffect(() => {
    setChartComments(customComments(allData, idWithDomainAndStudyType, intl));
  }, [allData, idWithDomainAndStudyType, intl]);

  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    dataGraph1,
    studyType,
  );

  return (
    <WrapperChart
      isLoading={isLoading || !allData}
      isError={isError}
      id={id}
      studyType={studyType}
      domain={domain}
      chartRef={chartRef}
      graphFooter={graphFooter}
      graphComments={false}
    >
      <SimpleSelect
        label={intl.formatMessage({ id: 'app.sponsor-filter-label' })}
        onChange={(e) => setSponsor(e.target.value)}
        options={sponsors}
        selected={sponsor}
        firstValue='*'
        firstLabel={intl.formatMessage({ id: 'app.all-sponsors' })}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={idWithDomainAndStudyType}
      />
      {graphComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  domain: 'health',
  studyType: 'Interventional',
  id: 'promoteurs.dynamique-ouverture.chart-part',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
  studyType: PropTypes.oneOf(studiesTypes),
};

export default Chart;
