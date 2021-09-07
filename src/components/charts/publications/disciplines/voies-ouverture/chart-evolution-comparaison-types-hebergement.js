/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import HighchartsAnnotations from 'highcharts/modules/annotations';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import { graphIds } from '../../../../../utils/constants';
import { getGraphOptions } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import GraphTitle from '../../../graph-title';
import useGetData from './get-data-evolution';

HCExporting(Highcharts);
HCExportingData(Highcharts);
highchartsMore(Highcharts);
HighchartsAnnotations(Highcharts);

const Chart = ({ graphFooter, graphComments, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { lastObservationSnap, updateDate } = useGlobals();
  const { data, isLoading } = useGetData(lastObservationSnap);

  if (isLoading || !data.bubbleGraph) {
    return <Loader />;
  }

  const optionsGraph = getGraphOptions(id, intl);
  optionsGraph.chart.type = 'bubble';
  optionsGraph.chart.zoomType = 'xy';
  optionsGraph.series = data.bubbleGraph;
  optionsGraph.xAxis = {
    min: 0,
    max: 110,
    title: { text: intl.formatMessage({ id: `${id}.xAxis` }) },
    labels: {
      // eslint-disable-next-line
      formatter: function () {
        return this.axis.defaultLabelFormatter.call(this).concat(' %');
      },
    },
  };
  optionsGraph.yAxis = {
    min: 0,
    max: 110,
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
    series: {
      dataLabels: {
        enabled: true,
        format: '{point.discipline}',
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
          text: intl.formatMessage({ id: `${id}.goal` }),
        },
      ],
      labelOptions: {
        borderRadius: 0,
        backgroundColor: 'var(--blue-soft-100)',
      },
    },
  ];

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
  id: 'app.national-publi.disciplines.voies-ouverture.chart-evolution-comparaison-types-hebergement',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
