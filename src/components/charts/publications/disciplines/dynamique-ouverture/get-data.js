/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { getFetchOptions } from '../../../../../utils/chartOptions';

function useGetData(observationSnaps, domain = '') {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  async function GetData() {
    const disciplineField = domain === 'health' ? 'bsso_classification.field' : 'bso_classification';
    // Pour chaque date d'observation, récupération des données associées
    const queries = [];
    observationSnaps?.forEach((oneDate) => {
      const query = getFetchOptions('publicationRateDiscipline', domain, oneDate, disciplineField);
      queries.push(Axios.post(ES_API_URL, query, HEADERS));
    });

    const res = await Axios.all(queries).catch(() => {
      setLoading(false);
    });
    const dataGraph = {};
    res.forEach((el, idx) => {
      console.log('ttt', el);
      const currentSnap = observationSnaps[idx];
      el.data.aggregations.by_discipline.buckets
        .filter((b) => b.key !== 'unknown')
        .forEach((item) => {
          if (!dataGraph[item.key]) {
            dataGraph[item.key] = [];
          }
          dataGraph[item.key].push({
            name: item.key,
            x: idx,
            observation_date: currentSnap,
            y_tot: item.doc_count,
            y_abs: item.by_is_oa.buckets.find((x) => x.key === 1).doc_count,
            y:
            (item.by_is_oa.buckets.find((x) => x.key === 1).doc_count
              / item.doc_count)
            * 100,
          });
        });
    });
    console.log('ttt', dataGraph);
    return res.data.aggregations.by_discipline.buckets
      .filter((discipline) => discipline.key !== 'unknown')
      .map((discipline) => ({
        name: discipline.key,
        data: discipline.by_year.buckets
          .sort((a, b) => b.key - a.key)
          .slice(1, 5)
          .sort((a, b) => a.key - b.key)
          .map((el) => ({
            name: el.key,
            y_tot: el.doc_count,
            y_abs: el.by_is_oa.buckets.find((item) => item.key === 1).doc_count,
            y:
              (el.by_is_oa.buckets.find((item) => item.key === 1).doc_count
                / el.doc_count)
              * 100,
          })),
      }));
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await GetData();
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationSnaps]);

  return { data, isLoading };
}
export default useGetData;
