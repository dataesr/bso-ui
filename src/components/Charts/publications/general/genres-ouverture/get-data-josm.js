import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

// import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { ES_API_URL, IS_TEST } from '../../../../../config/config';
// import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  cleanNumber,
  getCSSValue,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';

function useGetData(observationSnap, domain) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const yellowMedium125 = getCSSValue('--yellow-medium-125');
  const greenLight100 = getCSSValue('--green-light-100');

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const publicationYear = getPublicationYearFromObservationSnap(lastObservationSnap);
      // const query = getFetchOptions({
      //   domain,
      //   key: 'oaHostType',
      //   objectType: ['publications'],
      //   parameters: [
      //     lastObservationSnap,
      //     `oa_details.${lastObservationSnap}.oa_host_type.keyword`,
      //     'genre.keyword',
      //     publicationYear,
      //   ],

      // 1回目のクエリ 最新のcalc_dateを取得
      const latestDateRes = await Axios.post(
        ES_API_URL, {
          size: 1,
          _source: ['calc_date'],
          sort: [
            {
              calc_date: {
                order: 'desc',
              },
            },
          ],
        },
      );

      // 1回目のクエリで得たcalc_dateをlatestCalcDateに代入
      /* eslint-disable no-underscore-dangle */
      const latestCalcDate = latestDateRes.data.hits.hits[0]._source.calc_date;

      // calc_dateの1年前の年数をgraphYearDataに代入
      const graphYearData = (parseInt(latestCalcDate.substring(0, 4), 10) - 1);

      // 2回目のクエリ 最新のcalc_dateのデータを取得
      const preRes = await Axios.post(
        ES_API_URL,
        {
          query: {
            bool: {
              must: [
                { term: { calc_date: latestCalcDate } },
                { term: { data_type: 'general.genres-ouverture.get-data' } },
                {
                  nested: {
                    path: 'data',
                    query: {
                      term: { 'data.publication_year': graphYearData },
                    },
                  },
                },
              ],
            },
          },
        },
      );
      // const res = await Axios.post(ES_API_URL, query, HEADERS);
      let res;
      if (lastObservationSnap) {
      // ここに変更を記述
      res = { data: { aggregations: { by_publication_year: { buckets: [] } } } };
      const bucketsObject = {};

      // データを集計
      /* eslint-disable no-underscore-dangle */
      preRes.data.hits.hits.forEach((hit) => {
        const { type } = hit._source;
        hit._source.data.forEach((item) => {
          const year = item.publication_year;
          if (year === graphYearData) {
            if (!bucketsObject[type]) {
              bucketsObject[type] = {
                key: type === 'proceedings-article' ? 'proceedings' : type,
                doc_count: 0,
                by_oa_host_type: {
                  doc_count_error_upper_bound: 0,
                  sum_other_doc_count: 0,
                  buckets: [
                    { key: 'closed', doc_count: 0 },
                    { key: 'publisher', doc_count: 0 },
                    { key: 'repository', doc_count: 0 },
                    { key: 'publisher;repository', doc_count: 0 },
                    { key: 'unknown', doc_count: 0 },
                    { key: 'N/A', doc_count: 0 },
                  ],
                },
              };
            }
            bucketsObject[type].doc_count += item.closed + item.publisher + item.repository + item['publisher;repository'];
            bucketsObject[type].by_oa_host_type.buckets.find((b) => b.key === 'closed').doc_count += item.closed;
            bucketsObject[type].by_oa_host_type.buckets.find((b) => b.key === 'publisher').doc_count += item.publisher;
            bucketsObject[type].by_oa_host_type.buckets.find((b) => b.key === 'repository').doc_count += item.repository;
            bucketsObject[type].by_oa_host_type.buckets.find((b) => b.key === 'publisher;repository').doc_count += item['publisher;repository'];
          }
        });
      });
      /* eslint-enable no-underscore-dangle */

      // 集計したデータを配列に変換し、年順にソート
      res.data.aggregations.by_publication_year.buckets = Object.values(bucketsObject).sort((a, b) => a.key - b.key);
    } else {
      res = {
        data: {
          aggregations: {
            by_publication_year: {
              buckets: [],
            },
          },
        },
      };
    }

      if (IS_TEST) {
        console.log('genres-ouverture_preRes:', preRes); // eslint-disable-line no-console
        console.log('genres-ouverture_res:', res); // eslint-disable-line no-console
      }

      const data = res.data.aggregations.by_publication_year.buckets;
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

      // Tri pour avoir les années dans l'ordre d'affichage du graphe
      data.sort((a, b) => a.key - b.key);
      const categories = []; // Elements d'abscisse
      const repository = []; // archive ouverte
      const publisher = []; // éditeur
      const publisherRepository = []; // les 2
      const oa = []; // oa
      const closed = []; // closed
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      const newData = [];
      [
        'journal-article',
        'proceedings',
        'book-chapter',
        'book',
        'preprint',
        'dataset',
        'other',
      ].forEach((item) => {
        const currentElem = data.filter((item2) => item2.key === item);
        if (currentElem.length === 1) {
          newData.push(currentElem[0]);
        }
      });
      newData
        .filter((item) => item.doc_count >= 1)
        .forEach((item) => {
          const closedCurrent = item.by_oa_host_type.buckets.find((item2) => item2.key === 'closed')
            ?.doc_count || 0;
          const repositoryCurrent = item.by_oa_host_type.buckets.find(
            (item2) => item2.key === 'repository',
          )?.doc_count || 0;
          const publisherCurrent = item.by_oa_host_type.buckets.find(
            (item2) => item2.key === 'publisher',
          )?.doc_count || 0;
          const publisherRepositoryCurrent = item.by_oa_host_type.buckets.find(
            (item2) => item2.key === 'publisher;repository',
          )?.doc_count || 0;
          const totalCurrent = repositoryCurrent
            + publisherCurrent
            + publisherRepositoryCurrent
            + closedCurrent;
          const oaCurrent = repositoryCurrent + publisherCurrent + publisherRepositoryCurrent;
          closed.push({
            y: (closedCurrent / totalCurrent) * 100,
            y_abs: closedCurrent,
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x_val: intl.formatMessage({
              id: `app.publication-genre.${item.key}`,
            }),
            bsoDomain,
          });
          oa.push({
            y: (oaCurrent / totalCurrent) * 100,
            y_abs: oaCurrent,
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x_val: intl.formatMessage({
              id: `app.publication-genre.${item.key}`,
            }),
            bsoDomain,
          });
          repository.push({
            y: (repositoryCurrent / totalCurrent) * 100,
            y_abs: repositoryCurrent,
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x_val: intl.formatMessage({
              id: `app.publication-genre.${item.key}`,
            }),
            bsoDomain,
          });
          publisher.push({
            y: (publisherCurrent / totalCurrent) * 100,
            y_abs: publisherCurrent,
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x_val: intl.formatMessage({
              id: `app.publication-genre.${item.key}`,
            }),
            bsoDomain,
          });
          publisherRepository.push({
            y: (publisherRepositoryCurrent / totalCurrent) * 100,
            y_abs: publisherRepositoryCurrent,
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x_val: intl.formatMessage({
              id: `app.publication-genre.${item.key}`,
            }),
            bsoDomain,
          });
          categories.push(
            intl
              .formatMessage({ id: `app.publication-genre.${item.key}` })
              .concat('<br>(')
              .concat(intl.formatMessage({ id: 'app.effectif' }))
              .concat(' = ')
              .concat(cleanNumber(totalCurrent))
              .concat(')'),
          );
        });

      const dataGraph = [
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.type-hebergement.publisher',
            }),
          ),
          data: publisher,
          color: yellowMedium125,
          dataLabels: noOutline,
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.type-hebergement.publisher-repository',
            }),
          ),
          data: publisherRepository,
          color: greenLight100,
          dataLabels: noOutline,
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.type-hebergement.repository',
            }),
          ),
          data: repository,
          color: getCSSValue('--green-medium-125'),
          dataLabels: noOutline,
        },
      ];

      const articles = newData.find((item) => item.key === 'journal-article');
      const articlesTotal = articles?.doc_count || 0;
      const openArticles = articles?.by_oa_host_type.buckets?.filter((item) => ['repository', 'publisher', 'publisher;repository'].includes(
        item.key,
      )) || [];
      const openArticlesTotal = openArticles.reduce(
        (previousValue, currentValue) => previousValue + currentValue.doc_count,
        0,
      );
      const openArticlesPercentage = (
        (openArticlesTotal / articlesTotal)
        * 100
      ).toFixed(0);

      const booksChapters = newData.find((item) => item.key === 'book-chapter');
      const booksChaptersTotal = booksChapters?.doc_count || 0;
      const openBooksChapters = booksChapters?.by_oa_host_type.buckets?.filter((item) => ['repository', 'publisher', 'publisher;repository'].includes(
        item.key,
      )) || [];
      const openBooksChaptersTotal = openBooksChapters.reduce(
        (previousValue, currentValue) => previousValue + currentValue.doc_count,
        0,
      );
      const openBooksChaptersPercentage = (
        (openBooksChaptersTotal / booksChaptersTotal)
        * 100
      ).toFixed(0);

      const comments = {
        openArticlesPercentage,
        openBooksChaptersPercentage,
        publicationYear,
      };

      return {
        categories,
        comments,
        dataGraph,
      };
    },
    [domain, greenLight100, intl, yellowMedium125],
  );

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataForLastObservationSnap(observationSnap);
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
  }, [observationSnap]);

  return { allData, isError, isLoading };
}
export default useGetData;
