import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  getCSSValue,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';

function useGetData(observationSnap, domain) {
  const disciplineField = domain === 'health' ? 'bsso_classification.field' : 'bso_classification';
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const yellowMedium125 = getCSSValue('--yellow-medium-125');

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions(
        'disciplinesVoies',
        domain,
        lastObservationSnap,
        disciplineField,
      );
      const res = await Axios.post(ES_API_URL, query, HEADERS);
      let data = res.data.aggregations.by_discipline.buckets;

      const categories = []; // Elements d'abscisse
      const repository = []; // archive ouverte
      const publisher = []; // éditeur
      const publisherRepository = []; // les 2
      const oa = []; // oa
      const closed = []; // closed
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      data = data
        .filter((el) => el.key !== 'unknown')
        .map((el) => ({
          by_oa_host_type: el.by_oa_host_type,
          key: el.key,
          total: el.doc_count,
          closed:
            el.by_oa_host_type.buckets.find((item) => item.key === 'closed')
              ?.doc_count || 0,
          repository:
            el.by_oa_host_type.buckets.find((item) => item.key === 'repository')
              ?.doc_count || 0,
          publisher:
            el.by_oa_host_type.buckets.find((item) => item.key === 'publisher')
              ?.doc_count || 0,
          publisherRepo:
            el.by_oa_host_type.buckets.find(
              (item) => item.key === 'publisher;repository',
            )?.doc_count || 0,
        }))
        .sort((a, b) => a.closed / a.total - b.closed / b.total);
      data.forEach((el, catIndex) => {
        categories.push(intl.formatMessage({ id: `app.discipline.${el.key}` }));

        const closedCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 'closed')
          ?.doc_count || 0;
        const repositoryCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 'repository')
          ?.doc_count || 0;
        const publisherCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 'publisher')
          ?.doc_count || 0;
        const publisherRepositoryCurrent = el.by_oa_host_type.buckets.find(
          (item) => item.key === 'publisher;repository',
        )?.doc_count || 0;
        const totalCurrent = repositoryCurrent
          + publisherCurrent
          + publisherRepositoryCurrent
          + closedCurrent;
        const oaCurrent = repositoryCurrent + publisherCurrent + publisherRepositoryCurrent;
        closed.push({
          y: (100 * closedCurrent) / totalCurrent,
          y_abs: closedCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categories[catIndex],
          bsoDomain,
        });
        oa.push({
          y: (100 * oaCurrent) / totalCurrent,
          y_abs: oaCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categories[catIndex],
          bsoDomain,
        });
        repository.push({
          y: (100 * repositoryCurrent) / totalCurrent,
          y_abs: repositoryCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categories[catIndex],
          bsoDomain,
        });
        publisher.push({
          y: (100 * publisherCurrent) / totalCurrent,
          y_abs: publisherCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categories[catIndex],
          bsoDomain,
        });
        publisherRepository.push({
          y: (100 * publisherRepositoryCurrent) / totalCurrent,
          y_abs: publisherRepositoryCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categories[catIndex],
          bsoDomain,
        });
      });

      const dataGraph = [
        {
          name: intl.formatMessage({
            id: 'app.type-hebergement.publisher-repository',
          }),
          data: publisherRepository,
          color: getCSSValue('--green-light-100'),
          dataLabels: noOutline,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.repository' }),
          data: repository,
          color: getCSSValue('--green-medium-125'),
          dataLabels: noOutline,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.publisher' }),
          data: publisher,
          color: yellowMedium125,
          dataLabels: {
            ...noOutline,
            style: { color: getCSSValue('--g-800') },
          },
        },
      ];
      return { categories, dataGraph };
    },
    [domain, disciplineField, intl, yellowMedium125, bsoDomain],
  );

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataForLastObservationSnap(observationSnap);
        setData(dataGraph);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationSnap]);

  return { allData, isLoading };
}
export default useGetData;
