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

  const { data, isLoading, isError } = getData();

  if (isLoading) {
    return <>Loading...</>;
  }
  if (isError) {
    return <>Error</>;
  }

  const { dataGraph1, dataGraph2 } = data;

  const optionsGraph2 = {
    chart: {
      type: 'spline',
    },
    title: {
      text: "Evolution de la proportion d'accès ouvert pour les publications en santé, par millésime",
      align: 'left',
    },
    xAxis: {
      title: {
        text: 'Années de publication',
      },
    },
    legend: {
      verticalAlign: 'top',
    },
    plotOptions: {
      series: {
        pointStart: 2012,
      },
    },
    series: dataGraph2,
  };

  const optionsGraph1 = {
    colors: ['#FF6F4C'],
    chart: {
      type: 'bar',
    },
    title: {
      text: "Taux d'ouverture des publications françaises, dans le domaine de la santé, par millésime",
      align: 'left',
    },
    yAxis: { visible: false },
    tooltip: { valueSuffix: '%' },
    plotOptions: {
      bar: {
        dataLabels: { enabled: true },
      },
    },
    credits: { enabled: false },
    xAxis: {
      type: 'category',
      lineWidth: 0,
      tickWidth: 0,
    },
    series: [
      {
        data: dataGraph1,
        showInLegend: false,
      },
    ],
  };
  return (
    <>
      {/* <GraphFilters /> */}
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
        ref={chart1}
        id='chart1'
      />
      <GraphComments comments='Veniam incididunt nostrud sunt qui occaecat dolore esse sit aliquip excepteur ipsum. Adipisicing et proident culpa labore irure anim irure occaecat commodo. Excepteur do et ipsum elit quis. Culpa Lorem irure fugiat veniam dolore duis culpa laboris ullamco commodo deserunt ea. Aliqua mollit est esse laboris. Dolore pariatur laborum non non. Adipisicing laboris eiusmod pariatur nulla ad proident labore cillum ullamco voluptate est ullamco.' />
      <GraphFooter />
    </>
  );
};

export default Chart;
