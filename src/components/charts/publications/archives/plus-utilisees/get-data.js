/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { getFetchOptions, getPublicationYearFromObservationSnap } from '../../../../../utils/helpers';

function useGetData(observationSnap) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  async function GetData() {
    const query = getFetchOptions('repositoriesList', 'health', observationSnap);

    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));

    const dataGraph = res.data.aggregations.by_repository.buckets.map((el) => ({
      name: el.key,
      y: el.doc_count,
      publicationDate: getPublicationYearFromObservationSnap(observationSnap),
    }));
    return dataGraph.slice(0, 15);
  }

  useEffect(() => {
    async function getData() {
      try {
        const tempData = await GetData();
        setData(tempData);
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
