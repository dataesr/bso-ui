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
import customComments from '../../../../../utils/chartComments';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { capitalize, withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import SearchableSelect from '../../../../SearchableSelect';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [archive, setArchive] = useState('*');
  const [chartComments, setChartComments] = useState('');
  const [options, setOptions] = useState([]);
  const { observationSnaps, lastObservationSnap } = useGlobals();
  const { data, isError, isLoading } = useGetData(
    observationSnaps,
    archive,
    domain,
  );
  const { dataGraph1 } = data;
  const idWithDomain = withDomain(id, domain);
  const archiveTitle = archive !== '*' ? ` (${archive})` : '';
  const dataTitle = { archiveTitle };
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    dataGraph1,
    dataTitle,
  );

  useEffect(() => {
    const query = getFetchOptions({
      key: 'repositoriesList',
      domain,
      parameters: [lastObservationSnap],
    });
    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      const opts = response.data.aggregations.by_repository.buckets.map(
        (item) => ({
          label: intl.formatMessage({
            id: `app.repositories.label.${item.key
              .toLowerCase()
              .replace(/ /g, '')}`,
            defaultMessage: item.key,
          }),
          value: item.key,
        }),
      );
      opts.unshift({
        label: capitalize(intl.formatMessage({ id: 'app.all-repositories' })),
        value: '*',
      });
      setOptions(opts);
    });
  }, [domain, intl, lastObservationSnap]);

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl));
  }, [data, idWithDomain, intl]);

  return (
    <WrapperChart
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !dataGraph1}
    >
      <SearchableSelect
        label={intl.formatMessage({ id: 'app.repositories-filter-label' })}
        onChange={(e) => (e.length > 0 ? setArchive(e) : null)}
        options={options}
        selected={archive}
      />
      <HighchartsReact
        highcharts={Highcharts}
        id={idWithDomain}
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
