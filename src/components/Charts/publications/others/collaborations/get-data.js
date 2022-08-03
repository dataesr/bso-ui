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
    // Concatenate all countries
    let countries = response.data.aggregations.by_oa.buckets
      .map((item) => item.by_country.buckets
        .filter((item2) => item2.key !== 'fr')
        .map((item2) => item2.key))
      .flat();
    // Set uniq countries
    countries = [...new Set(countries)];
    // Rename country iso by its full name
    const categories = countries.map((item) => intl.formatMessage({
      id: `app.country.${item}`,
      defaultMessage: `Missing countru translation ${item}`,
    }));
    const dataGraph = [];
    const allData = countries.map((country) => {
      const openRaw = response?.data?.aggregations.by_oa?.buckets
        ?.find((item) => item.key === 1)
        .by_country.buckets.find((item) => item.key === country)?.doc_count
        || 0;
      const closedRaw = response?.data?.aggregations.by_oa?.buckets
        ?.find((item) => item.key === 0)
        .by_country.buckets.find((item) => item.key === country)?.doc_count
        || 0;
      const totalRaw = openRaw + closedRaw;
      const openRate = parseInt(((openRaw / totalRaw) * 100).toFixed(2), 10);
      const closedRate = parseInt(
        ((closedRaw / totalRaw) * 100).toFixed(2),
        10,
      );
      return { country, openRaw, openRate, closedRaw, closedRate, totalRaw };
    });
    dataGraph.push({
      name: intl.formatMessage({
        id: 'app.type-hebergement.open',
        defaultMessage: 'Open',
      }),
      data: allData.map((d) => (isPercent ? d.openRate : d.openRaw)),
      color: getCSSValue('--orange-soft-100'),
    });
    dataGraph.push({
      name: intl.formatMessage({
        id: 'app.type-hebergement.closed',
        defaultMessage: 'Closed',
      }),
      data: allData.map((d) => (isPercent ? d.closedRate : d.closedRaw)),
      color: getCSSValue('--blue-dark-125'),
    });

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
