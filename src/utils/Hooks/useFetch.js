import axios from 'axios';
import { useRef, useState } from 'react';

import { ES_API_URL, IS_TEST } from '../../config/config';

export default function useFetch({ method, options, url }) {
  const isMounted = useRef(true);
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  return {
    response,
    loading,
    isMounted,
    error,
    reset: () => setResponse(),
    fetch: async (params = {}, lastObservationSnap) => {
      /* eslint-enable arrow-parens, no-confusing-arrow */
      const { options: fetchOptions, reload } = params;

      // 最新のcalc_dateを取得
      const latestDateRes = await axios.post(ES_API_URL, {
        size: 0,
        aggs: {
          unique_calc_dates: {
            terms: {
              field: 'calc_date',
              size: 10000,
            },
          },
        },
        query: {
          bool: {
            filter: [
              { term: { data_type: 'general.dynamique-ouverture.get-data' } },
            ],
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
        const yearDates = yearGroups[year];
        const lastDate = yearDates.reduce((latest, current) => (current > latest ? current : latest));
        lastDateOfYear.push(lastDate);
      });

      // 最新のcalc_dateを取得
      const lastDate = lastDateOfYear[0];

      setLoading(true);
      isMounted.current = true;
      if (!response || reload) {
        setLoading(true);
      }
      // 年ごとの出版物を取得する場合の処理
      if (params?.options?.aggs?.by_publication_year) {
        /* eslint-disable no-underscore-dangle */
        const preRes = await axios.post(ES_API_URL,
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
          });

        preRes.data.hits.hits.sort((a, b) => b._source.calc_date.localeCompare(a._source.calc_date));

        // データ成形処理
        const res = preRes.data.hits.hits.map((hit) => {
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
        setResponse(res[0].data);
        setLoading(false);
      } else if (options?.aggs) {
        const res = {};
        if (options.aggs.publication_count) {
          // publicationsに表示する値を取得
          const preRes = await axios.post(ES_API_URL,
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
              aggs: {
                data_nested: {
                  nested: {
                    path: 'data',
                  },
                  aggs: {
                    total_sum: {
                      sum: {
                        field: 'data.total',
                      },
                    },
                  },
                },
              },
            });
          res.aggregations = {
            // 【TODO】取得した値を反映
            publication_count: { value: preRes.data.aggregations.data_nested.total_sum.value },
          };
        } else if (options.aggs.journal_count) {
          // journalsに表示する値を取得
          // const preRes = await axios.post(ES_API_URL,
          //   {
          //     // 【TODO】データ取得について見当・実装
          //   },
          // );
          res.aggregations = {
            // 【TODO】取得した値を反映
            journal_count: { value: 1000 },
          };
        } else if (options.aggs.publisher_count) {
          // publishers and platformsに表示する値を取得
          const preRes = await axios.post(ES_API_URL,
            {
              size: 0,
              query: {
                bool: {
                  filter: [
                    { terms: { calc_date: lastDateOfYear } },
                    { term: { data_type: 'editeurs.dynamique-ouverture.get-data' } },
                  ],
                },
              },
            });
          res.aggregations = {
            // 【TODO】取得した値を反映
            publisher_count: { value: preRes.data.hits.total.value },
          };
        } else if (options.aggs.repositories_count) {
          // open archivesに表示する値を取得
          // const preRes = await axios.post(ES_API_URL,
          //   {
          //     // 【TODO】データ取得について見当・実装
          //   },
          // );
          res.aggregations = {
            // 【TODO】取得した値を反映
            repositories_count: { value: 2000 },
          };
        } else if (options.aggs.observation_dates_count) {
          // observation datesに表示する値を取得
          const observationDate = lastDateOfYear.length;
          res.aggregations = {
            // 【TODO】取得した値を反映
            observation_dates_count: { value: observationDate },
          };
        }
        if (res) {
          setResponse(res);
          setLoading(false);
        }
      } else {
        /* eslint-disable no-underscore-dangle */
        /* eslint-disable arrow-parens */
        /* eslint-disable camelcase */
        const preRes = await axios.post(ES_API_URL,
          {
            size: 10000,
            query: {
              bool: {
                must: [
                  { term: { calc_date: lastDate } },
                ],
                filter: [
                  {
                    terms: {
                      data_type: [
                        'general.dynamique-ouverture.get-data',
                        'editeurs.type-ouverture.get-data',
                        'general.genres-ouverture.get-data-proportion',
                        'archives.dynamique-ouverture.get-data',
                        'general.voies-ouverture.get-data',
                      ],
                    },
                  },
                ],
              },
            },
          });

        // 前年を取得
        const targetYear = lastObservationSnap
          ? parseInt(lastObservationSnap, 10) - 1
          : new Date().getFullYear() - 1;

        // データ整形処理
        const res = {};
        res.aggregations = {
          by_is_oa: { buckets: [] },
          by_oa_colors: { buckets: [] },
          by_genre: { buckets: [] },
          by_repositories: { buckets: [] },
        };

        preRes.data.hits.hits.forEach(hit => {
          if (hit._source.data_type === 'general.dynamique-ouverture.get-data') {
            const oa_data = hit._source.data.find(item => item.publication_year === targetYear);
            const oa_buckets_false = { key: 0, key_as_string: 'false', doc_count: oa_data.total - oa_data.oa };
            const oa_buckets_true = { key: 1, key_as_string: 'true', doc_count: oa_data.oa };
            res.aggregations.by_is_oa.buckets.push(oa_buckets_true);
            res.aggregations.by_is_oa.buckets.push(oa_buckets_false);
          }
          if (hit._source.data_type === 'editeurs.type-ouverture.get-data') {
            const color_data = hit._source.data.find(item => item.publication_year === targetYear);
            const color_buckets = {
              key: 'green',
              doc_count: color_data.gold + color_data.hybrid + color_data.other,
            };
            res.aggregations.by_oa_colors.buckets.push(color_buckets);
          }
          if (hit._source.data_type === 'general.genres-ouverture.get-data-proportion' && hit._source.type === 'journal-article') {
            const genre_data_article = hit._source.data.find(item => item.publication_year === targetYear);
            const genre_buckets_article = {
              key: 'journal-article',
              doc_count: genre_data_article.total,
              by_is_oa: {
                buckets: [
                  { key: 0, key_as_string: 'false', doc_count: genre_data_article.total - genre_data_article.oa },
                  { key: 1, key_as_string: 'true', doc_count: genre_data_article.oa },
                ],
              },
            };
            res.aggregations.by_genre.buckets.push(genre_buckets_article);
          }
          if (hit._source.data_type === 'general.genres-ouverture.get-data-proportion' && hit._source.type === 'book') {
            const genre_data_book = hit._source.data.find(item => item.publication_year === targetYear);
            const genre_buckets_book = {
              key: 'book',
              doc_count: genre_data_book.total,
              by_is_oa: {
                buckets: [
                  { key: 0, key_as_string: 'false', doc_count: genre_data_book.total - genre_data_book.oa },
                  { key: 1, key_as_string: 'true', doc_count: genre_data_book.oa },
                ],
              },
            };
            res.aggregations.by_genre.buckets.push(genre_buckets_book);
          }
          if (hit._source.data_type === 'general.voies-ouverture.get-data') {
            const item = hit._source.data.find(it => it.publication_year === targetYear);
            if (item) {
              // repository (リポジトリのみ) + publisher;repository (出版社とリポジトリ両方)
              const repoOnly = Number(item.repository ?? 0);
              const pubRepo = Number(item['publisher;repository'] ?? 0);
              const repoTotalForGraph = repoOnly + pubRepo;

              const { buckets } = res.aggregations.by_repositories;
              const existingIdx = buckets.findIndex((b) => b.key === 'HAL');

              if (existingIdx >= 0) {
                buckets[existingIdx].repo_total = repoTotalForGraph;
              } else {
                buckets.push({
                  key: 'HAL',
                  doc_count: 0,
                  total: 0,
                  repo_total: repoTotalForGraph,
                });
              }
            }
          }
          if (hit._source.data_type === 'archives.dynamique-ouverture.get-data') {
            const row = Array.isArray(hit._source.data)
              ? hit._source.data.find((it) => it.publication_year === targetYear)
              : undefined;

            const oa = Number(row?.oa ?? 0);
            const { buckets } = res.aggregations.by_repositories;

            const existingIdx = buckets.findIndex((b) => b.key === 'HAL');
            const prev = existingIdx >= 0 ? buckets[existingIdx] : { key: 'HAL', doc_count: 0, total: 0, repo_total: 0 };

            const { repository: repoName = '' } = hit._source;
            const nextDocCount = prev.doc_count + (repoName === 'ja-repository' ? oa : 0);

            const repo_buckets = {
              key: 'HAL',
              doc_count: nextDocCount,
              total: prev.total + oa,
              repo_total: prev.repo_total,
            };
            if (existingIdx >= 0) {
              buckets.splice(existingIdx, 1);
            }
            res.aggregations.by_repositories.buckets.push(repo_buckets);
          }
        });

        setResponse(res);
        setLoading(false);

        // 日本版では以下のfetch処理は行わないためコメントアウト
        // axios[method](url, fetchOptions || options, HEADERS)
        //   .then((res) => {
        //     if (res) {
        //       setResponse(res.data);
        //     }
        //     setLoading(false);
        //   })
        //   .catch((err) => {
        //     setError({ error: true, message: err });
        //   });
      }
    },
  };
}
