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
        const absence = [];
        const presence = [];
        categories.forEach((category) => {
          absence.push({
            source: category,
            y: aggregations?.[category]?.buckets?.find((item) => item.key === 0)?.doc_count ?? 0,
            percent: ((aggregations?.[category]?.buckets?.find((item) => item.key === 0)?.doc_count ?? 0) / total) * 100,
          });
          presence.push({
            source: category,
            y: aggregations?.[category]?.buckets?.find((item) => item.key === 1)?.doc_count ?? 0,
            percent: ((aggregations?.[category]?.buckets?.find((item) => item.key === 1)?.doc_count ?? 0) / total) * 100,
          });
        });
        const series = [{
          color: getCSSValue('--publication-100'),
          data: absence,
          name: 'Absence',
        }, {
          color: getCSSValue('--green-soft-100'),
          data: presence,
          name: 'Présence',
        }];
        setData({ categories, series });
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
