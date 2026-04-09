import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL_JOURNALS, HEADERS } from '../../../../config/config';
import getFetchOptions from '../../../../utils/chartFetchOptions';

function useGetData() {
  const [data, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        const { query, ...rest } = getFetchOptions({ key: 'publishingJournalsYears' });
        const response = await Axios.post(ES_API_URL_JOURNALS, rest, HEADERS);
        const aggregations = (response?.data?.aggregations?.byYear?.buckets ?? []).reverse();
        const categories = aggregations.map((item) => item.key);
        const dataSeries = aggregations.map((item, index) => ({
          category: categories[index],
          y: item?.doc_count ?? 0,
        }));
        const series = [{ data: dataSeries }];
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
