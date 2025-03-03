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
import { PUBLISHER_LIST } from '../../../../../config/publicationDataLists';
import customComments from '../../../../../utils/chartComments';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { capitalize, withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import ChartWrapper from '../../../../ChartWrapper';
import SearchableSelect from '../../../../SearchableSelect';
import Toggle from '../../../../Toggle/Toggle';
import GraphComments from '../../../graph-comments';
// import useGetData from './get-data';
import useGetData from './get-data-josm';

treemapModule(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const [isDetailed, setIsDetailed] = useState(false);
  const [options, setOptions] = useState([]);
  const [publisher, setPublisher] = useState('*');
  const { lastObservationSnap, observationSnaps } = useGlobals();
  const { data, isError, isLoading } = useGetData(
    observationSnaps,
    isDetailed,
    publisher,
    domain,
  );
  const { dataGraphTreemap } = data;
  const idWithDomain = withDomain(id, domain);
  const publisherTitle = publisher !== '*' ? ` (${publisher})` : '';
  const dataTitle = { publisherTitle };
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    dataGraphTreemap,
    dataTitle,
  );

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl));
  }, [data, idWithDomain, intl]);

  useEffect(() => {
    const opts = PUBLISHER_LIST.map((item) => ({ label: item, value: item }));
    opts.unshift({
      label: capitalize(intl.formatMessage({ id: 'app.all-publishers' })),
      value: '*',
    });
    setOptions(opts);
  }, [intl]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isLoading={isLoading || !dataGraphTreemap}
      isError={isError}
    >
      <SearchableSelect
        label={intl.formatMessage({ id: 'app.publishers-filter-label' })}
        onChange={(e) => (e.length > 0 ? setPublisher(e) : null)}
        options={options || []}
        selected={publisher}
      />
      <Toggle
        checked={isDetailed}
        label={intl.formatMessage({ id: 'app.details' })}
        onChange={() => setIsDetailed(!isDetailed)}
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
  id: 'publi.publishers.repartition-licences.chart-repartition',
};

Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
