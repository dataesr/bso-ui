import { Toggle } from '@dataesr/react-dsfr';
import Axios from 'axios';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import treemapModule from 'highcharts/modules/treemap';
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
import useGetData from './get-data';

treemapModule(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ hasFooter, hasComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [isDetailed, setIsDetailed] = useState(false);
  const [publishers, setPublishers] = useState([]);
  const [publisher, setPublisher] = useState('*');

  const { lastObservationSnap, observationSnaps } = useGlobals();
  const { data, isLoading, isError } = useGetData(
    observationSnaps,
    isDetailed,
    publisher,
    domain,
  );
  const { dataGraphTreemap } = data;
  const query = getFetchOptions('publishersList', domain, lastObservationSnap);
  useEffect(() => {
    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      setPublishers(
        response.data.aggregations.by_publisher.buckets.map((item) => item.key),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const idWithDomain = withDomain(id, domain);
  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    dataGraphTreemap,
  );

  return (
    <WrapperChart
      isLoading={isLoading || !dataGraphTreemap}
      isError={isError}
      id={id}
      domain={domain}
      chartRef={chartRef.current}
      hasComments={hasComments}
      hasFooter={hasFooter}
    >
      <SimpleSelect
        label={intl.formatMessage({ id: 'app.publishers-filter-label' })}
        onChange={(e) => setPublisher(e.target.value)}
        options={publishers || []}
        selected={publisher}
        firstValue='*'
        firstLabel={intl.formatMessage({ id: 'app.all-publishers' })}
      />
      <Toggle
        checked={isDetailed}
        onChange={() => setIsDetailed(!isDetailed)}
        label={intl.formatMessage({ id: 'app.details' })}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={idWithDomain}
      />
    </WrapperChart>
  );
};

Chart.defaultProps = {
  hasFooter: true,
  hasComments: true,
  id: 'publi.publishers.repartition-licences.chart-repartition',
  domain: '',
};
Chart.propTypes = {
  hasFooter: PropTypes.bool,
  hasComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
