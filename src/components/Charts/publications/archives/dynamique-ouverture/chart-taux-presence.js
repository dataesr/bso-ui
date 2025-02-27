/* eslint-disable react/no-this-in-sfc */
import '../../../graph.scss';

// import Axios from 'axios';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

// import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { REPOSITORY_LIST } from '../../../../../config/publicationDataLists';
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

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [archive, setArchive] = useState('*');
  const [chartComments, setChartComments] = useState('');
  const [options, setOptions] = useState([]);
  const { lastObservationSnap, observationSnaps } = useGlobals();
  const { data, isError, isLoading } = useGetData(
    observationSnaps,
    archive,
    domain,
  );
  const { categories, dataGraph2 } = data;
  const idWithDomain = withDomain(id, domain);
  const archiveTitle = archive !== '*' ? ` (${archive})` : '';
  const dataTitle = { archiveTitle };
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    dataGraph2,
    categories,
    dataTitle,
  );

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl));
  }, [data, idWithDomain, intl]);

  useEffect(() => {
    // REPOSITORY_LISTを配列に変換
    const repositoryArray = Object.keys(REPOSITORY_LIST).map((key) => ({
      label: capitalize(intl.formatMessage({ id: `app.${key}`, defaultMessage: key })),
      value: REPOSITORY_LIST[key],
    }));
    repositoryArray.unshift({
      label: capitalize(intl.formatMessage({ id: 'app.all-repositories' })),
      value: '*',
    });
    setOptions(repositoryArray);
  }, [intl]);

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
    </ChartWrapper>
  );
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.repositories.dynamique-ouverture.chart-evolution-proportion',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
