import '../../../graph.scss';

import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import {
  bluedark125,
  discipline100,
  g800,
} from '../../../../../style/colours.module.scss';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = () => {
  const chartRef = useRef();
  const intl = useIntl();
  const graphId = 'app.sante-publi.general.dynamique-ouverture.chart-taux-ouverture';
  const { observationDates, updateDate } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationDates);

  if (isLoading) {
    return <>Loading...</>;
  }
  if (isError) {
    return <>Error</>;
  }

  const { dataGraph1 } = data;

  const optionsGraph1 = {
    colors: [discipline100],
    chart: {
      type: 'bar',
      backgroundColor: 'var(--w-g750)',
    },
    title: {
      text: intl.formatMessage({ id: `${graphId}.title` }),
      align: 'left',
      style: {
        color: bluedark125,
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
    yAxis: { visible: false },
    tooltip: {
      headerFormat: '',
      pointFormat: intl.formatMessage({ id: `${graphId}.tooltip` }),
    },
    plotOptions: {
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
    },
    credits: { enabled: false },
    xAxis: {
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
    },
    series: [
      {
        data: dataGraph1,
        showInLegend: false,
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 700,
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        },
      ],
    },
    exporting: {
      buttons: {
        contextButton: {
          enabled: true,
        },
      },
      chartOptions: {
        legend: {
          enabled: true,
        },
        title: {
          text: 'fileName',
        },
        subtitle: {
          text: 'source',
        },
      },
      filename: 'filename',
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

  const chart1Comments = intl.formatMessage(
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
      <div fluid className='graph-container'>
        {/* <GraphFilters /> */}
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsGraph1}
          ref={chartRef}
          id='chart1'
        />
        <GraphComments comments={chart1Comments} />
      </div>
      <GraphFooter
        date={updateDate}
        source={intl.formatMessage({ id: `${graphId}.source` })}
        graphId={graphId}
        onPngButtonClick={exportChartPng}
        onCsvButtonClick={exportChartCsv}
      />
    </>
  );
};

export default Chart;
