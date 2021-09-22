/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';

function useGetData(observationSnaps, domain = '') {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const intl = useIntl();

  async function GetData() {
    // Pour chaque date d'observation, récupération des données associées
    const queries = [];
    observationSnaps
      ?.sort((a, b) => b.substr(0, 4) - a.substr(0, 4))
      .forEach((oneDate) => {
        const query = getFetchOptions(
          'publicationRateAffiliation',
          domain,
          oneDate,
          'french_affiliations_types',
        );
        queries.push(Axios.post(ES_API_URL, query, HEADERS));
      });

    const res = await Axios.all(queries).catch(() => {
      setLoading(false);
    });
    const dataGraph = {};
    const affiliations = [];
    const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
    res.forEach((el, idx) => {
      const currentSnap = observationSnaps[idx];
      el.data.aggregations.by_affiliation.buckets
        .filter((b) => b.key !== 'unknown')
        .forEach((item) => {
          if (!dataGraph[item.key]) {
            dataGraph[item.key] = [];
            affiliations.push(item.key);
          }
          dataGraph[item.key].push({
            bsoDomain,
            x: idx,
            observation_date: currentSnap,
            y_tot: item.doc_count,
            y_abs: item.by_is_oa.buckets.find((x) => x.key === 1).doc_count,
            y:
              (item.by_is_oa.buckets.find((x) => x.key === 1).doc_count
                / item.doc_count)
              * 100,
          });
        });
    });
    const dataHist = [];
    affiliations.forEach((affiliation) => {
      dataHist.push({
        name: affiliation,
        bsoDomain,
        data: observationSnaps.slice(0) // make a copy before sorting in ascending order !
          .sort((a, b) => a.substr(0, 4) - b.substr(0, 4))
          .map((obs) => ({
            name: obs,
            bsoDomain,
            y_tot: dataGraph[affiliation].find((x) => x.observation_date === obs)
              .y_tot,
            y_abs: dataGraph[affiliation].find((x) => x.observation_date === obs)
              .y_abs,
            y: dataGraph[affiliation].find((x) => x.observation_date === obs).y,
            x: dataGraph[affiliation].find((x) => x.observation_date === obs).x,
          })),
      });
    });
    return dataHist;
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await GetData();
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationSnaps]);

  return { data, isLoading };
}
export default useGetData;
