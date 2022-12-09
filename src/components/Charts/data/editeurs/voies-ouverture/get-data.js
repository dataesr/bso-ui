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
  fieldY,
  filterWithUsed,
  filterWithCreated,
) {
  const disciplineField = 'publisher_dissemination';
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions({
        key: 'disciplinesVoies',
        domain,
        parameters: [lastObservationSnap, disciplineField, fieldY],
        objectType: ['publications'],
      });
      if (filterWithUsed) {
        query.query.bool.filter.push({
          term: { [`${filterWithUsed}`]: true },
        });
      }
      if (filterWithCreated) {
        query.query.bool.filter.push({
          term: { [`${filterWithCreated}`]: true },
        });
      }
      const res = await Axios.post(ES_API_URL, query, HEADERS);
      let data = res.data.aggregations.by_discipline.buckets;
      const categories = []; // Elements d'abscisse
      const categoriesComments = []; // Elements d'abscisse
      const shared = [];
      const closed = []; // closed
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      data = data
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
        }));
      data.forEach((item, catIndex) => {
        const closedCurrent = item.by_oa_host_type.buckets.find((item2) => item2.key === 0)
          ?.doc_count || 0;
        const sharedCurrent = item.by_oa_host_type.buckets.find((item2) => item2.key === 1)
          ?.doc_count || 0;
        const totalCurrent = sharedCurrent + closedCurrent;
        const nameClean = item.key.replace(/\n/g, '').replace('  ', ' ');
        categories.push({
          key: nameClean,
          staff: totalCurrent,
          percent: (sharedCurrent / totalCurrent) * 100,
        });
        categoriesComments.push(
          capitalize(intl.formatMessage({ id: `${nameClean}` })),
        );
        closed.push({
          y: (closedCurrent / totalCurrent) * 100,
          y_abs: closedCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          publisher: categoriesComments[catIndex],
          bsoDomain,
        });
        shared.push({
          y: (sharedCurrent / totalCurrent) * 100,
          y_abs: sharedCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          publisher: categoriesComments[catIndex],
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
          color: getCSSValue('--yellow-medium-125'),
          dataLabels: {
            ...noOutline,
            style: { color: getCSSValue('--g-800') },
          },
        },
      ];

      const publisher = dataGraph?.[0]?.data?.[0]?.publisher.toLowerCase() || '';
      const sharedRate = dataGraph?.[0]?.data?.[0]?.y.toFixed(0) || 0;

      const comments = {
        publisher,
        observationYear: getObservationLabel(lastObservationSnap, intl),
        publicationYear: getObservationLabel(beforeLastObservationSnap, intl),
        sharedRate,
      };

      return {
        categories,
        comments,
        dataGraph,
      };
    },
    [
      beforeLastObservationSnap,
      bsoDomain,
      disciplineField,
      domain,
      intl,
      fieldY,
      filterWithUsed,
      filterWithCreated,
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
