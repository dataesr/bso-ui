/* eslint-disable no-console */
import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  internationale100,
  national100,
} from '../../../../../style/colours.module.scss';
import { getFetchOptions } from '../../../../../utils/helpers';

function useGetData(observationDate) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  const getDataForLastObservationDate = useCallback(
    async (lastObservationDate) => {
      const queries = [];
      const query1 = getFetchOptions('publicationRateRangUtile', 'health', lastObservationDate);
      queries.push(Axios.post(ES_API_URL, query1, HEADERS));
      const query2 = getFetchOptions('publicationRatePays', 'health', lastObservationDate);
      queries.push(Axios.post(ES_API_URL, query2, HEADERS));
      const res = await Axios.all(queries).catch(() => {
        setLoading(false);
      });
      let data = res[0].data.aggregations.by_publication_year.buckets;

      // Tri pour avoir les années dans l'ordre d'affichage du graphe
      data = data.sort((a, b) => a.key - b.key)
        .filter(
          (el) => el.key > 2012
            && parseInt(el.key, 10)
              < parseInt(lastObservationDate.substring(0, 4), 10),
        );
      console.log('ttt', data);
      const categories = []; // Elements d'abscisse
      const fr = []; // rang utile fr
      const foreign = []; // rang utile etranger

      data.forEach((el) => {
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

      const dataGraph3 = [
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.publisher' }),
        },
      ];

      return { categories, dataGraph, dataGraph3 };
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
