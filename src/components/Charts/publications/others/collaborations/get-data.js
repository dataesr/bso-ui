import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';

function useGetData(observationSnaps, domain = '', isPercent = false) {
  const intl = useIntl();
  const [data, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { lastObservationSnap } = useGlobals();

  const getDataByObservationSnaps = useCallback(async () => {
    const query = getFetchOptions({
      key: 'internationalCollaborations',
      domain,
      parameters: [lastObservationSnap],
    });
    const response = await Axios.post(ES_API_URL, query, HEADERS);
    const categories = [];
    const openRaw = [];
    const openRate = [];
    const closedRaw = [];
    const closedRate = [];
    response?.data?.aggregations?.by_country?.buckets.forEach((item) => {
      categories.push(
        intl.formatMessage({
          id: `app.country.${item.key}`,
          defaultMessage: `Missing country translation ${item.key}`,
        }),
      );
      const total = item.doc_count;
      const open = item.by_oa.buckets.find(
        (item2) => item2.key === 1,
      ).doc_count;
      const closed = item.by_oa.buckets.find(
        (item2) => item2.key === 0,
      ).doc_count;
      openRaw.push(open);
      openRate.push(parseInt(((open / total) * 100).toFixed(2), 10));
      closedRaw.push(closed);
      closedRate.push(parseInt(((closed / total) * 100).toFixed(2), 10));
    });
    const dataGraph = [
      {
        name: intl.formatMessage({
          id: 'app.type-hebergement.open',
          defaultMessage: 'Open',
        }),
        data: isPercent ? openRate : openRaw,
        color: getCSSValue('--orange-soft-100'),
      },
      {
        name: intl.formatMessage({
          id: 'app.type-hebergement.closed',
          defaultMessage: 'Closed',
        }),
        data: isPercent ? closedRate : closedRaw,
        color: getCSSValue('--blue-dark-125'),
      },
    ];

    return {
      categories,
      dataGraph,
    };
  }, [domain, intl, isPercent, lastObservationSnap]);

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
