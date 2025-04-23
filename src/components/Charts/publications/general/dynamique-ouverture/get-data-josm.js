import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

// import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { ES_API_URL, IS_TEST } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getObservationLabel,
} from '../../../../../utils/helpers';

function useGetData(
  observationSnaps,
  domain = '',
  genreType = [
    'journal-article',
    'proceedings',
    'book-chapter',
    'book',
    'preprint',
  ],
) {
  const intl = useIntl();
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const getDataByObservationSnaps = useCallback(
    async (observationYears) => {
      const queries = [];
      const allOaHostType = '*';
      const allPublishers = '*';
      observationYears
        ?.sort((a, b) => b.substring(0, 4) - a.substring(0, 4))
        .forEach((oneDate) => {
          const query = getFetchOptions({
            key: 'publicationRate',
            domain,
            parameters: [oneDate, allPublishers, allOaHostType, genreType],
            objectType: ['publications'],
          });
          // queries.push(Axios.post(ES_API_URL, query, HEADERS));
        });
      if (domain !== '') {
        observationYears
          ?.sort((a, b) => b.substring(0, 4) - a.substring(0, 4))
          .forEach((oneDate) => {
            const query = getFetchOptions({
              key: 'publicationRate',
              parameters: [oneDate],
              objectType: ['publications'],
            });
            // queries.push(Axios.post(ES_API_URL, query, HEADERS));
          });
      }

      // const res = await Axios.all(queries);
      // const allData = res.map((d, i) => ({
      //   observationSnap: observationYears[i % observationYears.length],
      //   data: d.data.aggregations.by_publication_year.buckets,
      // }));

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

      const preRes = await Axios.post(
        ES_API_URL,
        {
          size: 10000,
          query: {
            bool: {
              filter: [
                { terms: { calc_date: lastDateOfYear } },
                { term: { data_type: 'general.dynamique-ouverture.get-data' } },
              ],
            },
          },
        },
      );

      preRes.data.hits.hits.sort((a, b) => b._source.calc_date.localeCompare(a._source.calc_date));
      let res;
      if (observationYears) {
      // データ成形処理
      res = preRes.data.hits.hits.map((hit) => {
        const buckets = hit._source.data.map((item) => ({
          key: item.publication_year,
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

        return {
          data: {
            aggregations: {
              by_publication_year: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: buckets.sort((a, b) => a.key - b.key),
              },
            },
          },
        };
      });
    } else {
      res = [];
    }

      if (IS_TEST) {
        console.log('dynamique-ouverture_preRes:', preRes); // eslint-disable-line no-console
        console.log('dynamique-ouverture_res:', res); // eslint-disable-line no-console
      }

      // const allData = res.map((d, i) => ({
      //   observationSnap: observationYears[i % observationYears.length],
      //   data: d.data.aggregations.by_publication_year.buckets,
      // }));
      const allData = res.map((d, i) => ({
        observationSnap: observationYears.length > 0 ? observationYears[i % observationYears.length] : 'defaultSnap',
        data: d.data.aggregations.by_publication_year.buckets,
      }));

      /* eslint-enable no-underscore-dangle */

      // ここから下 そのまま
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const bsoDomainGlobal = intl.formatMessage({ id: 'app.bsoDomain.' });

      const colors = [
        getCSSValue('--orange-soft-100'),
        getCSSValue('--orange-soft-125'),
        getCSSValue('--orange-soft-125'),
        getCSSValue('--orange-soft-125'),
        getCSSValue('--orange-soft-125'),
        getCSSValue('--orange-soft-125'),
        getCSSValue('--orange-soft-125'),
        getCSSValue('--orange-soft-125'),
        getCSSValue('--orange-soft-125'),
        getCSSValue('--orange-soft-125'),
        getCSSValue('--orange-soft-125'),
      ];
      const dashStyles = [
        'Solid',
        'ShortDot',
        'ShortDashDot',
        'Dash',
        'ShortDash',
        'Dot',
        'ShortDashDotDot',
        'LongDash',
        'DashDot',
        'LongDashDot',
        'LongDashDotDot',
      ];
      const dataGraph2 = [];
      const dataGraphGlobal = [];
      allData.forEach((observationSnapData, i) => {
        const serie = {};
        const filtered = observationSnapData.data
          .sort((a, b) => a.key - b.key)
          .filter(
            (el) => el.key
                < parseInt(
                  observationSnapData.observationSnap.substring(0, 4),
                  10,
                )
              && el.by_is_oa.buckets.length > 0
              && el.doc_count
              && el.key > 2012,
          );
        serie.name = getObservationLabel(
          observationSnapData.observationSnap,
          intl,
        );
        serie.color = colors[i];
        serie.dashStyle = dashStyles[i];
        if (i === 0) {
          serie.marker = {
            fillColor: 'white',
            lineColor: colors[i],
            symbol: 'circle',
            lineWidth: 2,
            radius: 5,
          };
        }
        serie.data = filtered.map((el) => ({
          y_tot:
            el.by_is_oa.buckets[0].doc_count
            + (el.by_is_oa.buckets[1]?.doc_count || 0),
          y_abs: el.by_is_oa.buckets.find((b) => b.key === 1)?.doc_count || 0,
          publicationDate: el.key,
          bsoDomain,
          y:
            ((el.by_is_oa.buckets.find((b) => b.key === 1)?.doc_count || 0)
              / ((el.by_is_oa.buckets?.[0]?.doc_count || 0)
                + (el.by_is_oa.buckets?.[1]?.doc_count || 0)))
            * 100,
        }));
        serie.ratios = filtered.map(
          (el) => `(${
              el.by_is_oa.buckets.find((b) => b.key === 1)?.doc_count || 0
            } / ${
              el.by_is_oa.buckets[0].doc_count
              + (el.by_is_oa.buckets[1]?.doc_count || 0)
            })`,
        );
        serie.lastPublicationDate = filtered.length > 0 ? filtered[filtered.length - 1].key : 0;
        if (i < observationYears.length) {
          dataGraph2.push(serie);
        } else {
          dataGraphGlobal.push(serie);
        }
      });

      const dataGraph1 = { series: [] };
      const serie1 = [];
      const serieGlobal = [];
      dataGraph2.forEach((el) => {
        if (el.lastPublicationDate) {
          const publicationDate = Number(el.name.slice(0, 4)) - 1;
          const y = el.data.find(
            (item) => item.publicationDate === publicationDate,
          );
          let ratio = '';
          if (typeof y === 'undefined') {
            ratio = '(0 publications)';
          } else if (el.data.length) {
            ratio = el.ratios[el.data.length - 1];
          }
          serie1.push({
            bsoDomain,
            name: el.name,
            y: y?.y ?? 0,
            ratio,
            publicationDate,
          });
        }
      });
      dataGraphGlobal.forEach((el) => {
        if (el.lastPublicationDate) {
          serieGlobal.push({
            bsoDomain: bsoDomainGlobal,
            name: el.name,
            y: el.data.length > 0 ? el.data[el.data.length - 1].y : 0,
            ratio: el.data.length > 0 ? el.ratios[el.data.length - 1] : 0,
            publicationDate: el.lastPublicationDate,
          });
        }
      });
      const showInLegend = domain !== '';
      const currentName = domain !== ''
        ? intl.formatMessage({ id: `app.publications.${domain}` })
        : intl.formatMessage({ id: 'app.publications.global' });
      dataGraph1.series.push({
        data: serie1,
        showInLegend,
        name: capitalize(currentName),
      });
      if (domain !== '') {
        dataGraph1.series.push({
          data: serieGlobal,
          showInLegend,
          name: capitalize(
            intl.formatMessage({ id: 'app.publications.global' }),
          ),
          pointPlacement: -0.2,
        });
      }
      const categories = dataGraph2?.[0]?.data.map((item) => item.publicationDate) || [];

      const year3 = getObservationLabel(observationYears?.[0], intl);
      const year2 = getObservationLabel(observationYears?.[1], intl);
      const year1 = year2 - 1;
      const value1 = dataGraph2[1]?.data.slice(-1)?.[0]?.y.toFixed(1) || 0;
      const value2 = dataGraph1?.series[0]?.data
        .find((item) => item.name === year3)
        ?.y.toFixed(1) || 0;
      const healthPublicationsLabel = capitalize(
        intl.formatMessage({ id: 'app.publications.health' }),
      );
      const healthValue1 = dataGraph1?.series
        .find((item) => item.name === healthPublicationsLabel)
        ?.data?.find((item) => item.name === year2)
        ?.y.toFixed(0) || 0;
      const healthValue2 = dataGraph1?.series
        .find((item) => item.name === healthPublicationsLabel)
        ?.data?.find((item) => item.name === year3)
        ?.y.toFixed(0) || 0;

      const comments = {
        fistObservationYear: getObservationLabel(
          dataGraph2[dataGraph2.length - 1]?.name,
          intl,
        ),
        observationDate: dataGraph2[0]?.name,
        observationDate4: dataGraph2[3]?.name,
        oaYMinusOne4: dataGraph2[3]?.data.slice(-1)?.[0]?.y.toFixed(1) || 0,
        oaYMinus4: dataGraph2[0]?.data.slice(-4)?.[0]?.y.toFixed(1) || 0,
        publicationDate4:
          dataGraph2[3]?.data.slice(-1)?.[0]?.publicationDate || 0,
        minPublicationDate: dataGraph2[0]?.data?.[0]?.publicationDate || 0,
        oaYMinusOne: dataGraph2[0]?.data.slice(-2)?.[0]?.y.toFixed(0) || 0,
        oaEvolution:
          (
            dataGraph2?.[0]?.data.slice(-2)?.[0]?.y
            || 0 - dataGraph2?.[1]?.data.slice(-1)?.[0]?.y
            || 0
          ).toFixed(2) || 0,
        maxPublicationDate: dataGraph2?.[0]?.lastPublicationDate || '',
        year1,
        year2,
        year3,
        value1,
        value2,
        healthValue1,
        healthValue2,
        differenceValue: (value2 - value1).toFixed(1),
        healthDifferenceValue: healthValue2 - healthValue1,
      };

      return {
        categories,
        comments,
        dataGraph1,
        dataGraph2,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [observationSnaps, getDataByObservationSnaps]);

  return { data, isError, isLoading };
}
export default useGetData;
