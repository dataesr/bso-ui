import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';

function useGetData(observationSnaps, domain = '', isPercent = false) {
  const [data, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { lastObservationSnap } = useGlobals();
  const intl = useIntl();

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
    );
    const categories = buckets.map((item) => item.key);
    const closedData = [];
    const oaData = [];
    buckets.forEach((item) => {
      const retracted = item.by_retraction.buckets.find((i2) => i2.key === 1);
      const closedPublications = retracted.by_oa.buckets.find((i2) => i2.key === 0)?.doc_count ?? 0;
      closedData.push((closedPublications / item.doc_count) * 100);
      const oaPublications = retracted.by_oa.buckets.find((i2) => i2.key === 1)?.doc_count ?? 0;
      oaData.push((oaPublications / item.doc_count) * 100);
    });
    const dataGraph = [
      {
        color: getCSSValue('--blue-soft-175'),
        data: closedData,
        name: intl.formatMessage({ id: 'app.type-hebergement.closed' }),
      },
      {
        color: getCSSValue('--orange-soft-100'),
        data: oaData,
        name: intl.formatMessage({ id: 'app.type-hebergement.open' }),
      },
    ];

    return {
      categories,
      dataGraph,
    };
  }, [domain, intl, lastObservationSnap]);

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
