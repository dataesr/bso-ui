/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import {
  getFormattedDate,
  getGraphOptions,
  getPercentageYAxis,
} from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import useLang from '../../../../../utils/Hooks/useLang';
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
  const { lang } = useLang();
  const graphId = 'app.sante-publi.general.dynamique-ouverture.chart-evolution-proportion';
  const { observationDates, updateDate } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationDates);
  const { dataGraph2 } = data;

  if (isLoading || !dataGraph2) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  const optionsGraph2 = getGraphOptions(graphId, intl);
  optionsGraph2.chart.type = 'spline';
  optionsGraph2.xAxis = {
    title: { text: intl.formatMessage({ id: `${graphId}.xAxis` }) },
  };
  optionsGraph2.yAxis = getPercentageYAxis();
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
    { id: `${graphId}.comments` },
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
        <GraphTitle title={intl.formatMessage({ id: `${graphId}.title` })} />
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsGraph2}
          ref={chartRef}
          id={graphId}
        />
        {graphComments && <GraphComments comments={chartComments} />}
      </div>
      {graphFooter && (
        <GraphFooter
          date={getFormattedDate(updateDate, lang)}
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
