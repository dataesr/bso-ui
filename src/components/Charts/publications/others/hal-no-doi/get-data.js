import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, cleanNumber } from '../../../../../utils/helpers';

function useGetData(observationSnaps, intl) {
  const [data, setData] = useState([]);
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const getDataByField = useCallback(async () => {
    const query = getFetchOptions({
      key: 'publicationsFromHalWithoutDoi',
      objectType: ['publications'],
      parameters: [2021],
    });
    const { filter } = query.query.bool;
    query.query.bool.filter = filter.filter(
      (item) => !item?.terms?.['external_ids.id_type.keyword'],
    );
    const response = await Axios.post(ES_API_URL, query, HEADERS);

    const series = [
      {
        data: response?.data?.aggregations?.by_field?.buckets.map((item) => ({
          y: item.doc_count,
          name: item.key,
        })),
      },
    ];
    const categories = series[0].data.map((item) => capitalize(
      intl.formatMessage({
        id: `app.discipline.${item.name
          .replace(/\n/g, '')
          .replace('  ', ' ')}`,
      }),
    )
      .concat('<br><i>(')
      .concat(intl.formatMessage({ id: 'app.effectif' }))
      .concat(' ')
      .concat(cleanNumber(item.y))
      .concat(')</i>'));
    const dataGraph = { categories, series };

    return { dataGraph };
  }, [intl]);

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataByField(observationSnaps);
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
  }, [getDataByField, observationSnaps]);

  return { data, isError, isLoading };
}

export default useGetData;
