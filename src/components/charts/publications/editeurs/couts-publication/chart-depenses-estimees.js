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
import {
  cleanNumber,
  getFetchOptions,
  getGraphOptions,
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

const Chart = ({ graphFooter, graphComments, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const graphId = 'app.sante-publi.publishers.couts-publication.chart-depenses-estimees';
  const [publishers, setPublishers] = useState([]);
  const [publisher, setPublisher] = useState('*');

  const { lastObservationSnap, observationSnaps, updateDate } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationSnaps, publisher);
  const { dataGraphTotal, categoriesYear } = data;
  const query = getFetchOptions(
    'publishersList',
    'health',
    lastObservationSnap,
  );
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

  if (isLoading || !dataGraphTotal || !categoriesYear) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }
  const optionsGraph = getGraphOptions(id, intl);
  optionsGraph.chart.type = 'column';
  optionsGraph.xAxis = {
    categories: categoriesYear,
  };
  optionsGraph.yAxis = {
    stackLabels: {
      enabled: true,
      // eslint-disable-next-line
      formatter: function () {
        // eslint-disable-next-line
        return `${cleanNumber(this.total)} €`;
      },
      style: {
        fontWeight: 'bold',
      },
    },
    labels: {
      // eslint-disable-next-line
      formatter: function () {
        // eslint-disable-next-line
        return this.axis.defaultLabelFormatter.call(this).concat(' €');
      },
    },
  };
  optionsGraph.series = dataGraphTotal;
  optionsGraph.legend = {
    title: {
      text: intl.formatMessage({ id: `${graphId}.legend` }),
    },
  };
  optionsGraph.plotOptions = {
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: true,
        // eslint-disable-next-line
        formatter: function () {
          // eslint-disable-next-line
          return cleanNumber(this.y).concat(' €');
        },
      },
    },
  };

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
  id: 'app.national-publi.publishers.couts-publication.chart-depenses-estimees',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
