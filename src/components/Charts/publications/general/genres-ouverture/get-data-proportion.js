import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

const colors = {
  book: getCSSValue('--blue-soft-75'),
  'book-chapter': getCSSValue('--blue-soft-100'),
  'journal-article': getCSSValue('--orange-soft-100'),
  proceedings: getCSSValue('--purple-medium-100'),
};

function useGetData(observationSnap, domain) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions({
        domain,
        key: 'oaPublicationType',
        objectType: ['publications'],
        parameters: [lastObservationSnap],
      });
      const res = await Axios.post(ES_API_URL, query, HEADERS);
      const data = res.data.aggregations.by_year.buckets
        // Sort data by publication year ascending
        .sort((a, b) => a.key - b.key)
        // Filter data on 2012 < publication year < lastObservationYear
        .filter(
          (el) => el.key < parseInt(lastObservationSnap.substring(0, 4), 10)
            && el.doc_count
            && el.key > 2012,
        );
      // Find all years in data (xAxis)
      const years = data.map((year) => year.key);
      // Find all types accross years (different lines)
      const types = [];
      data.forEach((year) => year.by_type.buckets
        .filter((item) => item.key !== 'preprint')
        .forEach((type) => {
          if (!types.find((item) => item.key === type.key)) {
            types.push({
              color: colors[type.key],
              data: [],
              key: type.key,
              name: intl.formatMessage({
                id: `app.publication-genre.${type.key}`,
              }),
            });
          }
        }));
      // For each publication type
      types.forEach((type) => {
        // For each publication year
        years.forEach((year) => {
          // Find corresponding data for this type for this year
          const d = data
            .find((item) => item.key === year)
            .by_type.buckets.find((item) => item.key === type.key);
          if (d) {
            const yOa = d.by_oa.buckets.find((item) => item.key === 1)?.doc_count || 0;
            const yTot = d.doc_count;
            const y = (yOa / yTot) * 100;
            type.data.push({ y, yOa, yTot });
          } else {
            type.data.push({ y: 0, yOa: 0, yTot: 0 });
          }
        });
      });

      return {
        categories: years,
        series: types,
      };
    },
    [domain, intl],
  );

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataForLastObservationSnap(observationSnap);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationSnap]);

  return { allData, isError, isLoading };
}
export default useGetData;
