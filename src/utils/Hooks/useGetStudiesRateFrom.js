import { useEffect, useState } from 'react';

import { ES_STUDIES_API_URL } from '../../config/config';
import getFetchOptions from '../chartFetchOptions';
import useFetch from './useFetch';

export default async function useGetStudiesRateFrom(domain, observationSnap) {
  const [result, setResult] = useState({});

  const { fetch, response, isMounted, loading } = useFetch({
    url: ES_STUDIES_API_URL,
    method: 'post',
  });

  // console.log(ES_STUDIES_API_URL);
  // console.log(getFetchOptions({
  //   key: 'studiesDynamiqueOuvertureWithin3Years',
  //   parameters: ['Interventional', 2019, 2019, observationSnap],
  //   objectType: ['clinicalTrials'],
  // }));

  useEffect(() => {
    if (!response && isMounted.current && observationSnap) {
      fetch({
        options: getFetchOptions({
          key: 'studiesDynamiqueOuvertureWithin3Years',
          parameters: ['Interventional', 2019, 2019, observationSnap],
          objectType: ['clinicalTrials'],
        }),
      });
    } else if (
      !loading
      && response
      && observationSnap
      && !Object.keys(result).length
    ) {
      const sortedData = response?.aggregations.by_sponsor_type.buckets.find(
        (item) => item.key === 'academique',
      );
      const data = Number(
        (sortedData.by_has_results_within_3_years.buckets.find(
          (bucket) => bucket.key === 1,
        )?.doc_count ?? 0) / sortedData.doc_count,
      ) * 100;
      setResult(() => ({
        rate: data,
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
