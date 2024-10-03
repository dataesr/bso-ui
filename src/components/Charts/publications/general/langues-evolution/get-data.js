import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

const colors = {
  en: getCSSValue('--blue-soft-100'),
  fr: getCSSValue('--orange-soft-100'),
  others: getCSSValue('--purple-medium-100'),
};

function useGetData(observationSnap, domain, isPercent) {
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
      data.forEach((year) => year.by_custom.buckets.forEach((bucket) => {
        dataByLang[bucket.key] = {
          ...(dataByLang?.[bucket.key] ?? {}),
          [year.key]: dataByLang[bucket.key]?.[year.key]
            ? dataByLang[bucket.key][year.key] + bucket.doc_count
            : bucket.doc_count,
        };
      }));

      const dataTotal = data.map((d) => ({ year: d.key, count: d.doc_count }));
      const dataEnglish = data.map((d) => ({
        year: d.key,
        count:
          d.by_custom.buckets.find((item) => item.key === 'en')?.doc_count || 0,
      }));
      const dataFrench = data.map((d) => ({
        year: d.key,
        count:
          d.by_custom.buckets.find((item) => item.key === 'fr')?.doc_count || 0,
      }));
      const dataOthers = dataTotal.map((d) => ({
        year: d.year,
        count:
          d.count
          - dataEnglish.find((item) => item.year === d.year).count
          - dataFrench.find((item) => item.year === d.year).count,
      }));

      const dataGraph = [
        {
          name: intl.formatMessage({ id: 'app.lang.en' }),
          color: colors.en,
          data: dataEnglish.map((d) => ({
            name: d.year,
            yabs: d.count,
            ypercent: Number(
              (d.count / dataTotal.find((item) => item.year === d.year).count)
                * 100,
            ).toFixed(1),
            y: isPercent
              ? Number(
                (d.count
                    / dataTotal.find((item) => item.year === d.year).count)
                    * 100,
              )
              : d.count,
            lang: intl.formatMessage({ id: 'app.lang.en' }),
          })),
        },
        {
          name: intl.formatMessage({ id: 'app.lang.fr' }),
          color: colors.fr,
          data: dataFrench.map((d) => ({
            name: d.year,
            yabs: d.count,
            ypercent: Number(
              (d.count / dataTotal.find((item) => item.year === d.year).count)
                * 100,
            ).toFixed(1),
            y: isPercent
              ? Number(
                (d.count
                    / dataTotal.find((item) => item.year === d.year).count)
                    * 100,
              )
              : d.count,
            lang: intl.formatMessage({ id: 'app.lang.fr' }),
          })),
        },
        {
          name: intl.formatMessage({ id: 'app.lang.others' }),
          color: colors.others,
          data: dataOthers.map((d) => ({
            name: d.year,
            yabs: d.count,
            ypercent: Number(
              (d.count / dataTotal.find((item) => item.year === d.year).count)
                * 100,
            ).toFixed(1),
            y: isPercent
              ? Number(
                (d.count
                    / dataTotal.find((item) => item.year === d.year).count)
                    * 100,
              )
              : d.count,
            lang: intl.formatMessage({ id: 'app.lang.others' }),
          })),
        },
      ];

      return {
        categories,
        dataGraph,
      };
    },
    [domain, intl, isPercent],
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
  }, [observationSnap, isPercent]);

  return { allData, isError, isLoading };
}
export default useGetData;
