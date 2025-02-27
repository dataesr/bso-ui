/* eslint-disable react/no-this-in-sfc */
/* eslint-disable simple-import-sort/imports */
// import Axios from 'axios';
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { PUBLISHER_LIST } from '../../../../../config/publicationDataLists';
import { ES_API_URL, HEADERS } from '../../../../../config/config';
import customComments from '../../../../../utils/chartComments';
// import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { capitalize, withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import ChartWrapper from '../../../../ChartWrapper';
import SearchableSelect from '../../../../SearchableSelect';
import GraphComments from '../../../graph-comments';
// import useGetData from './get-data';
import useGetData from './get-data-josm';

highchartsMore(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const [options, setOptions] = useState([]);
  const [publisher, setPublisher] = useState('all-publishers');
  const { beforeLastObservationSnap, lastObservationSnap, observationSnaps } = useGlobals(domain);
  const { data, isError, isLoading } = useGetData(
    observationSnaps,
    beforeLastObservationSnap,
    publisher,
    domain,
  );
  const { categoriesViolin, dataGraphViolin } = data;
  const idWithDomain = withDomain(id, domain);
  const publisherTitle = publisher !== 'all-publishers' ? ` (${publisher})` : '';
  const dataTitle = { publisherTitle };
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    categoriesViolin,
    dataGraphViolin,
    dataTitle,
  );

  useEffect(() => {
    const opts = Object.entries(PUBLISHER_LIST).map(([key, value]) => ({
      label: value,
      value,
    }));
    opts.unshift({
      label: capitalize(intl.formatMessage({ id: 'app.all-publishers' })),
      value: 'all-publishers',
    });
    setOptions(opts);
  }, [domain, intl]);

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl));
  }, [data, idWithDomain, intl]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      dataTitle={dataTitle}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !dataGraphViolin || !categoriesViolin}
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
  id: 'publi.publishers.couts-publication.chart-distribution-par-annee',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
