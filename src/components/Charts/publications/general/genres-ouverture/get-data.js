import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, cleanNumber, getCSSValue, getPublicationYearFromObservationSnap } from '../../../../../utils/helpers';

function useGetData(observationSnap, domain) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const yellowMedium125 = getCSSValue('--yellow-medium-125');
  const greenLight100 = getCSSValue('--green-light-100');

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions(
        'oaHostType',
        domain,
        lastObservationSnap,
        'genre.keyword',
        getPublicationYearFromObservationSnap(lastObservationSnap),
      );
      const res = await Axios.post(ES_API_URL, query, HEADERS);
      const data = res.data.aggregations.by_publication_year.buckets;
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

      // Tri pour avoir les années dans l'ordre d'affichage du graphe
      data.sort((a, b) => a.key - b.key);
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
      const newData = [];
      ['journal-article', 'proceedings', 'book-chapter', 'book', 'preprint', 'dataset', 'other'].forEach((g) => {
        const currentElem = data.filter((el) => el.key === g);
        if (currentElem.length === 1) {
          newData.push(currentElem[0]);
        }
      });
      newData
        .filter((el) => el.doc_count >= 500)
        .forEach((el) => {
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
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x_val: intl.formatMessage({
              id: `app.publication-genre.${el.key}`,
            }),
            bsoDomain,
          });
          oa.push({
            y: (100 * oaCurrent) / totalCurrent,
            y_abs: oaCurrent,
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x_val: intl.formatMessage({
              id: `app.publication-genre.${el.key}`,
            }),
            bsoDomain,
          });
          repository.push({
            y: (100 * repositoryCurrent) / totalCurrent,
            y_abs: repositoryCurrent,
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x_val: intl.formatMessage({
              id: `app.publication-genre.${el.key}`,
            }),
            bsoDomain,
          });
          publisher.push({
            y: (100 * publisherCurrent) / totalCurrent,
            y_abs: publisherCurrent,
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x_val: intl.formatMessage({
              id: `app.publication-genre.${el.key}`,
            }),
            bsoDomain,
          });
          publisherRepository.push({
            y: (100 * publisherRepositoryCurrent) / totalCurrent,
            y_abs: publisherRepositoryCurrent,
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x_val: intl.formatMessage({
              id: `app.publication-genre.${el.key}`,
            }),
            bsoDomain,
          });
          categories.push(
            intl.formatMessage({ id: `app.publication-genre.${el.key}` })
              .concat('</br>(')
              .concat(intl.formatMessage({ id: 'app.effectif' })).concat(cleanNumber(totalCurrent))
              .concat(')'),
          );
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
          dataLabels: noOutline,
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.type-hebergement.publisher-repository',
            }),
          ),
          data: publisherRepository,
          color: greenLight100,
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

      const dataGraph3 = [
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.publisher' }),
          value: publisher[publisher.length - 1]?.y_abs,
          percentage: publisher[publisher.length - 1]?.y,
          publicationDate: categories[categories.length - 1],
          color: yellowMedium125,
          dataLabels: noOutline,
          bsoDomain,
        },
        {
          name: intl.formatMessage({
            id: 'app.type-hebergement.publisher-repository',
          }),
          value: publisherRepository[publisherRepository.length - 1]?.y_abs,
          percentage: publisherRepository[publisherRepository.length - 1]?.y,
          publicationDate: categories[categories.length - 1],
          color: greenLight100,
          dataLabels: noOutline,
          bsoDomain,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.repository' }),
          value: repository[repository.length - 1]?.y_abs,
          percentage: repository[repository.length - 1]?.y,
          publicationDate: categories[categories.length - 1],
          color: getCSSValue('--green-medium-125'),
          dataLabels: noOutline,
          bsoDomain,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.closed' }),
          value: closed[closed.length - 1]?.y_abs,
          percentage: closed[closed.length - 1]?.y,
          publicationDate: categories[categories.length - 1],
          color: getCSSValue('--blue-soft-175'),
          dataLabels: noOutline,
          bsoDomain,
        },
      ];

      return { categories, dataGraph, dataGraph3 };
    },
    [domain, greenLight100, intl, yellowMedium125],
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
