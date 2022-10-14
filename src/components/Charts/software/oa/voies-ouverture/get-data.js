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
  fieldY,
  filterWithUsed,
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
        parameters: [
          lastObservationSnap,
          fieldY,
          // `oa_details.${lastObservationSnap}.oa_colors.keyword`,
          // `${softwareData}.${mentionType}`,
          'year',
        ],
        objectType: ['publications'],
      });
      if (filterWithUsed) {
        query.query.bool.filter.push({
          term: { [`${filterWithUsed}`]: true },
          // term: { [`${softwareData}.has_used`]: true },
        });
      }
      query.aggs.by_publication_year.terms.field = `oa_details.${lastObservationSnap}.oa_colors.keyword`;
      // query.aggs.by_publication_year.aggs.by_oa_host_type.aggs = { by_shared: { terms: { field: fieldY } } };
      const res = await Axios.post(ES_API_URL, query, HEADERS);
      const data = res.data.aggregations.by_publication_year.buckets.sort(
        (a, b) => a.key - b.key,
      );
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const categories = [];
      const green = [];
      const gold = [];
      const hybrid = [];
      const diamond = [];
      const other = [];
      const closed = [];
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      data.forEach((el) => {
        categories.push(el.key);
        const currentEltShared = el.by_oa_host_type.buckets.find((item) => item.key === 1)
          ?.doc_count || 0;
        const currentEltNotShared = el.by_oa_host_type.buckets.find((item) => item.key === 0)
          ?.doc_count || 0;
        const totalCurrent = currentEltShared + currentEltNotShared;
        const elt = {
          y: (100 * currentEltShared) / totalCurrent,
          y_abs: currentEltShared,
          y_tot: totalCurrent,
          // x: el.key,
          bsoDomain,
        };
        if (el.key === 'closed') {
          closed.push(elt);
        }
        if (el.key === 'green') {
          green.push(elt);
        }
        if (el.key === 'diamond') {
          diamond.push(elt);
        }
        if (el.key === 'other') {
          other.push(elt);
        }
        if (el.key === 'hybrid') {
          hybrid.push(elt);
        }
        if (el.key === 'gold') {
          gold.push(elt);
        }
      });
      const dataGraph = [
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.green',
            }),
          ),
          data: green,
          color: getCSSValue('--green-medium-125'),
          dataLabels: noOutline,
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.diamond',
            }),
          ),
          data: diamond,
          color: getCSSValue('--diamond'),
          dataLabels: noOutline,
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.gold',
            }),
          ),
          data: gold,
          color: getCSSValue('--yellow-medium-100'),
          dataLabels: noOutline,
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.other',
            }),
          ),
          data: other,
          color: getCSSValue('--orange-soft-100'),
          dataLabels: noOutline,
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.hybrid',
            }),
          ),
          data: hybrid,
          color: getCSSValue('--hybrid'),
          dataLabels: noOutline,
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.closed',
            }),
          ),
          data: closed,
          color: getCSSValue('--blue-soft-175'),
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
        // shared: shared[shared.length - 1]?.y.toFixed(0),
      };

      return {
        categories,
        comments,
        dataGraph,
      };
    },
    [beforeLastObservationSnap, domain, intl, fieldY, filterWithUsed],
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
