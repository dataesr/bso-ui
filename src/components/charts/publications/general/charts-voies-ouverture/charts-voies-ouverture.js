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

  const optionsGraph1 = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Stacked column chart',
    },
    xAxis: {
      categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas'],
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total fruit consumption',
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color:
            // theme
            (Highcharts.defaultOptions.title.style &&
              Highcharts.defaultOptions.title.style.color) ||
            'gray',
        },
      },
    },
    legend: {
      align: 'right',
      x: -30,
      verticalAlign: 'top',
      y: 25,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false,
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
    series: [
      {
        name: 'John',
        data: [5, 3, 4, 7, 2],
      },
      {
        name: 'Jane',
        data: [2, 2, 3, 2, 1],
      },
      {
        name: 'Joe',
        data: [3, 4, 4, 2, 5],
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
      <GraphFooter
        date='15/09/2021'
        source='Source du graph'
        graphId=''
        onCsvButtonClick=''
        onXlsButtonClick=''
        onPngButtonClick=''
      />
    </>
  );
};

export default Chart;
