import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';

function useGetData(observationSnaps, domain = '', isPercent = false) {
  const [data, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { lastObservationSnap } = useGlobals();

  const getDataByObservationSnaps = useCallback(async () => {
    const query = getFetchOptions({
      key: 'retractionsByPublisher',
      domain,
      parameters: [lastObservationSnap],
      objectType: ['publications'],
    });
    const numberOfRetracted = (item) => item.by_retraction.buckets.find((i2) => i2.key === 1)?.doc_count ?? 0;
    const percentageOfRetracted = (item) => (numberOfRetracted(item) / item.doc_count) * 100;

    const response = await Axios.post(ES_API_URL, query, HEADERS);
    const buckets = response?.data?.aggregations?.by_publisher?.buckets
      ?.sort((a, b) => percentageOfRetracted(b) - percentageOfRetracted(a))
      .slice(0, 20);
    const categories = buckets.map((item) => item.key);
    const dataGraph = {
      data: buckets.map((item, catIndex) => ({
        y_tot: item.doc_count,
        y_abs: numberOfRetracted(item),
        y_rel: percentageOfRetracted(item),
        y: isPercent ? percentageOfRetracted(item) : numberOfRetracted(item),
        x: catIndex,
        publisher: categories[catIndex],
      })),
    };

    return {
      categories,
      dataGraph,
    };
  }, [domain, isPercent, lastObservationSnap]);

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataByObservationSnaps(observationSnaps);
        setData(dataGraph);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [getDataByObservationSnaps, isPercent, observationSnaps]);

  return { data, isError, isLoading };
}
export default useGetData;
