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
          // `${softwareData}.${mentionType}`,
          'year',
          2013,
          15,
          -1,
        ],
        objectType: ['publications'],
      });
      if (filterWithUsed) {
        query.query.bool.filter.push({
          term: { [`${filterWithUsed}`]: true },
          // term: { [`${softwareData}.has_used`]: true },
        });
      }
      const res = await Axios.post(ES_API_URL, query, HEADERS);
      const data = res.data.aggregations.by_publication_year.buckets.sort(
        (a, b) => a.key - b.key,
      );
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const categories = [];
      const shared = [];
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
          categories.push(el.key);

          const closedCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 0)
            ?.doc_count || 0;
          const sharedCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 1)
            ?.doc_count || 0;
          const totalCurrent = sharedCurrent + closedCurrent;
          const unknownCurrent = el.by_oa_host_type.buckets.find((item) => item.key === -1)
            ?.doc_count || 0;
          closed.push({
            y: (100 * closedCurrent) / totalCurrent,
            y_abs: closedCurrent,
            y_tot: totalCurrent,
            x: el.key,
            bsoDomain,
          });
          shared.push({
            y: (100 * sharedCurrent) / totalCurrent,
            y_abs: sharedCurrent,
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
