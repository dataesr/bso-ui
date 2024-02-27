import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  cleanNumber,
  getCSSValue,
} from '../../../../../utils/helpers';

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
          by_year: item.by_year.buckets
            .map((bucket) => ({ year: bucket.key, y: bucket.doc_count }))
            .sort((a, b) => a.year - b.year),
          label: intl.formatMessage({
            id: `app.discipline.${item.key
              .replace(/\n/g, '')
              .replace('  ', ' ')}`,
          }),
          name: item.key,
          y: item.doc_count,
        })),
        color: getCSSValue('--orange-soft-100'),
      },
    ];
    const categories = series[0].data.map((item) => capitalize(item.label)
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
