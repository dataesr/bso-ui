/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import HCMore from 'highcharts/highcharts-more';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import { getGraphOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);
HCMore(Highcharts);

const Chart = ({ graphFooter, graphComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();

  const { lastObservationSnap } = useGlobals();
  const { allData, isLoading, isError } = useGetData(
    lastObservationSnap,
    domain,
  );
  const { bubbleGraph } = allData;
  const optionsGraph = getGraphOptions(id, intl);

  optionsGraph.chart.type = 'bubble';
  optionsGraph.chart.zoomType = 'xy';
  optionsGraph.series = bubbleGraph;
  optionsGraph.xAxis = {
    gridLineDashStyle: 'dash',
    gridLineWidth: 1,
    endOnTick: false,
    min: 0,
    max: 109,
    title: { text: intl.formatMessage({ id: `${id}.xAxis` }) },
    labels: {
      // eslint-disable-next-line
      formatter: function () {
        return this.axis.defaultLabelFormatter.call(this).concat(' %');
      },
    },
  };
  optionsGraph.yAxis = {
    gridLineDashStyle: 'dash',
    gridLineWidth: 1,
    endOnTick: false,
    min: 0,
    max: 120,
    title: { text: intl.formatMessage({ id: `${id}.yAxis` }) },
    labels: {
      // eslint-disable-next-line
      formatter: function () {
        return this.axis.defaultLabelFormatter.call(this).concat(' %');
      },
    },
  };
  optionsGraph.legend = {
    enabled: false,
  };
  optionsGraph.plotOptions = {
    bubble: {
      minSize: 10,
      maxSize: 80,
    },
    series: {
      dataLabels: {
        enabled: true,
        allowOverlap: true,
        format: '{point.publisher}',
        filter: {
          property: 'z',
          operator: '>',
          value: '0.1',
        },
      },
    },
  };
  optionsGraph.annotations = [
    {
      labels: [
        {
          point: {
            x: 100,
            y: 100,
            xAxis: 0,
            yAxis: 0,
          },
          text: intl.formatMessage({ id: 'app.publishers.objectif-science-ouverte' }),
        },
      ],
      draggable: '',
      labelOptions: {
        useHTML: true,
        borderRadius: 0,
        borderWidth: 0,
        backgroundColor: 'var(--blue-soft-100)',
      },
    },
  ];

  return (
    <WrapperChart
      id={id}
      chartRef={chartRef}
      graphFooter={graphFooter}
      graphComments={graphComments}
      isLoading={isLoading || !bubbleGraph}
      isError={isError}
    >
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
  id: 'app.national-publi.publishers.politiques-ouverture.chart-comparaison',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
