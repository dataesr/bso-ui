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

  const archiveTitle = archive !== '*' ? ` (${archive})` : '';
  const dataTitle = { archiveTitle };
  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    dataGraph1,
    dataTitle,
  );

  return (
    <WrapperChart
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      id={id}
      hasComments={false}
      hasFooter={hasFooter}
      isError={isError}
      isLoading={isLoading || !dataGraph1}
    >
      <SimpleSelect
        firstLabel={intl.formatMessage({ id: 'app.all-repositories' })}
        firstValue='*'
        label={intl.formatMessage({ id: 'app.repositories-filter-label' })}
        onChange={(e) => setArchive(e.target.value)}
        options={archives || []}
        selected={archive}
      />
      <HighchartsReact
        highcharts={Highcharts}
        id={idWithDomain}
        options={optionsGraph}
        ref={chartRef}
      />
      {hasComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.repositories.dynamique-ouverture.chart-taux-ouverture',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};
export default Chart;
