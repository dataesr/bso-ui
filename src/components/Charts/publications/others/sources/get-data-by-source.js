import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';

function useGetData(observationSnaps) {
  const [data, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { lastObservationSnap } = useGlobals();

  const getDataByObservationSnaps = useCallback(async () => {
    const query = getFetchOptions({
      key: 'external_ids',
      // objectType: ['publications'],
      parameters: [lastObservationSnap],
    });
    const queries = [];
    const query1 = JSON.parse(JSON.stringify(query));
    query1.query.bool.must_not = [
      { terms: { 'external_ids.id_type.keyword': ['hal_id'] } },
    ];
    queries.push(Axios.post(ES_API_URL, query1, HEADERS));
    const query2 = JSON.parse(JSON.stringify(query));
    query2.query.bool.must_not = [
      { terms: { 'external_ids.id_type.keyword': ['crossref'] } },
    ];
    queries.push(Axios.post(ES_API_URL, query2, HEADERS));
    const query3 = JSON.parse(JSON.stringify(query));
    query3.query.bool.must = [
      { terms: { 'external_ids.id_type.keyword': ['crossref'] } },
    ];
    queries.push(Axios.post(ES_API_URL, query3, HEADERS));
    const responses = await Axios.all(queries);

    const categories = responses?.[0]?.data?.aggregations?.by_year?.buckets
      ?.sort((a, b) => a.key - b.key)
      ?.map((bucket) => bucket?.key);
    const crossref = responses?.[0]?.data?.aggregations?.by_year?.buckets?.map(
      (year) => year?.by_external_ids_type?.buckets?.find(
        (bucket) => bucket.key === 'crossref',
      )?.doc_count,
    );
    const hal = responses?.[1]?.data?.aggregations?.by_year?.buckets?.map(
      (year) => year?.by_external_ids_type?.buckets?.find(
        (bucket) => bucket.key === 'hal_id',
      )?.doc_count,
    );
    const crosshal = responses?.[2]?.data?.aggregations?.by_year?.buckets?.map(
      (year) => year?.by_external_ids_type?.buckets?.find(
        (bucket) => bucket.key === 'hal_id',
      )?.doc_count,
    );

    const dataGraph = [
      {
        name: 'crossref only',
        data: crossref,
      },
      {
        name: 'hal only',
        data: hal,
      },
      {
        name: 'crossref x hal',
        data: crosshal,
      },
    ];

    return {
      categories,
      dataGraph,
    };
  }, [lastObservationSnap]);

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
  }, [getDataByObservationSnaps, observationSnaps]);

  return { data, isError, isLoading };
}
export default useGetData;
