/* eslint-disable no-console */
import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  accesouvert,
  internationale100,
  national100,
} from '../../../../../style/colours.module.scss';
import { getFetchOptions, getPublicationYearFromObservationSnap } from '../../../../../utils/helpers';

function useGetData(observationDate) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  const getDataForLastObservationDate = useCallback(
    async (lastObservationSnap) => {
      const queries = [];
      const query1 = getFetchOptions('publicationRateRangUtile', 'health', lastObservationSnap);
      queries.push(Axios.post(ES_API_URL, query1, HEADERS));
      const query2 = getFetchOptions('publicationRatePays', 'health', lastObservationSnap);
      queries.push(Axios.post(ES_API_URL, query2, HEADERS));
      const res = await Axios.all(queries).catch(() => {
        setLoading(false);
      });
      // 1er graphe
      let data1 = res[0].data.aggregations.by_publication_year.buckets;

      // Tri pour avoir les années dans l'ordre d'affichage du graphe
      data1 = data1.sort((a, b) => a.key - b.key)
        .filter(
          (el) => el.key > 2012
            && parseInt(el.key, 10)
              < parseInt(lastObservationSnap.substring(0, 4), 10),
        );
      const categories = []; // Elements d'abscisse
      const fr = []; // rang utile fr
      const foreign = []; // rang utile etranger

      data1.forEach((el) => {
        categories.push(el.key);
        const frCurrent = el.by_author_useful_rank_fr.buckets.find((item) => item.key === 1);
        const foreignCurrent = el.by_author_useful_rank_fr.buckets.find((item) => item.key === 0);
        fr.push({
          y: (100 * frCurrent.by_is_oa.buckets.find((item) => item.key === 1).doc_count) / frCurrent.doc_count,
          y_abs: frCurrent.by_is_oa.buckets.find((item) => item.key === 1).doc_count,
          y_tot: frCurrent.doc_count,
          x: el.key,
        });
        foreign.push({
          y: (100 * foreignCurrent.by_is_oa.buckets.find((item) => item.key === 1).doc_count) / foreignCurrent.doc_count,
          y_abs: foreignCurrent.by_is_oa.buckets.find((item) => item.key === 1).doc_count,
          y_tot: foreignCurrent.doc_count,
          x: el.key,
        });
      });

      const dataGraph = [
        {
          name: intl.formatMessage({
            id: 'app.affiliations.rang-utile-fr',
          }),
          data: fr,
          color: national100,
        },
        {
          name: intl.formatMessage({ id: 'app.affiliations.rang-utile-etranger' }),
          data: foreign,
          color: internationale100,
        },
      ];
      // 2e graphe
      const data2 = res[1].data.aggregations.by_country.buckets;
      const categories2 = []; // Elements d'abscisse
      let oaCountry = [];
      data2.forEach((el) => {
        oaCountry.push({
          y: (100 * el.by_is_oa.buckets.find((item) => item.key === 1).doc_count) / el.doc_count,
          y_abs: el.by_is_oa.buckets.find((item) => item.key === 1).doc_count,
          y_tot: el.doc_count,
          country: intl.formatMessage({ id: `app.country.${el.key}` }),
          publicationDate: getPublicationYearFromObservationSnap(lastObservationSnap),
          color: (el.key === 'fr') ? national100 : accesouvert,
        });
      });
      oaCountry = oaCountry.sort((a, b) => a.y - b.y);
      oaCountry.forEach((el) => {
        categories2.push(el.country);
      });
      const dataGraph2 = [
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.open' }),
          data: oaCountry,
          color: accesouvert,
        },
      ];

      return { categories, categories2, dataGraph, dataGraph2 };
    },
    [intl],
  );

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
  }, [observationDate]);

  return { allData, isLoading };
}
export default useGetData;
