/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { getFetchOptions } from '../../../../../utils/helpers';

function useGetData(observationSnap, domain = '') {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  async function GetData() {
    const disciplineField = (domain === 'health') ? 'bsso_classification.field' : 'bso_classification';
    const query = getFetchOptions(
      'disciplinesHisto',
      domain,
      observationSnap,
      disciplineField,
    );
    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));
    return res.data.aggregations.by_discipline.buckets
      .filter((discipline) => (discipline.key !== 'unknown'))
      .map((discipline) => ({
        name: discipline.key,
        data: discipline.by_observation_year.buckets[0].by_year.buckets
          .sort((a, b) => b.key - a.key)
          .slice(1, 5)
          .sort((a, b) => a.key - b.key)
          .map((el) => ({
            name: el.key,
            y_tot: el.doc_count,
            y_abs: el.by_is_oa.buckets.find((item) => item.key === 1).doc_count,
            y: (el.by_is_oa.buckets.find((item) => item.key === 1).doc_count
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
  }, [observationSnap]);

  return { data, isLoading };
}
export default useGetData;
