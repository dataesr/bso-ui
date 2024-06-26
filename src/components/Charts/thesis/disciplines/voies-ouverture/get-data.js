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

function compare(a, b) {
  if (a.key > b.key) {
    return -1;
  }
  if (a.key < b.key) {
    return 1;
  }
  return 0;
}

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
          `oa_details.${observationSnap}.repositories_concat.keyword`,
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
      const categoriesLabels = [];
      data.forEach((item, catIndex) => {
        const nameClean = item.key
          .replace(/\n/g, '')
          .replace('  ', ' ')
          .replace('É', 'E');
        categoriesLabels.push({
          key: nameClean,
          catIndex,
        });
      });
      categoriesLabels.sort((a, b) => compare(a, b));
      categoriesLabels.forEach((_, ix) => {
        categoriesLabels[ix].alphaOrder = ix;
      });
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
        const oaCurrent = halCurrent + theseCurrent + halTheseCurrent;
        const totalCurrent = oaCurrent + closedCurrent;
        const nameClean = item.key
          .replace(/\n/g, '')
          .replace('  ', ' ')
          .replace('É', 'E');
        const currentC = categoriesLabels.filter(
          (c) => c.catIndex === catIndex,
        )[0];
        // eslint-disable-next-line
        const alphaOrder = currentC.alphaOrder;
        categories.push({
          key: nameClean,
          staff: totalCurrent,
          percent: (oaCurrent / totalCurrent) * 100,
          catIndex,
          alphaOrder,
        });
        categoriesComments.push(
          capitalize(intl.formatMessage({ id: `${nameClean}` })),
        );
        closed.push({
          y: (closedCurrent / totalCurrent) * 100,
          y_abs: closedCurrent,
          y_oa: oaCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
          alphaOrder,
        });
        oa.push({
          y: (oaCurrent / totalCurrent) * 100,
          y_abs: oaCurrent,
          y_oa: oaCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
          alphaOrder,
        });
        hal.push({
          y: (halCurrent / totalCurrent) * 100,
          y_abs: halCurrent,
          y_oa: oaCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
          oaRate: (oaCurrent / totalCurrent) * 100,
          alphaOrder,
        });
        these.push({
          y: (theseCurrent / totalCurrent) * 100,
          y_abs: theseCurrent,
          y_oa: oaCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
          oaRate: (oaCurrent / totalCurrent) * 100,
          alphaOrder,
        });
        halThese.push({
          y: (halTheseCurrent / totalCurrent) * 100,
          y_abs: halTheseCurrent,
          y_oa: oaCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
          oaRate: (oaCurrent / totalCurrent) * 100,
          alphaOrder,
        });
      });

      const dataGraph = [
        {
          name: intl.formatMessage({
            id: 'app.hal-only',
          }),
          data: hal,
          color: getCSSValue('--green-medium-125'),
          dataLabels: {
            ...noOutline,
            style: { color: getCSSValue('--g-800') },
          },
        },
        {
          name: intl.formatMessage({
            id: 'app.hal-these',
          }),
          data: halThese,
          color: getCSSValue('--theseshal'),
          dataLabels: noOutline,
        },
        {
          name: intl.formatMessage({
            id: 'app.these-only',
          }),
          data: these,
          color: getCSSValue('--thesesfr'),
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
    [
      beforeLastObservationSnap,
      bsoDomain,
      disciplineField,
      domain,
      intl,
      observationSnap,
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
