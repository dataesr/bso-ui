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
  const [publishers, setPublishers] = useState([]);
  const [publisher, setPublisher] = useState('*');
  const [chartComments, setChartComments] = useState('');
  const { lastObservationSnap, observationSnaps } = useGlobals();
  const { data, isLoading, isError } = useGetData(
    observationSnaps,
    publisher,
    domain,
  );
  const { dataGraphTotal, categoriesYear } = data;
  const { search } = useLocation();
  const query = getFetchOptions({
    key: 'publishersList',
    domain,
    search,
    parameters: [lastObservationSnap],
  });
  const idWithDomain = withDomain(id, domain);
  const publisherTitle = publisher !== '*' ? ` (${publisher})` : '';
  const dataTitle = { publisherTitle };
  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    categoriesYear,
    dataGraphTotal,
    dataTitle,
  );

  useEffect(() => {
    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      setPublishers(
        response.data.aggregations.by_publisher.buckets.map((item) => item.key),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl, search));
  }, [data, idWithDomain, intl, search]);

  return (
    <WrapperChart
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !dataGraphTotal || !categoriesYear}
    >
      <SimpleSelect
        firstLabel={intl.formatMessage({ id: 'app.all-publishers' })}
        firstValue='*'
        label={intl.formatMessage({ id: 'app.publishers-filter-label' })}
        onChange={(e) => setPublisher(e.target.value)}
        options={publishers || []}
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
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.publishers.couts-publication.chart-depenses-estimees',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
