import { useEffect, useState } from 'react';

import { ES_API_URL } from '../../config/config';
import getFetchOptions from '../chartFetchOptions';
import useFetch from './useFetch';

export default async function useGetPublicationRateFrom(
  domain,
  observationSnap,
) {
  const [result, setResult] = useState({});

  const { fetch, response, isMounted, loading } = useFetch({
    url: ES_API_URL,
    method: 'post',
  });

  useEffect(() => {
    if (!response && isMounted.current && observationSnap) {
      fetch({
        options: getFetchOptions('publicationRate', domain, observationSnap),
      });
    } else if (
      !loading
      && response
      && observationSnap
      && !Object.keys(result).length
    ) {
      const observationYear = observationSnap
        ? observationSnap.substring(0, 4)
        : null;
      const sortedData = response?.aggregations.by_publication_year.buckets
        .sort((a, b) => a.key - b.key)
        .filter(
          (el) => el.key < parseInt(observationYear, 10) // publicationYear < observationYear
            && el.by_is_oa.buckets.length > 0
            && el.doc_count
            && el.key > 2012,
        );
      const data = sortedData.map(
        (elm) => (elm.by_is_oa.buckets[0].doc_count * 100) / elm.doc_count,
      );
      setResult(() => ({
        rate: data[data.length - 1],
        observationSnap,
      }));
    }
    return () => {
      if (observationSnap) {
        isMounted.current = false;
      }
    };
  }, [domain, fetch, isMounted, loading, observationSnap, response, result]);
  return result;
}
