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
import { graphIds } from '../../../../../utils/constants';
import { getFetchOptions, getGraphOptions } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import SimpleSelect from '../../../../SimpleSelect';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import GraphTitle from '../../../graph-title';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [publishers, setPublishers] = useState([]);
  const [publisher, setPublisher] = useState('*');

  const { observationSnaps, updateDate } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationSnaps, publisher);
  const { dataGraphViolin, categoriesViolin } = data;
  const query = getFetchOptions('publishersList', 'health', observationSnaps[0]);
  const term = {};
  term[`oa_details.${observationSnaps[0]}.oa_host_type`] = 'publisher';
  query.query.bool.filter.push({ term });
  useEffect(() => {
    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      setPublishers(
        response.data.aggregations.by_publisher.buckets
          .map((item) => item.key),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || !dataGraphViolin || !categoriesViolin) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  const optionsGraph = getGraphOptions(id, intl);
  optionsGraph.chart = {
    type: 'areasplinerange',
    inverted: true,
  };
  optionsGraph.xAxis = {
    title: { text: intl.formatMessage({ id: `${id}.xAxis` }) },
    reversed: false,
    labels: {
      // eslint-disable-next-line
      formatter: function () {
        return this.axis.defaultLabelFormatter.call(this).concat(' €');
      },
    },
  };
  optionsGraph.yAxis = {
    categories: categoriesViolin,
    min: 0,
  };
  optionsGraph.plotOptions = {
    areasplinerange: {
      marker: {
        enabled: false,
      },
      // pointStart: xi[0]
    },
    scatter: {
      lineWidth: 1,
    },
  };
  optionsGraph.series = dataGraphViolin;

  const exportChartPng = () => {
    chartRef.current.chart.exportChart({
      type: 'image/png',
    });
  };
  const exportChartCsv = () => {
    chartRef.current.chart.downloadCSV();
  };

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
          options={optionsGraph}
          ref={chartRef}
          id={id}
        />
        {graphComments && (
          <GraphComments
            comments={intl.formatMessage({ id: `${id}.comments` })}
          />
        )}
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
  id: 'app.national-publi.publishers.couts-publication.chart-distribution-par-annee',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
