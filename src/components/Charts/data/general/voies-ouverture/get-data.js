import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getObservationLabel,
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

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions({
        key: 'oaHostType',
        domain,
        parameters: [lastObservationSnap, fieldAgg1, 'year', 2013, 15, -1],
        objectType: ['publications'],
      });
      if (fieldAgg2) {
        query.aggs.by_publication_year.aggs.by_oa_host_type.aggs = {
          by_agg_2: { terms: { field: fieldAgg2 } },
        };
        if (fieldAgg3) {
          query.aggs.by_publication_year.aggs.by_oa_host_type.aggs.by_agg_2.aggs = { by_agg_3: { terms: { field: fieldAgg3 } } };
        }
      }
      if (filter1) {
        query.query.bool.filter.push({ term: { [`${filter1}`]: true } });
      }
      if (filter2) {
        query.query.bool.filter.push({ term: { [`${filter2}`]: true } });
      }
      const res = await Axios.post(ES_API_URL, query, HEADERS);
      const data = res.data.aggregations.by_publication_year.buckets.sort(
        (a, b) => a.key - b.key,
      );
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const categories = [];
      const shared = [];
      const shared2 = [];
      const closed = [];
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      data
        .filter(
          (el) => el.key > 2012
            && lastObservationSnap.length
            && parseInt(el.key, 10)
              < parseInt(lastObservationSnap?.substring(0, 4), 10),
        )
        .forEach((el) => {
          categories.push(el);
          const closedCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 0)
            ?.doc_count || 0;
          const sharedCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 1)
            ?.doc_count || 0;
          const sharedCurrent2 = el.by_oa_host_type.buckets
            .find((item) => item.key === 1)
            ?.by_agg_2?.buckets?.find((item) => item.key === 1)
            ?.by_agg_3.buckets?.find((item) => item.key === 1)?.doc_count
            || 0;
          const totalCurrent = sharedCurrent + closedCurrent;
          const unknownCurrent = el.by_oa_host_type.buckets.find((item) => item.key === -1)
            ?.doc_count || 0;
          closed.push({
            y: (closedCurrent / totalCurrent) * 100,
            y_abs: closedCurrent,
            y_tot: totalCurrent,
            x: el.key,
            bsoDomain,
          });
          shared.push({
            y: (sharedCurrent / totalCurrent) * 100,
            y_abs: sharedCurrent,
            y_tot: totalCurrent,
            y_unk: unknownCurrent,
            x: el.key,
            bsoDomain,
          });
          shared2.push({
            y: (sharedCurrent2 / totalCurrent) * 100,
            y_abs: sharedCurrent2,
            y_tot: totalCurrent,
            y_unk: unknownCurrent,
            x: el.key,
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
          color: getCSSValue('--publication-100'),
          dataLabels: noOutline,
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
          color: getCSSValue('--publication-100'),
          dataLabels: noOutline,
        },
      ];

      const comments = {
        beforeLastObservationSnap: getObservationLabel(
          beforeLastObservationSnap,
          intl,
        ),
        closed: closed[closed.length - 1]?.y.toFixed(0),
        lastObservationSnap: getObservationLabel(lastObservationSnap, intl),
        shared: shared[shared.length - 1]?.y.toFixed(0),
      };

      return {
        categories,
        comments,
        dataGraph,
        dataGraph2,
      };
    },
    [
      beforeLastObservationSnap,
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
