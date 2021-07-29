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

function useGetData(observationDate, isOa) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function getDataForLastObservationDate(lastObservationDate) {
    let query = '';
    if (!isOa) {
      query = {
        size: 0,
        query: {
          bool: {
            filter: [{ term: { 'domains.keyword': 'health' } }],
          },
        },
        aggs: {
          by_is_oa: {
            terms: {
              field: `oa_details.${lastObservationDate}.is_oa`,
              order: { _key: 'asc' },
            },
            aggs: {
              by_publication_genre: {
                terms: {
                  field: 'lang.keyword',
                },
              },
            },
          },
        },
      };
    } else {
      query = {
        size: 0,
        aggs: {
          by_is_oa: {
            terms: {
              field: `oa_details.${lastObservationDate}.oa_host_type.keyword`,
              order: { _key: 'asc' },
            },
            aggs: {
              by_publication_genre: {
                terms: {
                  field: 'lang.keyword',
                },
              },
            },
          },
        },
      };
    }

    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));
    const data = res.data.aggregations.by_is_oa.buckets;

    let dataGraph = [];
    if (!isOa) {
      dataGraph = [
        {
          id: 'closed',
          name: intl.formatMessage({ id: 'app.type-hebergement.closed' }),
          color: accesferme,
        },
        {
          id: 'opened',
          name: intl.formatMessage({ id: 'app.type-hebergement.opened' }),
          color: accesouvert,
        },
      ];

      // Ajout des "fermés"
      data
        .find((el) => el.key === 0)
        .by_publication_genre.buckets.forEach((el) => {
          dataGraph.push({
            name: intl.formatMessage({ id: `app.lang.${el.key}` }),
            key: el.key,
            parent: 'closed',
            value: el.doc_count,
          });
        });

      // Ajout des "ouverts"
      data
        .find((el) => el.key === 1)
        .by_publication_genre.buckets.forEach((el) => {
          dataGraph.push({
            name: intl.formatMessage({ id: `app.lang.${el.key}` }),
            key: el.key,
            parent: 'opened',
            value: el.doc_count,
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
          color,
        });
        el.by_publication_genre.buckets.forEach((item) => {
          dataGraph.push({
            name: intl.formatMessage({
              id: `app.lang.${item.key}`,
            }),
            key: item.key,
            parent: el.key,
            value: item.doc_count,
          });
        });
      });
    }

    return { dataGraph };
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataForLastObservationDate(observationDate);
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationDate, isOa]);

  return { allData, isLoading };
}
export default useGetData;
