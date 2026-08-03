import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL_JOURNALS, HEADERS } from '../../../../config/config';
import getFetchOptions from '../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../utils/helpers';

function useGetData() {
  const [data, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        const { query, ...rest } = getFetchOptions({ key: 'publishingJournalsPresence' });
        const response = await Axios.post(ES_API_URL_JOURNALS, rest, HEADERS);
        const aggregations = response?.data?.aggregations ?? {};
        const categories = Object.keys(aggregations);
        const total = response?.data?.hits?.total?.value ?? 0;
        let presence = [];
        categories.forEach((category) => {
          presence.push({
            percent: ((aggregations?.[category]?.buckets?.find((item) => item.key === 1)?.doc_count ?? 0) / total) * 100,
            source: category,
            y: aggregations?.[category]?.buckets?.find((item) => item.key === 1)?.doc_count ?? 0,
          });
        });
        presence = presence.sort((a, b) => b.y - a.y);
        const series = [{
          color: getCSSValue('--green-soft-100'),
          data: presence,
          name: 'Présence',
        }];
        setData({ categories: presence.map((p) => p.source), series });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, isError, isLoading };
}

export default useGetData;
