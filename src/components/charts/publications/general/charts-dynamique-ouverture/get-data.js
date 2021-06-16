import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';

function useGetData() {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  async function getObservationDates() {
    // Récupération de toutes les dates d'observation
    const query = {
      size: 0,
      aggs: {
        observation_dates: {
          terms: { field: 'observation_dates.keyword', size: 100 },
        },
      },
    };
    /* eslint-disable no-console */
    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));
    return res?.data?.aggregations?.observation_dates?.buckets
      .map((el) => el.key)
      .sort((a, b) => b - a);
  }

  async function getDataByObservationDates(datesObservation) {
    // Pour chaque date d'observation, récupération des données associées
    const queries = [];
    datesObservation?.forEach((oneDate) => {
      const query = {
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
      queries.push(Axios.post(ES_API_URL, query, HEADERS));
    });

    /* eslint-disable no-console */
    const res = await Axios.all(queries).catch((e) => console.log(e));

    const allData = res.map((d, i) => ({
      observationDate: datesObservation[i],
      data: d.data.aggregations.by_publication_year.buckets,
    }));

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
          (el) => el.key
              < parseInt(
                observationDateData.observationDate.substring(0, 4),
                10,
              )
            && el.by_is_oa.buckets.length > 0
            && el.doc_count,
        )
        .map((el) => Math.trunc((el.by_is_oa.buckets[0].doc_count * 100) / el.doc_count));
      dataGraph2.push(serie);
    });

    const dataGraph1 = dataGraph2.map((el) => ({
      name: el.name.split(' ')[2],
      y: el.data[el.data.length - 1],
    }));

    return { dataGraph1, dataGraph2 };
  }

  useEffect(() => {
    async function getData() {
      try {
        const observationDates = await getObservationDates();
        const dataGraph = await getDataByObservationDates(observationDates);
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    }
    getData();
  }, []);

  return { data, isLoading, isError };
}
export default useGetData;
