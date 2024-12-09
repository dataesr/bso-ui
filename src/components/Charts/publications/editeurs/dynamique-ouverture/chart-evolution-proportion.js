/* eslint-disable react/no-this-in-sfc */
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
import ChartWrapper from '../../../../ChartWrapper';
import SearchableSelect from '../../../../SearchableSelect';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const [options, setOptions] = useState([]);
  const [publisher, setPublisher] = useState('*');
  const { lastObservationSnap, observationSnaps } = useGlobals();
  const { data, isError, isLoading } = useGetData(
    observationSnaps,
    publisher,
    domain,
  );
  const { categories, dataGraph2 } = data;
  const idWithDomain = withDomain(id, domain);
  const publisherTitle = publisher !== '*' ? ` (${publisher})` : '';
  const dataTitle = { publisherTitle };
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    dataGraph2,
    dataTitle,
    categories,
  );

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl));
  }, [data, idWithDomain, intl]);

  useEffect(() => {
    const query = getFetchOptions({
      key: 'publishersList',
      domain,
      parameters: [lastObservationSnap],
    });

    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      const opts = response.data.aggregations.by_publisher.buckets
        .filter(
          (item) => !['Cold Spring Harbor Laboratory', 'unknown'].includes(item.key),
        )
        .map((item) => ({ label: item.key, value: item.key }));
      opts.unshift({
        label: capitalize(intl.formatMessage({ id: 'app.all-publishers' })),
        value: '*',
      });
      setOptions(opts);
    });
  }, [domain, intl, lastObservationSnap]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !dataGraph2}
    >
      <SearchableSelect
        label={intl.formatMessage({ id: 'app.publishers-filter-label' })}
        onChange={(e) => (e.length > 0 ? setPublisher(e) : null)}
        options={options || []}
        selected={publisher}
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
    </ChartWrapper>
  );
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.publishers.dynamique-ouverture.chart-evolution-proportion',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
