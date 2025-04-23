import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS, IS_TEST } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getObservationLabel } from '../../../../../utils/helpers';

function useGetData(observationSnaps, domain = '') {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();

  const getDataByObservationSnaps = useCallback(
    async (observationYears) => {
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const disciplineField = domain === 'health'
        ? 'bsso_classification.field'
        : 'bso_classification';
      // Pour chaque date d'observation, récupération des données associées
      const queries = [];
      observationYears
        ?.sort((a, b) => b.substring(0, 4) - a.substring(0, 4))
        .forEach((oneDate) => {
          const query = getFetchOptions({
            key: 'publicationRateDiscipline',
            domain,
            parameters: [oneDate, disciplineField],
            objectType: ['publications'],
          });
          queries.push(Axios.post(ES_API_URL, query, HEADERS));
        });

      // const res = await Axios.all(queries);
      // const res = graphData;

      /* eslint-disable no-underscore-dangle */
      // 1回目のクエリ 最新のcalc_dateを取得
      const latestDateRes = await Axios.post(ES_API_URL, {
        size: 0,
        aggs: {
          unique_calc_dates: {
            terms: {
              field: 'calc_date',
              size: 10000,
            },
          },
        },
      });

      // ユニークな `calc_date` のリストを取得
      const yearMonthDayList = latestDateRes.data.aggregations.unique_calc_dates.buckets.map(
        (bucket) => bucket.key_as_string.slice(0, 10),
      );

      const yearGroups = yearMonthDayList.reduce((acc, date) => {
        const year = date.slice(0, 4);
        if (!acc[year]) acc[year] = [];
        acc[year].push(date);
        return acc;
      }, {});
      const lastDateOfYear = [];

      // 各年のデータから最終日を取得
      Object.keys(yearGroups).forEach((year) => {
        /* eslint-enable arrow-parens, no-confusing-arrow */
        const yearDates = yearGroups[year];
        const lastDate = yearDates.reduce((latest, current) => (current > latest ? current : latest));
        lastDateOfYear.push(lastDate);
      });
      const preRes = await Axios.post(ES_API_URL, {
        size: 10000,
        query: {
          bool: {
            filter: [
              { terms: { calc_date: lastDateOfYear } },
              { term: { data_type: 'disciplines.dynamique-ouverture.get-data' } },
            ],
          },
        },
      });

      // データ成形処理
      let res = [];
      if (observationYears) {
      // データをpublication_yearごとにグループ化
      const groupedByYear = {};
      for (let i = 0; i < lastDateOfYear.length; i += 1) {
        const year = parseInt(lastDateOfYear[i].slice(0, 4), 10);
        preRes.data.hits.hits.forEach((hit) => {
          if (lastDateOfYear[i] === hit._source.calc_date) {
            hit._source.data.forEach((item) => {
              if (item.publication_year === year - 1) {
                if (!groupedByYear[year]) {
                  groupedByYear[year] = [];
                }
                groupedByYear[year].push({
                  field: hit._source.field,
                  total: item.total,
                  oa: item.oa,
                });
              }
            });
          }
        });
      }
      // publication_yearの降順でソート
      const sortedYears = Object.keys(groupedByYear).sort((a, b) => b - a);

      // 各publication_yearごとにデータを成形
      sortedYears.forEach((year) => {
        const buckets = groupedByYear[year].map((item) => ({
          key: item.field,
          doc_count: item.total,
          by_is_oa: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              { key: 0, key_as_string: 'false', doc_count: item.total - item.oa },
              { key: 1, key_as_string: 'true', doc_count: item.oa },
            ],
          },
        }));

        res.push({
          data: {
            aggregations: {
              by_discipline: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: buckets.sort((a, b) => a.key.localeCompare(b.key)),
              },
            },
          },
        });
      });
      } else {
        res = [];
      }

      if (IS_TEST) {
        console.log('dynamique-ouverture_preRes:', preRes); // eslint-disable-line no-console
        console.log('dynamique-ouverture_res:', res); // eslint-disable-line no-console
      }

      const dataGraph = {};
      const disciplines = [];
      res.forEach((el, idx) => {
        const currentSnap = observationYears[idx];
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
          data: observationYears
            .slice(0) // make a copy before sorting in ascending order !
            .sort((a, b) => a.substring(0, 4) - b.substring(0, 4))
            .map((obs) => {
              const dataByDisciplineByObservationDate = dataByDiscipline.find(
                (item) => item.observation_date === obs,
              );
              return {
                name: getObservationLabel(obs, intl, true),
                bsoDomain,
                obs,
                y_tot: dataByDisciplineByObservationDate?.y_tot || 0,
                y_abs: dataByDisciplineByObservationDate?.y_abs || 0,
                y: dataByDisciplineByObservationDate?.y || 0,
                x: dataByDisciplineByObservationDate?.x || 0,
              };
            }),
        });
      });
      dataHist = dataHist.filter((el) => el.data[el.data.length - 1].y_tot > 0);
      let bestProgressionDiscipline = '';
      let bestProgressionValue1 = '';
      let bestProgressionValue2 = '';
      let bestRateDiscipline = '';
      let bestRateValue = '';
      let firstObservationYear = '';
      let year1 = '';
      let year2 = '';
      if (dataHist && dataHist.length > 0) {
        const serieLength = dataHist[0]?.data.length - 1;
        dataHist = dataHist.sort(
          (a, b) => b.data[serieLength].y - a.data[serieLength].y,
        );
        bestRateValue = dataHist[0]?.data[serieLength].y.toFixed(0);
        bestRateDiscipline = intl.formatMessage({
          id: `app.discipline.${dataHist[0].name
            .replace(/\n/g, '')
            .replace('  ', ' ')}`,
        });
        if (serieLength > 0) {
          year1 = dataHist[0].data[serieLength - 1].name;
        }
        year2 = dataHist[0].data[serieLength].name.replace('<br/>', ' - ');

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
          id: `app.discipline.${dataHist[0].name
            .replace(/\n/g, '')
            .replace('  ', ' ')}`,
        });
        firstObservationYear = getObservationLabel(
          observationYears[observationYears.length - 1],
          intl,
        );
      }

      const comments = {
        bestProgressionDiscipline,
        bestProgressionValue1,
        bestProgressionValue2,
        bestRateDiscipline,
        bestRateValue,
        firstObservationYear,
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
    [domain, intl],
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
  }, [getDataByObservationSnaps, observationSnaps]);

  return { data, isError, isLoading };
}
export default useGetData;
