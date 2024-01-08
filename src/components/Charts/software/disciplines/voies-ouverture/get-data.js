import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getObservationLabel,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';

function useGetData(
  beforeLastObservationSnap,
  observationSnap,
  domain,
  fieldAgg1,
  fieldAgg2,
  fieldAgg3,
  filter1,
  filter2,
) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions({
        key: 'disciplinesVoies',
        domain,
        parameters: [lastObservationSnap, 'bso_classification', fieldAgg1],
        objectType: ['publications'],
      });
      if (fieldAgg2) {
        query.aggs.by_discipline.aggs.by_oa_host_type.aggs = {
          by_agg_2: { terms: { field: fieldAgg2 } },
        };
        if (fieldAgg3) {
          query.aggs.by_discipline.aggs.by_oa_host_type.aggs.by_agg_2.aggs = {
            by_agg_3: { terms: { field: fieldAgg3 } },
          };
        }
      }
      if (filter2) {
        query.query.bool.filter.push({ term: { [`${filter2}`]: true } });
      }
      if (filter1) {
        query.query.bool.filter.push({ term: { [`${filter1}`]: true } });
      }
      const res = await Axios.post(ES_API_URL, query, HEADERS);
      const data = res.data.aggregations.by_discipline.buckets;
      const categories = []; // Elements d'abscisse
      const categories2 = []; // Elements d'abscisse
      const categoriesComments = [];
      const shared = [];
      const shared2 = [];
      const closed = []; // closed
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      data
        .filter((item) => item.key !== 'unknown')
        .map((item) => ({
          by_oa_host_type: item.by_oa_host_type,
          key: item.key,
          total: item.doc_count,
          closed:
            item.by_oa_host_type.buckets.find((item2) => item2.key === 0)
              ?.doc_count || 0,
          shared:
            item.by_oa_host_type.buckets.find((item2) => item2.key === 1)
              ?.doc_count || 0,
        }))
        .forEach((item, catIndex) => {
          const closedCurrent = item.by_oa_host_type.buckets.find((item2) => item2.key === 0)
            ?.doc_count || 0;
          const sharedCurrent = item.by_oa_host_type.buckets.find((item2) => item2.key === 1)
            ?.doc_count || 0;
          const sharedCurrent2 = item.by_oa_host_type.buckets
            .find((item2) => item2.key === 1)
            ?.by_agg_2?.buckets?.find((item2) => item2.key === 1)
            ?.by_agg_3.buckets?.find((item2) => item2.key === 1)?.doc_count
            || 0;
          const totalCurrent = sharedCurrent + closedCurrent;
          const nameClean = item.key.replace(/\n/g, '').replace('  ', ' ');
          categories.push({
            key: nameClean,
            staff: totalCurrent,
            percent: (sharedCurrent / totalCurrent) * 100,
          });
          categories2.push({
            key: nameClean,
            staff: totalCurrent,
            percent: (sharedCurrent2 / totalCurrent) * 100,
          });
          categoriesComments.push(
            capitalize(
              intl.formatMessage({ id: `app.discipline.${nameClean}` }),
            ),
          );
          closed.push({
            y: (closedCurrent / totalCurrent) * 100,
            y_abs: closedCurrent,
            y_tot: totalCurrent,
            x: catIndex,
            publicationDate:
              getPublicationYearFromObservationSnap(lastObservationSnap),
            discipline: categoriesComments[catIndex],
            bsoDomain,
          });
          shared.push({
            y: (sharedCurrent / totalCurrent) * 100,
            y_abs: sharedCurrent,
            y_tot: totalCurrent,
            x: catIndex,
            publicationDate:
              getPublicationYearFromObservationSnap(lastObservationSnap),
            discipline: categoriesComments[catIndex],
            bsoDomain,
          });
          shared2.push({
            y: (sharedCurrent2 / totalCurrent) * 100,
            y_abs: sharedCurrent2,
            y_tot: totalCurrent,
            x: catIndex,
            publicationDate:
              getPublicationYearFromObservationSnap(lastObservationSnap),
            discipline: categoriesComments[catIndex],
            bsoDomain,
          });
        });

      const dataGraph = [
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.publication',
            }),
          ),
          data: shared,
          color: getCSSValue('--orange-soft-100'),
          dataLabels: {
            ...noOutline,
            style: { color: getCSSValue('--g-800') },
          },
        },
      ];

      const dataGraph2 = [
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.publication',
            }),
          ),
          data: shared2,
          color: getCSSValue('--orange-soft-100'),
          dataLabels: {
            ...noOutline,
            style: { color: getCSSValue('--g-800') },
          },
        },
      ];

      const discipline = dataGraph?.[0]?.data?.[0]?.discipline.toLowerCase() || '';
      const sharedRate = dataGraph?.[0]?.data?.[0]?.y.toFixed(0) || 0;

      const comments = {
        discipline,
        observationYear: getObservationLabel(lastObservationSnap, intl),
        publicationYear: getObservationLabel(beforeLastObservationSnap, intl),
        sharedRate,
      };

      return {
        categories,
        categories2,
        comments,
        dataGraph,
        dataGraph2,
      };
    },
    [
      beforeLastObservationSnap,
      bsoDomain,
      domain,
      fieldAgg1,
      fieldAgg2,
      fieldAgg3,
      filter1,
      filter2,
      intl,
    ],
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
