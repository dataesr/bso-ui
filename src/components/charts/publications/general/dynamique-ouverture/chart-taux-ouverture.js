import '../../../graph.scss';

import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import { discipline100, g800 } from '../../../../../style/colours.module.scss';
import { getGraphOptions } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const graphId = 'app.sante-publi.general.dynamique-ouverture.chart-taux-ouverture';
  const { observationDates, updateDate } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationDates);

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  const { dataGraph1 } = data;
  const optionsGraph1 = getGraphOptions(graphId, intl);
  optionsGraph1.chart.type = 'bar';
  optionsGraph1.colors = [discipline100];
  optionsGraph1.yAxis = { visible: false };
  optionsGraph1.plotOptions = {
    bar: {
      dataLabels: {
        enabled: true,
        format: '{point.y}%',
        style: {
          color: g800,
          fontSize: '20px',
          fontWeight: 'bold',
        },
      },
    },
  };
  optionsGraph1.xAxis = {
    type: 'category',
    lineWidth: 0,
    tickWidth: 0,
    labels: {
      style: {
        color: 'var(--g800)',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
  };
  optionsGraph1.series = [
    {
      data: dataGraph1,
      showInLegend: false,
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

  const chartComments = intl.formatMessage(
    { id: `${graphId}.comments` },
    {
      a: dataGraph1[0].y,
      b: dataGraph1[0].publicationDate,
      c: dataGraph1[0].publicationDate + 1,
      d: dataGraph1[0].name,
    },
  );

  return (
    <>
      <div className='graph-container'>
        {/* <GraphFilters /> */}
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsGraph1}
          ref={chartRef}
          iid={graphId}
        />
        {graphComments && <GraphComments comments={chartComments} />}
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
