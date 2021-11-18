import '../../../graph.scss';

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
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ hasFooter, hasComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [archives, setArchives] = useState([]);
  const [archive, setArchive] = useState('*');
  const { observationSnaps, lastObservationSnap } = useGlobals();
  const [chartComments, setChartComments] = useState('');
  const { data, isLoading, isError } = useGetData(
    observationSnaps,
    archive,
    domain,
  );
  const { dataGraph1 } = data;
  const { search } = useLocation();
  const query = getFetchOptions({
    key: 'repositoriesList',
    domain,
    search,
    parameters: [lastObservationSnap],
  });
  const idWithDomain = withDomain(id, domain);

  useEffect(() => {
    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      setArchives(
        response.data.aggregations.by_repository.buckets.map(
          (item) => item.key,
        ),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setChartComments(customComments(dataGraph1, idWithDomain, intl));
  }, [dataGraph1, idWithDomain, intl]);

  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    dataGraph1,
  );

  return (
    <WrapperChart
      id={id}
      domain={domain}
      chartRef={chartRef}
      hasComments={false}
      hasFooter={hasFooter}
      isLoading={isLoading || !dataGraph1}
      isError={isError}
    >
      <SimpleSelect
        label={intl.formatMessage({ id: 'app.repositories-filter-label' })}
        onChange={(e) => setArchive(e.target.value)}
        options={archives || []}
        selected={archive}
        firstValue='*'
        firstLabel={intl.formatMessage({ id: 'app.all-repositories' })}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={idWithDomain}
      />
      {hasComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  hasFooter: true,
  hasComments: true,
  id: 'publi.repositories.dynamique-ouverture.chart-taux-ouverture',
  domain: '',
};
Chart.propTypes = {
  hasFooter: PropTypes.bool,
  hasComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};
export default Chart;
