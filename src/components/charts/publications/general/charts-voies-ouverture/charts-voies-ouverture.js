// import Axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useRef } from 'react';

// import { ES_API_URL } from '../../../../../configs/config';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import getData from './get-data';

const Chart = () => {
  const chart1 = useRef();
  const chart2 = useRef();

  const { data, isLoading, isError } = getData();

  if (isLoading) {
    return <>Loading...</>;
  }
  if (isError) {
    return <>Error !!</>;
  }

  const optionsGraph1 = {
    chart: {
      type: 'column',
    },
    title: {
      text: "Répartition du taux d'accès ouvert des publications en santé par année et par types d'hébergement",
      align: 'left',
    },
    xAxis: {
      categories: data.categories,
    },
    legend: {
      verticalAlign: 'top',
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: data.dataGraph,
  };

  const optionsGraph2 = {
    chart: {
      type: 'area',
    },
    title: {
      text: "Evolution du taux d'accès ouvert des publications en santé par année et par types d'hébergement",
      align: 'left',
    },
    xAxis: {
      categories: data.categories,
    },
    legend: {
      verticalAlign: 'top',
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
        },
      },
      series: {
        lineColor: '#ffffff',
        fillOpacity: 1,
      },
    },
    series: data.dataGraph,
  };

  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph1}
        ref={chart1}
        id='chart1'
      />
      <GraphComments comments='Veniam incididunt nostrud sunt qui occaecat dolore esse sit aliquip excepteur ipsum. Adipisicing et proident culpa labore irure anim irure occaecat commodo. Excepteur do et ipsum elit quis. Culpa Lorem irure fugiat veniam dolore duis culpa laboris ullamco commodo deserunt ea. Aliqua mollit est esse laboris. Dolore pariatur laborum non non. Adipisicing laboris eiusmod pariatur nulla ad proident labore cillum ullamco voluptate est ullamco.' />
      <GraphFooter />

      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph2}
        ref={chart2}
        id='chart2'
      />
      <GraphComments comments='Veniam incididunt nostrud sunt qui occaecat dolore esse sit aliquip excepteur ipsum. Adipisicing et proident culpa labore irure anim irure occaecat commodo. Excepteur do et ipsum elit quis. Culpa Lorem irure fugiat veniam dolore duis culpa laboris ullamco commodo deserunt ea. Aliqua mollit est esse laboris. Dolore pariatur laborum non non. Adipisicing laboris eiusmod pariatur nulla ad proident labore cillum ullamco voluptate est ullamco.' />
      <GraphFooter />
    </>
  );
};

export default Chart;
