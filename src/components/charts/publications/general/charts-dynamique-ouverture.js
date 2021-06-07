import React, { useState, useRef } from 'react';
import Axios from 'axios';
import GraphComments from '../../graph-comments';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { ES_API_URL } from '../../../../configs/config';

const headers = {
  headers: {
    Authorization: 'Basic QlNPOnZuODRxOVhlZjlVN3BtVQ==',
    'Content-Type': 'application/json',
  },
};

const Chart = () => {
  const chart1 = useRef();
  const [allData, setAllData] = useState(null);

  if (allData === null) {
    // Récupération de toutes les dates d'observation
    let query = {
      size: 0,
      aggs: {
        observation_dates: {
          terms: { field: 'observation_dates.keyword', size: 100 },
        },
      },
    };
    // Récupération des dates d'observation
    Axios.post(ES_API_URL, query, headers)
      .then((datesObservationData) => {
        const datesObservation =
          datesObservationData?.data?.aggregations?.observation_dates?.buckets
            .map((el) => el.key)
            .sort((a, b) => b - a);
        // Pour chaque date d'observation, récupération des données associées
        const queries = [];
        datesObservation?.forEach((oneDate) => {
          query = {
            size: 0,
            aggs: {
              by_publication_year: {
                terms: {
                  field: 'publication_year',
                },
                aggs: {
                  by_is_oa: {
                    terms: {
                      field: `oa_details.${oneDate}.is_oa`,
                    },
                  },
                },
              },
            },
          };
          queries.push(Axios.post(ES_API_URL, query, headers));
        });
        Axios.all(queries)
          .then((responses) => {
            setAllData(
              responses.map((d, i) => ({
                observationDate: datesObservation[i],
                data: d.data.aggregations.by_publication_year.buckets,
              }))
            );
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  }

  if (!allData) {
    return <>Loading ...</>;
  }

  const colors = [
    '#FF6F4C',
    '#CB634B',
    '#CB634B',
    '#CB634B',
    '#8F4939',
    '#8F4939',
    '#8F4939',
  ];
  const lineStyle = ['solid', 'ShortDot', 'ShortDashDot', 'Dash'];

  const dataGraph2 = [];
  allData.forEach((observationDateData, i) => {
    const serie = {};
    serie.name = `Année d'observation ${observationDateData.observationDate}`;
    serie.color = colors[i];
    serie.dashStyle = lineStyle[i];
    serie.data = observationDateData.data
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) =>
          el.key <
          parseInt(observationDateData.observationDate.substring(0, 4), 10)
      )
      .map((el) =>
        Math.trunc((el.by_is_oa.buckets[0].doc_count * 100) / el.doc_count)
      );
    dataGraph2.push(serie);
  });

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

  const dataGraph1 = dataGraph2.map((el) => ({
    name: el.name.split(' ')[2],
    y: el.data[el.data.length - 1],
  }));

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
        id="chart1"
      />
      <GraphComments comments="Veniam incididunt nostrud sunt qui occaecat dolore esse sit aliquip excepteur ipsum. Adipisicing et proident culpa labore irure anim irure occaecat commodo. Excepteur do et ipsum elit quis. Culpa Lorem irure fugiat veniam dolore duis culpa laboris ullamco commodo deserunt ea. Aliqua mollit est esse laboris. Dolore pariatur laborum non non. Adipisicing laboris eiusmod pariatur nulla ad proident labore cillum ullamco voluptate est ullamco." />

      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph2}
        ref={chart1}
        id="chart1"
      />
      <GraphComments comments="Veniam incididunt nostrud sunt qui occaecat dolore esse sit aliquip excepteur ipsum. Adipisicing et proident culpa labore irure anim irure occaecat commodo. Excepteur do et ipsum elit quis. Culpa Lorem irure fugiat veniam dolore duis culpa laboris ullamco commodo deserunt ea. Aliqua mollit est esse laboris. Dolore pariatur laborum non non. Adipisicing laboris eiusmod pariatur nulla ad proident labore cillum ullamco voluptate est ullamco." />
      {/* <GraphFooter /> */}
    </>
  );
};

export default Chart;
