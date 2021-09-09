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
  const query = getFetchOptions(
    'repositoriesList',
    domain,
    lastObservationSnap,
  );
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
    setChartComments(simpleComments(dataGraph1, idWithDomain, intl));
  }, [dataGraph1, idWithDomain, intl]);

  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    dataGraph1,
  );

  return (
    <WrapperChart
      id={id}
      domain={domain}
      chartRef={chartRef}
      graphComments={false}
      graphFooter={graphFooter}
      isLoading={isLoading || !dataGraph1}
      isError={isError}
    >
      <SimpleSelect
        label={intl.formatMessage({ id: 'app.repositories-filter-label' })}
        onChange={(e) => setArchive(e.target.value)}
        options={archives}
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
      {graphComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  id: 'publi.repositories.dynamique-ouverture.chart-taux-ouverture',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};
export default Chart;
