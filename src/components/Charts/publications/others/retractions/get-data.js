import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, getCSSValue } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';

function useGetData(observationSnaps, domain = '', isPercent = false) {
  const [data, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const intl = useIntl();
  const { lastObservationSnap } = useGlobals();

  const getDataByObservationSnaps = useCallback(async () => {
    const queries = [];
    const query1 = getFetchOptions({
      key: 'retractions',
      domain,
      parameters: [lastObservationSnap],
      objectType: ['publications'],
    });
    const query2 = getFetchOptions({
      key: 'retractionsByYear',
      domain,
      parameters: [lastObservationSnap],
      objectType: ['publications'],
    });
    queries.push(Axios.post(ES_API_URL, query1, HEADERS));
    queries.push(Axios.post(ES_API_URL, query2, HEADERS));
    const responses = await Axios.all(queries);
    const buckets1 = responses[1]?.data?.aggregations?.by_year?.buckets?.sort(
      (a, b) => a.key - b.key,
    );
    const categories1 = buckets1.map((item) => item.key);
    const dataGraph1 = [
      {
        data: buckets1.map(
          (item) => ((item.by_retraction.buckets.find((i2) => i2.key === 1)
            ?.doc_count ?? 0)
              / item.doc_count)
            * 100,
        ),
      },
    ];

    const buckets2 = responses[0]?.data?.aggregations?.by_field?.buckets?.sort(
      (a, b) => a.key - b.key,
    );
    const categories2 = [];
    const oaData2 = [];
    const closedData2 = [];
    buckets2.forEach((item) => {
      categories2.push(
        capitalize(
          intl.formatMessage({
            id: `app.discipline.${item.key
              .replace(/\n/g, '')
              .replace('  ', ' ')}`,
          }),
        ),
      );
      oaData2.push(
        item.by_oa.buckets.find((item2) => item2.key === 1)?.doc_count ?? 0,
      );
      closedData2.push(
        item.by_oa.buckets.find((item2) => item2.key === 0)?.doc_count ?? 0,
      );
    });
    const dataGraph2 = [
      {
        color: getCSSValue('--blue-soft-175'),
        data: closedData2,
        name: intl.formatMessage({
          id: 'app.type-hebergement.closed',
          default: 'Accès fermé',
        }),
      },
      {
        color: getCSSValue('--orange-soft-100'),
        data: oaData2,
        name: intl.formatMessage({
          id: 'app.type-hebergement.open',
          default: 'Accès ouvert',
        }),
      },
    ];

    const buckets3 = responses[0]?.data?.aggregations?.by_publisher?.buckets?.sort(
      (a, b) => a.key - b.key,
    );
    const categories3 = [];
    const oaData3 = [];
    const closedData3 = [];
    buckets3.forEach((item) => {
      categories3.push(
        capitalize(
          intl.formatMessage({
            id: item.key,
          }),
        ),
      );
      oaData3.push(
        item.by_oa.buckets.find((item3) => item3.key === 1)?.doc_count ?? 0,
      );
      closedData3.push(
        item.by_oa.buckets.find((item3) => item3.key === 0)?.doc_count ?? 0,
      );
    });
    const dataGraph3 = [
      {
        color: getCSSValue('--blue-soft-175'),
        data: closedData3,
        name: intl.formatMessage({
          id: 'app.type-hebergement.closed',
          default: 'Accès fermé',
        }),
      },
      {
        color: getCSSValue('--orange-soft-100'),
        data: oaData3,
        name: intl.formatMessage({
          id: 'app.type-hebergement.open',
          default: 'Accès ouvert',
        }),
      },
    ];

    return {
      categories1,
      categories2,
      categories3,
      dataGraph1,
      dataGraph2,
      dataGraph3,
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
