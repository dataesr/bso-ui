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
    const response = await Axios.post(ES_API_URL, query, HEADERS);
    const buckets = response?.data?.aggregations?.by_publisher?.buckets?.sort(
      (a, b) => b.doc_count - a.doc_count,
    );
    const categories = buckets.map((item) => item.key);
    const dataGraph = [
      {
        data: buckets.map(
          (item) => ((item.by_retraction.buckets.find((i2) => i2.key === 1)
            ?.doc_count ?? 0)
              / item.doc_count)
            * 100,
        ),
      },
    ];

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
  }, [getDataByObservationSnaps, isPercent, observationSnaps]);

  return { data, isError, isLoading };
}
export default useGetData;
