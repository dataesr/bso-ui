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

function useGetData(beforeLastObservationSnap, observationSnap, domain) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions({
        key: 'oaHostType',
        domain,
        parameters: [
          lastObservationSnap,
          `oa_details.${lastObservationSnap}.repositories_concat.keyword`,
          'year',
          2010,
          50,
        ],
        objectType: ['thesis'],
      });
      const res = await Axios.post(ES_API_URL, query, HEADERS);
      const data = res.data.aggregations.by_publication_year.buckets.sort(
        (a, b) => a.key - b.key,
      );
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const categories = [];
      const repository = [];
      const publisher = [];
      const publisherRepository = [];
      const these = [];
      const hal = [];
      const both = [];
      const closed = [];
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      data
        .filter(
          (el) => true
            && lastObservationSnap.length
            && parseInt(el.key, 10)
              < parseInt(lastObservationSnap?.substring(0, 4), 10),
        )
        .forEach((el) => {
          categories.push(el.key);
          const closedCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 'closed')
            ?.doc_count || 0;
          const theseCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 'theses.fr')
            ?.doc_count || 0;
          const HALCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 'HAL')
            ?.doc_count || 0;
          const bothCurrent = el.by_oa_host_type.buckets.find(
            (item) => item.key === 'HAL;theses.fr',
          )?.doc_count || 0;
          const totalCurrent = closedCurrent + theseCurrent + HALCurrent + bothCurrent;
          const oaCurrent = theseCurrent + HALCurrent + bothCurrent;
          closed.push({
            y: (100 * closedCurrent) / totalCurrent,
            y_abs: closedCurrent,
            y_tot: totalCurrent,
            y_oa: oaCurrent,
            x: el.key,
            bsoDomain,
          });
          these.push({
            y: (100 * theseCurrent) / totalCurrent,
            y_abs: theseCurrent,
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x: el.key,
            bsoDomain,
          });
          hal.push({
            y: (100 * HALCurrent) / totalCurrent,
            y_abs: HALCurrent,
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x: el.key,
            bsoDomain,
          });
          both.push({
            y: (100 * bothCurrent) / totalCurrent,
            y_abs: bothCurrent,
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x: el.key,
            bsoDomain,
          });
        });

      const dataGraph = [
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.hal-only',
            }),
          ),
          data: hal,
          color: getCSSValue('--green-medium-125'),
          dataLabels: noOutline,
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.hal-these',
            }),
          ),
          data: both,
          color: getCSSValue('--blue-soft-100'),
          dataLabels: noOutline,
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.these-only',
            }),
          ),
          data: these,
          color: getCSSValue('--blue-soft-150'),
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
        hal: hal[hal.length - 1]?.y.toFixed(0),
        publisher: publisher[publisher.length - 1]?.y.toFixed(0),
        publisherRepository:
          publisherRepository[publisherRepository.length - 1]?.y.toFixed(0),
        repository: repository[repository.length - 1]?.y.toFixed(0),
      };
      return {
        categories,
        comments,
        dataGraph,
      };
    },
    [beforeLastObservationSnap, domain, intl],
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
