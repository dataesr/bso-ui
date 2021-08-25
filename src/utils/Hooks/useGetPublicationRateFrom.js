import { useEffect, useState } from 'react';

import { ES_API_URL } from '../../config/config';
import { getFetchOptions } from '../helpers';
import useFetch from './useFetch';

export default async function useGetPublicationRateFrom(domain, observationDate) {
  const [result, setResult] = useState({});

  const { fetch, response, isMounted, loading } = useFetch({
    url: ES_API_URL,
    method: 'post',
    options: getFetchOptions('publicationRate', domain, observationDate),
  });
  useEffect(() => {
    if (!response) {
      if (observationDate) {
        fetch();
      }
    } else if (!loading && response && observationDate && !Object.keys(result).length) {
      const observationYear = observationDate ? observationDate.substring(0, 4) : null;
      const sortedData = response?.aggregations.by_publication_year.buckets
        .sort((a, b) => a.key - b.key)
        .filter(
          (el) => el.key < parseInt(observationYear, 10) // publicationYear < observationYear
            && el.by_is_oa.buckets.length > 0
            && el.doc_count
            && el.key > 2012,
        );
      const data = sortedData.map((elm) => (elm.by_is_oa.buckets[0].doc_count * 100) / elm.doc_count);
      setResult(() => ({
        rate: data[data.length - 1],
        observationDate,
      }));
    }
    return () => {
      isMounted.current = false;
    };
  }, [fetch, isMounted, loading, observationDate, response, result]);
  return result;
}
