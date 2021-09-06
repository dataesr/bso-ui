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
import {
  getFetchOptions,
  getGraphOptions,
} from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
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

  const { observationSnaps } = useGlobals(domain);
  const { data, isLoading, isError } = useGetData(
    observationSnaps,
    publisher,
    domain,
  );
  const { dataGraphViolin, categoriesViolin } = data;
  const query = getFetchOptions('publishersList', domain, observationSnaps[0]);
  useEffect(() => {
    Axios.post(ES_API_URL, query, HEADERS).then((response) => {
      setPublishers(
        response.data.aggregations.by_publisher.buckets.map((item) => item.key),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
    max: categoriesViolin && categoriesViolin.length - 1,
  };
  optionsGraph.plotOptions = {
    areasplinerange: {
      marker: {
        enabled: false,
      },
      // pointStart: xi[0]
    },
    scatter: {
      lineWidth: 2,
      zIndex: 1,
      marker: {
        fillColor: 'white',
        symbol: 'circle',
        lineWidth: 3,
      },
    },
  };
  optionsGraph.series = dataGraphViolin;

  return (
    <WrapperChart
      id={id}
      chartRef={chartRef}
      graphFooter={graphFooter}
      graphComments={graphComments}
      isError={isError}
      isLoading={isLoading || !dataGraphViolin || !categoriesViolin}
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
  id: 'app.national-publi.publishers.couts-publication.chart-distribution-par-annee',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
