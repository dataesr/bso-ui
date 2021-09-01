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

const Chart = ({ id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { lang } = useLang();
  const { lastObservationSnap, updateDate } = useGlobals();
  const { allData, isLoading } = useGetData(lastObservationSnap, domain);
  const { dataGraph, categories } = allData;

  if (isLoading || !dataGraph || !categories) {
    return <Loader />;
  }

  const optionsGraph = getGraphOptions(id, intl);
  optionsGraph.chart.type = 'column';
  optionsGraph.xAxis = {
    categories,
  };
  optionsGraph.yAxis = getPercentageYAxis();
  optionsGraph.legend = {
    title: {
      text: intl.formatMessage({ id: `${id}.legend` }),
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
          return this.y.toFixed(1).concat(' %');
        },
      },
    },
  };
  optionsGraph.series = dataGraph;

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
        <GraphComments
          comments={intl.formatMessage({ id: `${id}.comments` })}
        />
      </div>
      <GraphFooter
        date={getFormattedDate(updateDate, lang)}
        source={intl.formatMessage({ id: `${id}.source` })}
        graphId={id}
        onPngButtonClick={exportChartPng}
        onCsvButtonClick={exportChartCsv}
      />
    </>
  );
};

Chart.defaultProps = {
  domain: '',
  id: 'app.national-publi.general.voies-ouverture.chart-repartition-taux',
};
Chart.propTypes = {
  id: PropTypes.oneOf([
    'app.national-publi.general.voies-ouverture.chart-repartition-taux',
    'app.sante-publi.general.voies-ouverture.chart-repartition-taux',
  ]),
  domain: PropTypes.oneOf(['health', '']),
};

export default Chart;
