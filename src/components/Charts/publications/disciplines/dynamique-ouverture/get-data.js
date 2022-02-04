import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getObservationLabel } from '../../../../../utils/helpers';

function useGetData(observationSnaps, domain = '') {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const { search } = useLocation();

  const getDataByObservationSnaps = useCallback(
    async (datesObservation) => {
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const disciplineField = domain === 'health'
        ? 'bsso_classification.field'
        : 'bso_classification';
      // Pour chaque date d'observation, récupération des données associées
      const queries = [];
      datesObservation
        ?.sort((a, b) => b.substr(0, 4) - a.substr(0, 4))
        .forEach((oneDate) => {
          const query = getFetchOptions({
            key: 'publicationRateDiscipline',
            domain,
            search,
            parameters: [oneDate, disciplineField],
          });
          queries.push(Axios.post(ES_API_URL, query, HEADERS));
        });

      const res = await Axios.all(queries);
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
            const oaPublicationsCount = item.by_is_oa.buckets.find((x) => x.key === 1)?.doc_count || 0;
            dataGraph[item.key].push({
              x: idx,
              bsoDomain,
              observation_date: currentSnap,
              y_tot: item?.doc_count || 0,
              y_abs: oaPublicationsCount,
              y: (oaPublicationsCount / item?.doc_count || 0) * 100,
            });
          });
      });

      let dataHist = [];
      disciplines.forEach((discipline) => {
        const dataByDiscipline = dataGraph[discipline];
        dataHist.push({
          name: discipline,
          bsoDomain,
          data: datesObservation
            .slice(0) // make a copy before sorting in ascending order !
            .sort((a, b) => a.substr(0, 4) - b.substr(0, 4))
            .map((obs) => {
              const dataByDisciplineByObservationDate = dataByDiscipline.find(
                (item) => item.observation_date === obs,
              );
              return {
                name: getObservationLabel(obs, intl, true),
                bsoDomain,
                y_tot: dataByDisciplineByObservationDate?.y_tot || 0,
                y_abs: dataByDisciplineByObservationDate?.y_abs || 0,
                y: dataByDisciplineByObservationDate?.y || 0,
                x: dataByDisciplineByObservationDate?.x || 0,
              };
            }),
        });
      });
      let bestRateValue = '';
      let bestRateDiscipline = '';
      let bestProgressionValue1 = '';
      let bestProgressionValue2 = '';
      let bestProgressionDiscipline = '';
      let year1 = '';
      let year2 = '';
      if (dataHist && dataHist.length > 0) {
        const serieLength = dataHist[0]?.data.length - 1;
        dataHist = dataHist.sort(
          (a, b) => b.data[serieLength].y - a.data[serieLength].y,
        );
        bestRateValue = dataHist[0]?.data[serieLength].y.toFixed(0);
        bestRateDiscipline = intl.formatMessage({
          id: `app.discipline.${dataHist[0].name}`,
        });
        year1 = dataHist[0].data[serieLength - 1].name;
        year2 = dataHist[0].data[serieLength].name.replace('<br/>', ' ');

        dataHist = dataHist.sort((a, b) => {
          const minA = a.data[0].y;
          const maxA = a.data[serieLength].y;
          const minB = b.data[0].y;
          const maxB = b.data[serieLength].y;
          return maxB - minB - (maxA - minA);
        });
        bestProgressionValue1 = dataHist[0].data[0].y.toFixed(0);
        bestProgressionValue2 = dataHist[0].data[serieLength].y.toFixed(0);
        bestProgressionDiscipline = intl.formatMessage({
          id: `app.discipline.${dataHist[0].name}`,
        });
      }

      const comments = {
        bestRateValue,
        bestRateDiscipline,
        bestProgressionValue1,
        bestProgressionValue2,
        bestProgressionDiscipline,
        year1,
        year2,
      };

      return {
        comments,
        ctas: [
          'https://www.arc.gov.au/excellence-research-australia/era-2018-journal-list#-strong-fields-of-research-codes-fors-strong-',
          'https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc/latest-release',
          'https://www.ncbi.nlm.nih.gov/mesh',
          `../..${intl.formatMessage({ id: 'url.about.methodology' })}`,
        ],
        dataHist,
      };
    },
    [domain, intl, search],
  );

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataByObservationSnaps(observationSnaps);
        setData(dataGraph);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationSnaps, getDataByObservationSnaps]);

  return { data, isLoading, isError };
}
export default useGetData;
