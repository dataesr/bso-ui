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
  search,
) {
  const disciplineField = domain === 'health' ? 'bsso_classification.field' : 'bso_classification';
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const yellowMedium125 = getCSSValue('--yellow-medium-125');

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions({
        key: 'disciplinesVoies',
        domain,
        search,
        parameters: [lastObservationSnap, disciplineField],
      });
      const res = await Axios.post(ES_API_URL, query, HEADERS);
      let data = res.data.aggregations.by_discipline.buckets;

      const categories = []; // Elements d'abscisse
      const categoriesComments = []; // Elements d'abscisse
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
        .filter((item) => item.key !== 'unknown')
        .map((item) => ({
          by_oa_host_type: item.by_oa_host_type,
          key: item.key,
          total: item.doc_count,
          closed:
            item.by_oa_host_type.buckets.find((item2) => item2.key === 'closed')
              ?.doc_count || 0,
          repository:
            item.by_oa_host_type.buckets.find(
              (item2) => item2.key === 'repository',
            )?.doc_count || 0,
          publisher:
            item.by_oa_host_type.buckets.find(
              (item2) => item2.key === 'publisher',
            )?.doc_count || 0,
          publisherRepo:
            item.by_oa_host_type.buckets.find(
              (item2) => item2.key === 'publisher;repository',
            )?.doc_count || 0,
        }));
      data.forEach((item, catIndex) => {
        const closedCurrent = item.by_oa_host_type.buckets.find((item2) => item2.key === 'closed')
          ?.doc_count || 0;
        const repositoryCurrent = item.by_oa_host_type.buckets.find(
          (item2) => item2.key === 'repository',
        )?.doc_count || 0;
        const publisherCurrent = item.by_oa_host_type.buckets.find(
          (item2) => item2.key === 'publisher',
        )?.doc_count || 0;
        const publisherRepositoryCurrent = item.by_oa_host_type.buckets.find(
          (item2) => item2.key === 'publisher;repository',
        )?.doc_count || 0;
        const totalCurrent = repositoryCurrent
          + publisherCurrent
          + publisherRepositoryCurrent
          + closedCurrent;
        const oaCurrent = repositoryCurrent + publisherCurrent + publisherRepositoryCurrent;
        const nameClean = item.key.replace(/\n/g, '').replace('  ', ' ');
        categories.push({
          key: nameClean,
          staff: totalCurrent,
          percent: (oaCurrent / totalCurrent) * 100,
        });
        categoriesComments.push(
          capitalize(intl.formatMessage({ id: `app.discipline.${nameClean}` })),
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
        repository.push({
          y: (repositoryCurrent / totalCurrent) * 100,
          y_abs: repositoryCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
          oaRate: (oaCurrent / totalCurrent) * 100,
        });
        publisher.push({
          y: (publisherCurrent / totalCurrent) * 100,
          y_abs: publisherCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
          oaRate: (oaCurrent / totalCurrent) * 100,
        });
        publisherRepository.push({
          y: (publisherRepositoryCurrent / totalCurrent) * 100,
          y_abs: publisherRepositoryCurrent,
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
              id: 'app.type-hebergement.publisher',
            }),
          ),
          data: publisher,
          color: yellowMedium125,
          dataLabels: {
            ...noOutline,
            style: { color: getCSSValue('--g-800') },
          },
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.type-hebergement.publisher-repository',
            }),
          ),
          data: publisherRepository,
          color: getCSSValue('--green-light-100'),
          dataLabels: noOutline,
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.type-hebergement.repository',
            }),
          ),
          data: repository,
          color: getCSSValue('--green-medium-125'),
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
        publicationYear: beforeLastObservationSnap,
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
      search,
      yellowMedium125,
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

  return { allData, isLoading, isError };
}
export default useGetData;
