import Axios from 'axios';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import customComments from '../../../../../utils/chartComments';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import SimpleSelect from '../../../../SimpleSelect';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data-taux-ouverture';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [agencies, setAgencies] = useState([]);
  const [agency, setAgency] = useState('*');
  const [chartComments, setChartComments] = useState('');
  const { lastObservationSnap } = useGlobals();
  const { allData, isLoading, isError } = useGetData(
    lastObservationSnap,
    agency,
    domain,
  );
  const { dataGraph, categories } = allData;
  const { search } = useLocation();
  const query = getFetchOptions({
    key: 'allAgencies',
    domain,
    search,
    parameters: [lastObservationSnap],
  });
  useEffect(() => {
    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      setAgencies(
        response.data.aggregations.by_agency.buckets.map((item) => ({
          value: item.key,
          label: item.key,
        })),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const agencyTitle = agency !== '*' ? ` (${agency})` : '';
  const dataTitle = { agencyTitle };
  const idWithDomain = withDomain(id, domain);
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    categories,
    dataGraph,
    dataTitle,
  );

  useEffect(() => {
    setChartComments(customComments(allData, idWithDomain, intl, search));
  }, [allData, idWithDomain, intl, search]);

  return (
    <WrapperChart
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasComments={false}
      id={id}
      isError={isError}
      isLoading={isLoading || !dataGraph || !categories}
    >
      <SimpleSelect
        firstLabel={intl.formatMessage({ id: 'app.all-agencies' })}
        firstValue='*'
        label={intl.formatMessage({ id: 'app.agencies-filter-label' })}
        onChange={(e) => setAgency(e.target.value)}
        options={agencies || []}
        selected={agency}
      />
      <HighchartsReact
        highcharts={Highcharts}
        id={id}
        options={optionsGraph}
        ref={chartRef}
      />
      {hasComments && chartComments && (
        <GraphComments comments={chartComments} />
      )}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  id: 'publi.general.impact-financement.chart-taux-ouverture',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
