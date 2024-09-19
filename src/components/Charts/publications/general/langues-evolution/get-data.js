import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';

function useGetData(observationSnap, domain) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions({
        key: 'publicationsByYear',
        domain,
        parameters: [lastObservationSnap, 'lang.keyword'],
        objectType: ['publications'],
      });
      const res = await Axios.post(ES_API_URL, query, HEADERS);
      const data = res.data.aggregations.by_year.buckets;
      data.sort((a, b) => a.key - b.key); // Tri pour avoir les années dans l'ordre d'affichage du graphe

      const categories = Object.values(data).map((d) => d.key); // Elements d'abscisse

      const dataByLang = {};
      data.forEach((year) => year.by_custom.buckets.forEach((lang) => {
        dataByLang[lang.key] = [
          ...(dataByLang?.[lang.key] ?? []),
          { year: year.key, count: lang.doc_count },
        ];
      }));

      const dataGraph = Object.entries(dataByLang).map(([key, values]) => ({
        name: intl.formatMessage({ id: `app.lang.${key}` }),
        data: values.map((v) => ({
          name: v.year,
          y: v.count,
          lang: intl.formatMessage({ id: `app.lang.${key}` }),
        })),
      }));

      const sum = (array) => array.reduce((acc, value) => acc + value, 0);
      dataGraph.sort(
        (a, b) => sum(b.data.map(({ y }) => y)) - sum(a.data.map(({ y }) => y)),
      );

      return {
        categories,
        dataGraph: dataGraph.slice(0, 5),
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
