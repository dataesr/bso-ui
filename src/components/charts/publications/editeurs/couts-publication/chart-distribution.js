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
import { getFetchOptions, getGraphOptions } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import SimpleSelect from '../../../../SimpleSelect';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();

  const [publishers, setPublishers] = useState([]);
  const [publisher, setPublisher] = useState('*');
  const { observationSnaps, lastObservationSnap } = useGlobals(domain);
  const { data, isLoading, isError } = useGetData(
    observationSnaps,
    publisher,
    domain,
  );
  const { dataGraphHistogram, categoriesHistogram } = data;
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
  const optionsGraph = getGraphOptions(id, intl);

  optionsGraph.chart.type = 'column';
  optionsGraph.xAxis = {
    categories: categoriesHistogram,
    title: { text: intl.formatMessage({ id: `${id}.xAxis` }) },
    labels: {
      // eslint-disable-next-line
      formatter: function () {
        return this.axis.defaultLabelFormatter.call(this).concat(' €');
      },
    },
  };
  optionsGraph.yAxis = {
    title: { text: intl.formatMessage({ id: `${id}.yAxis` }) },
  };
  optionsGraph.series = dataGraphHistogram;
  optionsGraph.legend = {
    title: {
      text: intl.formatMessage({ id: `${id}.legend` }),
    },
  };
  optionsGraph.plotOptions = {
    series: {
      pointPadding: 0,
      groupPadding: 0,
      borderWidth: 0,
      shadow: false,
    },
    column: {
      stacking: false,
      dataLabels: {
        enabled: false,
      },
    },
  };

  return (
    <WrapperChart
      id={id}
      chartRef={chartRef}
      graphFooter={graphFooter}
      graphComments={graphComments}
      isLoading={isLoading || !dataGraphHistogram || !categoriesHistogram}
      isError={isError}
    >
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
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  id: 'app.national-publi.publishers.couts-publication.chart-distribution',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
