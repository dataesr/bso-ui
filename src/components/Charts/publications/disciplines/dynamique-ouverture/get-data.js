/* eslint-disable no-console */
import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';

function useGetData(observationSnaps, domain = '') {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const intl = useIntl();

  const getDataByObservationSnaps = useCallback(
    async (datesObservation) => {
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const disciplineField = domain === 'health' ? 'bsso_classification.field' : 'bso_classification';
      // Pour chaque date d'observation, récupération des données associées
      const queries = [];
      datesObservation
        ?.sort((a, b) => b.substr(0, 4) - a.substr(0, 4))
        .forEach((oneDate) => {
          const query = getFetchOptions(
            'publicationRateDiscipline',
            domain,
            oneDate,
            disciplineField,
          );
          queries.push(Axios.post(ES_API_URL, query, HEADERS));
        });

      const res = await Axios.all(queries).catch(() => {
        setLoading(false);
      });
      const dataGraph = {};
      const disciplines = [];
      res.forEach((el, idx) => {
        const currentSnap = datesObservation[idx];
        el.data.aggregations.by_discipline.buckets
          .filter((b) => b.key !== 'unknown')
          .forEach((item) => {
            if (!dataGraph[item.key]) {
              dataGraph[item.key] = [];
              disciplines.push(item.key);
            }
            dataGraph[item.key].push({
              x: idx,
              bsoDomain,
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
      disciplines.forEach((discipline) => {
        dataHist.push({
          name: discipline,
          bsoDomain,
          data: datesObservation.slice(0) // make a copy before sorting in ascending order !
            .sort((a, b) => a.substr(0, 4) - b.substr(0, 4))
            .map((obs) => ({
              name: obs,
              bsoDomain,
              y_tot: dataGraph[discipline].find((x) => x.observation_date === obs)
                .y_tot,
              y_abs: dataGraph[discipline].find((x) => x.observation_date === obs)
                .y_abs,
              y: dataGraph[discipline].find((x) => x.observation_date === obs).y,
              x: dataGraph[discipline].find((x) => x.observation_date === obs).x,
            })),
        });
      });
      return dataHist;
    },
    [domain, intl],
  );

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataByObservationSnaps(observationSnaps);
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationSnaps, getDataByObservationSnaps]);

  return { data, isLoading };
}
export default useGetData;
