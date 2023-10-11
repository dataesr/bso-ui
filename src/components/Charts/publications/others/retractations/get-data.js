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
    const query = getFetchOptions({
      key: 'retractations',
      domain,
      parameters: [lastObservationSnap],
    });
    const response = await Axios.post(ES_API_URL, query, HEADERS);
    const buckets1 = response?.data?.aggregations?.by_year?.buckets?.sort(
      (a, b) => a.key - b.key,
    );
    const categories1 = [];
    const oaData1 = [];
    const closedData1 = [];
    buckets1.forEach((item) => {
      categories1.push(item.key);
      oaData1.push(
        item.by_oa.buckets.find((item2) => item2.key === 1)?.doc_count ?? 0,
      );
      closedData1.push(
        item.by_oa.buckets.find((item2) => item2.key === 0)?.doc_count ?? 0,
      );
    });
    const dataGraph1 = [
      {
        color: getCSSValue('--blue-soft-175'),
        data: closedData1,
        name: intl.formatMessage({
          id: 'app.type-hebergement.closed',
          default: 'Accès fermé',
        }),
      },
      {
        color: getCSSValue('--orange-soft-100'),
        data: oaData1,
        name: intl.formatMessage({
          id: 'app.type-hebergement.open',
          default: 'Accès ouvert',
        }),
      },
    ];

    const buckets2 = response?.data?.aggregations?.by_field?.buckets?.sort(
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

    return {
      categories1,
      categories2,
      dataGraph1,
      dataGraph2,
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
