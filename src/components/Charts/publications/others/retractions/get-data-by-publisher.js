import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { cleanNumber } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';

function useGetData(observationSnaps, domain = '', sort = 'sort-number') {
  const [data, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { lastObservationSnap } = useGlobals();
  const intl = useIntl();

  const getDataByObservationSnaps = useCallback(async () => {
    const query = getFetchOptions({
      key: 'retractionsByPublisher',
      domain,
      parameters: [lastObservationSnap],
      objectType: ['publications'],
    });
    const numberOfRetracted = (item) => item.by_retraction.buckets.find((i2) => i2.key === 1)?.doc_count ?? 0;
    const percentageOfRetracted = (item) => (numberOfRetracted(item) / item.doc_count) * 100;

    const response = await Axios.post(ES_API_URL, query, HEADERS);
    const buckets = response?.data?.aggregations?.by_publisher?.buckets
      ?.sort((a, b) => numberOfRetracted(b) - numberOfRetracted(a))
      .slice(0, 20);
    const categories = buckets.map((item) => item.key
      .concat('</br>(')
      .concat(intl.formatMessage({ id: 'app.effectif' }))
      .concat(' = ')
      .concat(cleanNumber(item.doc_count))
      .concat(')'));
    const dataGraph = {
      data: buckets.map((item, catIndex) => ({
        y_tot: item.doc_count,
        y_abs: numberOfRetracted(item),
        y_rel: percentageOfRetracted(item),
        y:
          sort === 'sort-percent'
            ? percentageOfRetracted(item)
            : numberOfRetracted(item),
        x: catIndex,
        publisher: categories[catIndex],
      })),
    };

    return {
      categories,
      dataGraph,
    };
  }, [domain, intl, lastObservationSnap, sort]);

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
  }, [getDataByObservationSnaps, observationSnaps, sort]);

  return { data, isError, isLoading };
}
export default useGetData;
