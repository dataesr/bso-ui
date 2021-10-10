import Axios from 'axios';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import SimpleSelect from '../../../../SimpleSelect';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data-taux-ouverture';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [agencies, setAgencies] = useState([]);
  const [agency, setAgency] = useState('*');
  const { lastObservationSnap } = useGlobals();
  const { allData, isLoading, isError } = useGetData(
    lastObservationSnap,
    agency,
    domain,
  );
  const { dataGraph, categories } = allData;
  const query = getFetchOptions('allAgencies', domain, lastObservationSnap);
  useEffect(() => {
    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      setAgencies(
        response.data.aggregations.by_agency.buckets.map((item) => item.key),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    categories,
    dataGraph,
  );

  return (
    <WrapperChart
      id={id}
      domain={domain}
      chartRef={chartRef}
      isLoading={isLoading || !dataGraph || !categories}
      isError={isError}
    >
      <SimpleSelect
        label={intl.formatMessage({ id: 'app.agencies-filter-label' })}
        onChange={(e) => setAgency(e.target.value)}
        options={agencies}
        selected={agency}
        firstValue='*'
        firstLabel={intl.formatMessage({ id: 'app.all-agencies' })}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={id}
      />
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  id: 'publi.general.impact-financement.chart-taux-ouverture',
};
Chart.propTypes = {
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
