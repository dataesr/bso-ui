import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';

function useGetData(observationSnaps, domain = '') {
  const [data, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { lastObservationSnap } = useGlobals();

  const getDataByObservationSnaps = useCallback(async () => {
    const query = getFetchOptions({
      key: 'retractionsByYear',
      domain,
      parameters: [lastObservationSnap],
      objectType: ['publications'],
    });
    const response = await Axios.post(ES_API_URL, query, HEADERS);
    const buckets = response?.data?.aggregations?.by_year?.buckets?.sort(
      (a, b) => a.key - b.key,
    ) ?? [];

    const categories = buckets.map((item) => item.key.toString());
    const dataGraph = {
      data: buckets.map((item, catIndex) => ({
        color: getCSSValue('--orange-soft-100'),
        x: catIndex,
        y:
          item?.by_retraction?.buckets?.find((bucket) => bucket.key === 1)
            ?.doc_count ?? 0,
        year: categories[catIndex],
      })),
    };

    return {
      categories,
      dataGraph,
    };
  }, [domain, lastObservationSnap]);

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
  }, [getDataByObservationSnaps, observationSnaps]);

  return { data, isError, isLoading };
}
export default useGetData;
