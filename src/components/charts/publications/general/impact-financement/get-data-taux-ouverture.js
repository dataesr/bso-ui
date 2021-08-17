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
      const queryFilter = [{ term: { 'domains.keyword': 'health' } }];
      if (agency) {
        queryFilter.push({ term: { 'grants.agency.keyword': agency } });
      }
      query = {
        size: 0,
        query: {
          bool: {
            filter: queryFilter,
          },
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
                aggs: {
                  by_is_oa: {
                    terms: {
                      field: `oa_details.${lastObservationDate}.is_oa`,
                    },
                  },
                },
              },
              by_is_oa: {
                terms: {
                  field: `oa_details.${lastObservationDate}.is_oa`,
                },
              },
            },
          },
        },
      };
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

          // avec ou sans declaration
          const Oa = el.by_is_oa.buckets.find(
            (item) => item.key === 1,
          )?.doc_count || 0;
          all.push(Math.round((100 * Oa) / el.doc_count));
          // avec declaration
          const withDeclarationElements = el.by_has_grant.buckets.find(
            (item) => item.key === 1,
          );
          const withDeclarationOa = withDeclarationElements.by_is_oa.buckets.find(
            (item) => item.key === 1,
          )?.doc_count || 0;
          withDeclaration.push(Math.round((100 * withDeclarationOa) / withDeclarationElements.doc_count));
          // sans declaration
          const withoutDeclarationElements = el.by_has_grant.buckets.find(
            (item) => item.key === 0,
          );
          const withoutDeclarationOa = withoutDeclarationElements.by_is_oa.buckets.find(
            (item) => item.key === 1,
          )?.doc_count || 0;
          withoutDeclaration.push(((100 * withoutDeclarationOa) / withoutDeclarationElements.doc_count));
          // si une agence en particulier est sélectionnée
          // TODO : ajouter une 4e barre
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
