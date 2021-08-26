/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  accesferme,
  accesouvert,
  archiveouverte100,
  editeurarchive,
  editeurplateforme100,
} from '../../../../../style/colours.module.scss';
import { getFetchOptions } from '../../../../../utils/helpers';

function useGetData(observationSnap, isOa) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function getDataForLastObservationSnap(lastObservationSnap) {
    const publicationDate = Number(lastObservationSnap.slice(0, 4)) - 1;
    const field = isOa ? 'oa_host_type.keyword' : 'is_oa';
    const query = getFetchOptions(
      'openingType',
      'health',
      lastObservationSnap,
      field,
      'genre.keyword',
    );
    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));
    const data = res.data.aggregations.by_is_oa.buckets;

    let dataGraph = [];
    const totalPublications = data.reduce((a, b) => a + b.doc_count, 0);
    if (!isOa) {
      dataGraph = [
        {
          id: 'closed',
          name: intl.formatMessage({ id: 'app.type-hebergement.closed' }),
          color: accesferme,
        },
        {
          id: 'open',
          name: intl.formatMessage({ id: 'app.type-hebergement.open' }),
          color: accesouvert,
        },
      ];

      // Ajout des "fermés"
      data
        .find((el) => el.key === 0)
        .by_publication_split.buckets.forEach((el) => {
          dataGraph.push({
            name: intl.formatMessage({ id: `app.publication-genre.${el.key}` }),
            oaType: intl.formatMessage({ id: 'app.type-hebergement.closed' }),
            key: el.key,
            parent: 'closed',
            value: el.doc_count,
            total: totalPublications,
            publicationDate,
            percentage: (100 * el.doc_count) / totalPublications,
          });
        });

      // Ajout des "ouverts"
      data
        .find((el) => el.key === 1)
        .by_publication_split.buckets.forEach((el) => {
          dataGraph.push({
            name: intl.formatMessage({ id: `app.publication-genre.${el.key}` }),
            oaType: intl.formatMessage({ id: 'app.type-hebergement.open' }),
            key: el.key,
            parent: 'open',
            value: el.doc_count,
            total: totalPublications,
            publicationDate,
            percentage: (100 * el.doc_count) / totalPublications,
          });
        });
    } else {
      data.forEach((el) => {
        let color = accesferme;
        if (el.key === 'repository') {
          color = archiveouverte100;
        }
        if (el.key === 'publisher') {
          color = editeurplateforme100;
        }
        if (el.key === 'publisher;repository') {
          color = editeurarchive;
        }
        dataGraph.push({
          id: el.key,
          name: intl.formatMessage({ id: `app.type-hebergement.${el.key}` }),
          oaType: intl.formatMessage({ id: 'app.type-hebergement.open' }),
          color,
        });
        el.by_publication_split.buckets.forEach((item) => {
          dataGraph.push({
            name: intl.formatMessage({
              id: `app.publication-genre.${item.key}`,
            }),
            oaType: intl.formatMessage({ id: 'app.type-hebergement.open' }),
            key: item.key,
            parent: el.key,
            value: item.doc_count,
            total: totalPublications,
            publicationDate,
            percentage: (100 * el.doc_count) / totalPublications,
          });
        });
      });
    }
    return { dataGraph };
  }

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
  }, [observationSnap, isOa]);

  return { allData, isLoading };
}
export default useGetData;
