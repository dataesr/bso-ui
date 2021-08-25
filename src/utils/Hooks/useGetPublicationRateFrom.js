import { useEffect, useState } from 'react';

import { ES_API_URL } from '../../config/config';
import { getFetchOptions } from '../helpers';
import useFetch from './useFetch';

export default async function useGetPublicationRateFrom(year) {
  const [result, setResult] = useState({});

  const { fetch, response, isMounted, loading } = useFetch({
    url: ES_API_URL,
    method: 'post',
    options: getFetchOptions('publicationRate', 'health', year),
  });
  useEffect(() => {
    if (!response && isMounted.current) {
      if (year) {
        fetch();
      }
    } else if (!loading && response && year && !Object.keys(result).length) {
      const currentYear = year ? year.substring(0, 4) : null;
      const sortedData = response?.aggregations.by_publication_year.buckets
        .sort((a, b) => a.key - b.key)
        .filter(
          (el) => el.key < parseInt(currentYear, 10)
            && el.by_is_oa.buckets.length > 0
            && el.doc_count
            && el.key > 2012,
        );
      const truncatedData = sortedData.map((elm) => Math.trunc((elm.by_is_oa.buckets[0].doc_count * 100) / elm.doc_count));
      setResult(() => ({
        rate: truncatedData[truncatedData.length - 1],
        year,
      }));
    }
    return () => {
      isMounted.current = false;
    };
  }, [fetch, isMounted, loading, year, response, result]);
  return result;
}
