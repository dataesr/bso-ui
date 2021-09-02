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
import { domains, graphIds } from '../../../../../utils/constants';
import {
  getFetchOptions,
  getGraphOptions,
  getPercentageYAxis,
} from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import SimpleSelect from '../../../../SimpleSelect';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import GraphTitle from '../../../graph-title';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [publisher, setPublisher] = useState('*');
  const [publishers, setPublishers] = useState([]);
  const { lastObservationSnap, observationSnaps, updateDate } = useGlobals();
  const { data, isLoading, isError } = useGetData(
    observationSnaps,
    publisher,
    domain,
  );
  const { dataGraph2 } = data;
  const query = getFetchOptions('publishersList', domain, lastObservationSnap);
  const term = {};
  term[`oa_details.${lastObservationSnap}.oa_host_type`] = 'publisher';
  query.query.bool.filter.push({ term });
  useEffect(() => {
    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      setPublishers(
        response.data.aggregations.by_publisher.buckets.map((item) => item.key),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || !dataGraph2) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  const optionsGraph2 = getGraphOptions(id, intl);
  optionsGraph2.chart.type = 'spline';
  optionsGraph2.yAxis = getPercentageYAxis();
  optionsGraph2.xAxis = { title: { text: 'Années de publication' } };
  optionsGraph2.legend = { verticalAlign: 'top' };
  optionsGraph2.plotOptions = { series: { pointStart: 2013 } };
  optionsGraph2.series = dataGraph2;

  const exportChartPng = () => {
    chartRef.current.chart.exportChart({
      type: 'image/png',
    });
  };
  const exportChartCsv = () => {
    chartRef.current.chart.downloadCSV();
  };

  const indMax = dataGraph2[1]?.data.length - 1;
  const chartComments = intl.formatMessage(
    { id: `${id}.comments` },
    {
      a: dataGraph2[1]?.name,
      b: dataGraph2[0]?.name,
      c: 2013 + indMax,
      d: dataGraph2[0]?.data[indMax] - dataGraph2[1]?.data[indMax],
      e: dataGraph2[1]?.data[indMax],
      f: dataGraph2[0]?.data[indMax],
      g: 2013 + indMax - 1,
      h: dataGraph2[0]?.data[indMax - 1] - dataGraph2[1]?.data[indMax - 1],
      i: dataGraph2[1]?.data[indMax - 1],
      j: dataGraph2[0]?.data[indMax - 1],
      k: dataGraph2[1]?.data[indMax - 1] - dataGraph2[2]?.data[indMax - 1],
      l: dataGraph2[2]?.name,
      m: dataGraph2[1]?.name,
    },
  );

  return (
    <>
      <div className='graph-container'>
        <GraphTitle title={intl.formatMessage({ id: `${id}.title` })} />
        <SimpleSelect
          label={intl.formatMessage({ id: 'app.publishers-filter-label' })}
          onChange={(e) => setPublisher(e.target.value)}
          options={publishers}
          selected={publisher}
          firstValue='*'
          firstLabel={intl.formatMessage({ id: 'app.all-publishers' })}
        />
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsGraph2}
          ref={chartRef}
          id={id}
        />
        {graphComments && <GraphComments comments={chartComments} />}
      </div>
      {graphFooter && (
        <GraphFooter
          date={updateDate}
          source={intl.formatMessage({ id: `${id}.source` })}
          graphId={id}
          onPngButtonClick={exportChartPng}
          onCsvButtonClick={exportChartCsv}
        />
      )}
    </>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  id: 'app.national-publi.publishers.dynamique-ouverture.chart-evolution-proportion',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
