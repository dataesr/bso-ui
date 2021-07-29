/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  accesferme,
  archiveouverte100,
  editeurarchive,
  editeurplateforme100,
} from '../../../../../style/colours.module.scss';

function useGetData(observationDate, isOa) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function getDataForLastObservationDate(lastObservationDate) {
    // TODO move options to helpers
    const query = {
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
          },
          aggs: {
            by_oa_host_type: {
              terms: {
                field: `oa_details.${lastObservationDate}.oa_host_type.keyword`,
              },
              aggs: {
                by_grant_agency: {
                  terms: {
                    field: 'grants.agency.keyword',
                  },
                },
              },
            },
          },
        },
      },
    };

    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));
    const data = res.data.aggregations.by_is_oa.buckets;

    const dataGraph = [];

    data.forEach((el) => {
      if (el.key === 0) {
        // acces fermé
        dataGraph.push({
          id: 'closed',
          name: intl.formatMessage({ id: 'app.type-hebergement.closed' }),
        });
        el.by_oa_host_type.buckets[0].by_grant_agency.buckets.forEach(
          (agency) => {
            dataGraph.push({
              name: agency.key,
              key: agency.key,
              parent: 'closed',
              value: agency.doc_count,
              color: accesferme,
            });
          },
        );
      } else {
        // access ouvert
        dataGraph.push({
          id: 'opened',
          name: intl.formatMessage({ id: 'app.type-hebergement.opened' }),
        });
        el.by_oa_host_type.buckets.forEach((hostType) => {
          dataGraph.push({
            name: intl.formatMessage({
              id: `app.type-hebergement.${hostType.key}`,
            }),
            id: hostType.key,
            parent: 'opened',
          });
          hostType.by_grant_agency.buckets.forEach((agency) => {
            let color = accesferme;
            if (hostType.key === 'repository') {
              color = archiveouverte100;
            }
            if (hostType.key === 'publisher') {
              color = editeurplateforme100;
            }
            if (hostType.key === 'publisher;repository') {
              color = editeurarchive;
            }
            dataGraph.push({
              name: agency.key,
              key: agency.key,
              parent: hostType.key,
              value: agency.doc_count,
              color,
            });
          });
        });
      }
    });

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
