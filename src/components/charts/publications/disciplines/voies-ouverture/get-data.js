/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { getFetchOptions } from '../../../../../utils/chartOptions';

function useGetData(observationSnap, domain = '') {
  const disciplineField = domain === 'health' ? 'bsso_classification.field' : 'bso_classification';
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  async function GetData() {
    const query = getFetchOptions(
      'disciplinesVoies',
      domain,
      observationSnap,
      disciplineField,
    );
    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));

    return res.data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key > 2012 && el.key < observationSnap.substring(0, 4),
      );
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
