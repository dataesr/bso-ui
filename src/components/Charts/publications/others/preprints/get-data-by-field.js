import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';

function useGetData(observationSnaps, domain = '') {
  const [data, setData] = useState([]);
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { lastObservationSnap } = useGlobals();

  const getDataByField = useCallback(async () => {
    const query = getFetchOptions({
      key: 'anyByField',
      domain,
      parameters: [lastObservationSnap, 'preprint_details.has_preprint'],
      objectType: ['publications'],
    });
    const response = await Axios.post(ES_API_URL, query, HEADERS);

    const numberOfRetracted = (item) => item.by_retraction.buckets.find((i2) => i2.key === 1)?.doc_count ?? 0;
    const percentageOfRetracted = (item) => (numberOfRetracted(item) / item.doc_count) * 100;
    const buckets = response?.data?.aggregations?.by_field?.buckets?.map(
      (item) => ({
        field: item.key,
        y_count: numberOfRetracted(item),
        y_percent: percentageOfRetracted(item),
        y_total: item.doc_count,
      }),
    );
    return buckets;
  }, [domain, lastObservationSnap]);

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataByField(observationSnaps);
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
  }, [getDataByField, observationSnaps]);

  return { data, isError, isLoading };
}

export default useGetData;
