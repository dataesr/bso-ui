import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize } from '../../../../../utils/helpers';

function useGetData(observationSnaps, domain = '', isPercent = false) {
  const [data, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const intl = useIntl();

  const getDataByObservationSnaps = useCallback(async () => {
    const query = getFetchOptions({
      key: 'retractations',
      domain,
    });
    const response = await Axios.post(ES_API_URL, query, HEADERS);
    const dataGraph1 = [
      {
        name: 'Retractations',
        data: response?.data?.aggregations?.by_year?.buckets
          ?.sort((a, b) => a.key - b.key)
          .map((item) => ({ name: item.key, y: item.doc_count })),
      },
    ];

    const dataGraph2 = [
      {
        name: 'Retractations',
        data: response?.data?.aggregations?.by_field?.buckets
          ?.sort((a, b) => a.key - b.key)
          .map((item) => ({
            name: capitalize(
              intl.formatMessage({
                id: `app.discipline.${item.key
                  .replace(/\n/g, '')
                  .replace('  ', ' ')}`,
              }),
            ),
            y: item.doc_count,
          })),
      },
    ];

    return {
      dataGraph1,
      dataGraph2,
    };
  }, [domain, intl]);

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
