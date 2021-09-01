/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import HCMore from 'highcharts/highcharts-more';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import { getGraphOptions } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import GraphTitle from '../../../graph-title';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);
HCMore(Highcharts);

const Chart = ({ graphFooter, graphComments }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const graphId = 'app.sante-publi.publishers.politiques-ouverture.chart-comparaison';

  const { lastObservationSnap, updateDate } = useGlobals();
  const { allData, isLoading, isError } = useGetData(lastObservationSnap);
  const { bubbleGraph } = allData;

  if (isLoading || !bubbleGraph) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  const optionsGraph = getGraphOptions(graphId, intl);
  optionsGraph.chart.type = 'bubble';
  optionsGraph.chart.zoomType = 'xy';
  optionsGraph.series = bubbleGraph;
  optionsGraph.xAxis = {
    min: 0,
    max: 110,
    title: { text: intl.formatMessage({ id: `${graphId}.xAxis` }) },
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
    title: { text: intl.formatMessage({ id: `${graphId}.yAxis` }) },
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
        format: '{point.publisher}',
        filter: {
          property: 'z',
          operator: '>',
          value: '0.1',
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
        <GraphTitle title={intl.formatMessage({ id: `${graphId}.title` })} />
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsGraph}
          ref={chartRef}
          id={graphId}
        />
        {graphComments && (
          <GraphComments
            comments={intl.formatMessage({ id: `${graphId}.comments` })}
          />
        )}
      </div>
      {graphFooter && (
        <GraphFooter
          date={updateDate}
          source={intl.formatMessage({ id: `${graphId}.source` })}
          graphId={graphId}
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
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
};

export default Chart;
