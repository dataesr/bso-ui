/* eslint-disable react/no-this-in-sfc */
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
import {
  getGraphOptions,
  longComments,
} from '../../../../../utils/chartHelpers';
import { domains, graphIds } from '../../../../../utils/constants';
import {
  getFetchOptions,
  getPercentageYAxis,
} from '../../../../../utils/helpers';
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
  const { lastObservationSnap, observationSnaps } = useGlobals();
  const [chartComments, setChartComments] = useState('');

  const { data, isLoading, isError } = useGetData(
    observationSnaps,
    archive,
    domain,
  );
  const { dataGraph2 } = data;
  const query = getFetchOptions(
    'repositoriesList',
    domain,
    lastObservationSnap,
  );
  const term = {};
  term[`oa_details.${lastObservationSnap}.oa_host_type`] = 'repository';
  query.query.bool.filter.push({ term });
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
  const optionsGraph2 = getGraphOptions(id, intl);

  optionsGraph2.chart.type = 'spline';
  optionsGraph2.yAxis = getPercentageYAxis();
  optionsGraph2.xAxis = { title: { text: 'Années de publication' } };
  optionsGraph2.legend = { verticalAlign: 'top' };
  optionsGraph2.plotOptions = { series: { pointStart: 2013 } };
  optionsGraph2.series = dataGraph2;

  useEffect(() => {
    setChartComments(longComments(dataGraph2, id, intl));
  }, [dataGraph2, id, intl]);

  return (
    <WrapperChart
      isLoading={isLoading || !dataGraph2}
      isError={isError}
      id={id}
      chartRef={chartRef}
      graphComments={false}
      graphFooter={graphFooter}
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
        options={optionsGraph2}
        ref={chartRef}
        id={id}
      />
      {graphComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  id: 'app.national-publi.repositories.dynamique-ouverture.chart-evolution-proportion',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
