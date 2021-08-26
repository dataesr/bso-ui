/* eslint-disable no-console */
import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  accesferme,
  archiveouverte100,
  editeurarchive,
  editeurplateforme100,
} from '../../../../../style/colours.module.scss';
import { getFetchOptions } from '../../../../../utils/helpers';

function useGetData(observationSnap) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions('oaHostType', 'health', lastObservationSnap);
      const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));
      const data = res.data.aggregations.by_publication_year.buckets;

      // Tri pour avoir les années dans l'ordre d'affichage du graphe
      data.sort((a, b) => a.key - b.key);

      const categories = []; // Elements d'abscisse
      const repository = []; // archive ouverte
      const publisher = []; // éditeur
      const publisherRepository = []; // les 2
      const oa = []; // oa
      const closed = []; // closed

      data
        .filter(
          (el) => el.key > 2012
            && parseInt(el.key, 10)
              < parseInt(lastObservationSnap.substring(0, 4), 10),
        )
        .forEach((el) => {
          categories.push(el.key);

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
            x: el.key,
          });
          oa.push({
            y: (100 * oaCurrent) / totalCurrent,
            y_abs: oaCurrent,
            y_tot: totalCurrent,
            x: el.key,
          });
          repository.push({
            y: (100 * repositoryCurrent) / totalCurrent,
            y_abs: repositoryCurrent,
            y_tot: totalCurrent,
            x: el.key,
          });
          publisher.push({
            y: (100 * publisherCurrent) / totalCurrent,
            y_abs: publisherCurrent,
            y_tot: totalCurrent,
            x: el.key,
          });
          publisherRepository.push({
            y: (100 * publisherRepositoryCurrent) / totalCurrent,
            y_abs: publisherRepositoryCurrent,
            y_tot: totalCurrent,
            x: el.key,
          });
        });

      const dataGraph = [
        {
          name: intl.formatMessage({
            id: 'app.type-hebergement.publisher-repository',
          }),
          data: publisherRepository,
          color: editeurarchive,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.repository' }),
          data: repository,
          color: archiveouverte100,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.publisher' }),
          data: publisher,
          color: editeurplateforme100,
        },
      ];

      const dataGraph3 = [
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.publisher' }),
          value: publisher[publisher.length - 1].y_abs,
          percentage: publisher[publisher.length - 1].y,
          publicationDate: categories[categories.length - 1],
          color: editeurplateforme100,
        },
        {
          name: intl.formatMessage({
            id: 'app.type-hebergement.publisher-repository',
          }),
          value: publisherRepository[publisherRepository.length - 1].y_abs,
          percentage: publisherRepository[publisherRepository.length - 1].y,
          publicationDate: categories[categories.length - 1],
          color: editeurarchive,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.repository' }),
          value: repository[repository.length - 1].y_abs,
          percentage: repository[repository.length - 1].y,
          publicationDate: categories[categories.length - 1],
          color: archiveouverte100,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.closed' }),
          value: closed[closed.length - 1].y_abs,
          percentage: closed[closed.length - 1].y,
          publicationDate: categories[categories.length - 1],
          color: accesferme,
        },
      ];

      return { categories, dataGraph, dataGraph3 };
    },
    [intl],
  );

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataForLastObservationSnap(observationSnap);
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationSnap]);

  return { allData, isLoading };
}
export default useGetData;
