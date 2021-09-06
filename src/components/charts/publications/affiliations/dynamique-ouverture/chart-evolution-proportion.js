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
import { longComments } from '../../../../../utils/chartComments';
import {
  getFetchOptions,
  getGraphOptions,
} from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { getPercentageYAxis } from '../../../../../utils/helpers';
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
  const [affiliations, setAffiliations] = useState([]);
  const [affiliation, setAffiliation] = useState('*');
  const { lastObservationSnap, observationSnaps } = useGlobals();
  const [chartComments, setChartComments] = useState('');
  const { data, isLoading, isError } = useGetData(
    observationSnaps,
    affiliation,
    domain,
  );
  const { dataGraph2 } = data;
  const query = getFetchOptions(
    'affiliationsList',
    'health',
    lastObservationSnap,
  );
  useEffect(() => {
    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      setAffiliations(
        response.data.aggregations.by_affiliation.buckets
          .map((item) => item.key)
          .sort(),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const optionsGraph2 = getGraphOptions(id, intl);
  optionsGraph2.chart.type = 'spline';
  optionsGraph2.xAxis = {
    title: { text: intl.formatMessage({ id: `${id}.xAxis` }) },
  };
  optionsGraph2.yAxis = getPercentageYAxis();
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
      graphFooter={graphFooter}
      graphComments={false}
    >
      <SimpleSelect
        label={intl.formatMessage({ id: 'app.affiliations-filter-label' })}
        onChange={(e) => setAffiliation(e.target.value)}
        options={affiliations}
        selected={affiliation}
        firstValue='*'
        firstLabel={intl.formatMessage({ id: 'app.all-affiliations' })}
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
  id: 'app.national-publi.affiliations.dynamique-ouverture.chart-evolution-proportion',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
