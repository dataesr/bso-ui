/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import { getGraphOptions, getPercentageYAxis } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import GraphTitle from '../../../graph-title';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const graphId = 'app.sante-publi.publishers.poids-revues.chart-repartition';

  const { observationSnaps, updateDate } = useGlobals();
  const { allData, isLoading, isError } = useGetData(observationSnaps);
  const { categories, dataGraph } = allData;

  if (isLoading || !dataGraph) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  const optionsGraph = getGraphOptions(graphId, intl);
  optionsGraph.series = dataGraph;
  optionsGraph.chart.type = 'column';
  optionsGraph.plotOptions = {
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: true,
        // eslint-disable-next-line
        formatter: function () {
          // eslint-disable-next-line
          return this.y.toFixed(1).concat(' %');
        },
      },
    },
  };
  optionsGraph.xAxis = {
    categories,
  };
  optionsGraph.yAxis = getPercentageYAxis(false, 3);
  optionsGraph.legend = { enabled: false };

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
