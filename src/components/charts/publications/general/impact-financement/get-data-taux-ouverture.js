/* eslint-disable no-console */
import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  discipline100,
  discipline150,
  nonconnu,
} from '../../../../../style/colours.module.scss';

function useGetData(observationDate, agency) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [agencies, setAgencies] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getDataForLastObservationDate = useCallback(
    async (lastObservationDate) => {
      let query = '';
      if (!agency) {
        query = {
          size: 0,
          query: {
            bool: {
              filter: [{ term: { 'domains.keyword': 'health' } }],
            },
          },
          aggs: {
            by_publication_year: {
              terms: {
                field: 'year',
              },
              aggs: {
                by_publication_year: {
                  terms: {
                    field: 'year',
                  },
                  aggs: {
                    by_has_grant: {
                      terms: {
                        field: 'has_grant',
                      },
                    },
                  },
                },
              },
            },
          },
        };
      } else {
        query = {
          size: 0,
          query: {
            bool: {
              filter: [
                { term: { 'domains.keyword': 'health' } },
                { wildcard: { 'grants.agency.keyword': agency } },
              ],
            },
          },
          aggs: {
            by_publication_year: {
              terms: {
                field: 'year',
              },
              aggs: {
                by_publication_year: {
                  terms: {
                    field: 'year',
                  },
                  aggs: {
                    by_has_grant: {
                      terms: {
                        field: 'has_grant',
                      },
                    },
                  },
                },
              },
            },
          },
        };
      }

      const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));
      const data = res.data.aggregations.by_publication_year.buckets;

      // Tri pour avoir les années dans l'ordre d'affichage du graph
      data.sort((a, b) => a.key - b.key);

      const categories = []; // Elements d'abscisse
      const all = [];
      const withDeclaration = [];
      const withoutDeclaration = [];

      data
        .filter(
          (el) => el.key > 2012
            && parseInt(el.key, 10)
              < parseInt(lastObservationDate.substring(0, 4), 10),
        )
        .forEach((el) => {
          categories.push(el.key);

          all.push(el.doc_count);
          withDeclaration.push(
            el.by_publication_year.buckets[0].by_has_grant.buckets.find(
              (item) => item.key === 1,
            )?.doc_count || 0,
          );
          withoutDeclaration.push(
            el.by_publication_year.buckets[0].by_has_grant.buckets.find(
              (item) => item.key === 0,
            )?.doc_count || 0,
          );
        });

      const dataGraph = [
        {
          name: intl.formatMessage({
            id: 'app.all-publications',
          }),
          data: all,
          color: discipline100,
        },
        {
          name: intl.formatMessage({ id: 'app.with-declaration' }),
          data: withDeclaration,
          color: discipline150,
        },
        {
          name: intl.formatMessage({ id: 'app.without-declaration' }),
          data: withoutDeclaration,
          color: nonconnu,
        },
      ];

      return { categories, dataGraph };
    },
    [intl, agency],
  );

  async function GetAllAgencies() {
    const query = {
      size: 0,
      query: {
        bool: {
          filter: { term: { 'domains.keyword': 'health' } },
          must: { match: { has_grant: 'true' } },
        },
      },
      aggs: {
        by_agency: {
          terms: {
            field: 'grants.agency.keyword',
          },
        },
      },
    };
    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));
    const data = res.data.aggregations.by_agency.buckets;
    return data;
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataForLastObservationDate(observationDate);
        const allAgencies = await GetAllAgencies();
        setAgencies(allAgencies.map((el) => el.key));
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationDate, agency]);

  return { allData, isLoading, agencies };
}
export default useGetData;
