import '../../../graph.scss';

import Axios from 'axios';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { simpleComments } from '../../../../../utils/chartComments';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import SimpleSelect from '../../../../SimpleSelect';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [affiliations, setAffiliations] = useState([]);
  const [chartComments, setChartComments] = useState('');
  const [affiliation, setAffiliation] = useState('*');
  const { lastObservationSnap, observationSnaps } = useGlobals();
  const { data, isLoading, isError } = useGetData(
    observationSnaps,
    affiliation,
    domain,
  );
  const { dataGraph1 } = data;
  const idWithDomain = withDomain(id, domain);
  const query = getFetchOptions(
    'affiliationsList',
    domain,
    lastObservationSnap,
  );

  useEffect(() => {
    setChartComments(simpleComments(dataGraph1, idWithDomain, intl));
  }, [dataGraph1, idWithDomain, intl]);

  useEffect(() => {
    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      setAffiliations(
        response.data.aggregations.by_affiliation.buckets
          .map((item) => item.key)
          .sort(),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    dataGraph1,
  );

  return (
    <WrapperChart
      isLoading={isLoading || !dataGraph1}
      isError={isError}
      id={id}
      domain={domain}
      chartRef={chartRef}
      graphFooter={graphFooter}
      graphComments={false}
    >
      <SimpleSelect
        label={intl.formatMessage({ id: 'app.affiliations-filter-label' })}
        onChange={(e) => setAffiliation(e.target.value)}
        options={affiliations}
        selected={affiliation}
        firstValue='*'
        firstLabel={intl.formatMessage({ id: 'app.all-affiliations' })}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={idWithDomain}
      />
      {graphComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  id: 'publi.affiliations.dynamique-ouverture.chart-taux-ouverture',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};
export default Chart;
