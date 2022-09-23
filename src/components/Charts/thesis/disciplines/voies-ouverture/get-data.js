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

function useGetData(beforeLastObservationSnap, observationSnap, domain) {
  const disciplineField = 'thesis_classification.discipline';
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
        parameters: [
          lastObservationSnap,
          disciplineField,
          'repositories_concat',
        ],
        objectType: ['thesis'],
      });
      const res = await Axios.post(ES_API_URL, query, HEADERS);
      let data = res.data.aggregations.by_discipline.buckets;
      const categories = []; // Elements d'abscisse
      const categoriesComments = []; // Elements d'abscisse
      const hal = [];
      const these = [];
      const halThese = []; // les 2
      const oa = []; // oa
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
            item.by_oa_host_type.buckets.find((item2) => item2.key === 'closed')
              ?.doc_count || 0,
          hal:
            item.by_oa_host_type.buckets.find((item2) => item2.key === 'HAL')
              ?.doc_count || 0,
          these:
            item.by_oa_host_type.buckets.find(
              (item2) => item2.key === 'theses.fr',
            )?.doc_count || 0,
          halThese:
            item.by_oa_host_type.buckets.find(
              (item2) => item2.key === 'HAL;theses.fr',
            )?.doc_count || 0,
        }));
      data.forEach((item, catIndex) => {
        const closedCurrent = item.by_oa_host_type.buckets.find((item2) => item2.key === 'closed')
          ?.doc_count || 0;
        const halCurrent = item.by_oa_host_type.buckets.find((item2) => item2.key === 'HAL')
          ?.doc_count || 0;
        const theseCurrent = item.by_oa_host_type.buckets.find(
          (item2) => item2.key === 'theses.fr',
        )?.doc_count || 0;
        const halTheseCurrent = item.by_oa_host_type.buckets.find(
          (item2) => item2.key === 'HAL;theses.fr',
        )?.doc_count || 0;
        const totalCurrent = halCurrent + theseCurrent + halTheseCurrent + closedCurrent;
        const oaCurrent = halCurrent + theseCurrent + halTheseCurrent;
        const nameClean = item.key.replace(/\n/g, '').replace('  ', ' ');
        categories.push({
          key: nameClean,
          staff: totalCurrent,
          percent: (oaCurrent / totalCurrent) * 100,
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
          discipline: categoriesComments[catIndex],
          bsoDomain,
        });
        oa.push({
          y: (oaCurrent / totalCurrent) * 100,
          y_abs: oaCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
        });
        hal.push({
          y: (halCurrent / totalCurrent) * 100,
          y_abs: halCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
          oaRate: (oaCurrent / totalCurrent) * 100,
        });
        these.push({
          y: (theseCurrent / totalCurrent) * 100,
          y_abs: theseCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
          oaRate: (oaCurrent / totalCurrent) * 100,
        });
        halThese.push({
          y: (halTheseCurrent / totalCurrent) * 100,
          y_abs: halTheseCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
          oaRate: (oaCurrent / totalCurrent) * 100,
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
          dataLabels: {
            ...noOutline,
            style: { color: getCSSValue('--g-800') },
          },
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.hal-these',
            }),
          ),
          data: halThese,
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

      const discipline = dataGraph?.[0]?.data?.[0]?.discipline.toLowerCase() || '';
      const publisherRate = dataGraph?.[0]?.data?.[0]?.y.toFixed(0) || 0;
      const publisherRepositoryRate = dataGraph?.[1]?.data?.[0]?.y.toFixed(0) || 0;
      const repositoryRate = dataGraph?.[2]?.data?.[0]?.y.toFixed(0) || 0;

      const comments = {
        discipline,
        observationYear: getObservationLabel(lastObservationSnap, intl),
        publicationYear: getObservationLabel(beforeLastObservationSnap, intl),
        publisherRate,
        publisherRepositoryRate,
        repositoryRate,
      };

      return {
        categories,
        comments,
        dataGraph,
      };
    },
    [beforeLastObservationSnap, bsoDomain, disciplineField, domain, intl],
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
