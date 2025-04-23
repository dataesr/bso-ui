import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS, IS_TEST } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getObservationLabel,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';

function useGetData(beforeLastObservationSnap, observationSnap, domain) {
  const disciplineField = domain === 'health' ? 'bsso_classification.field' : 'bso_classification';
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const yellowMedium125 = getCSSValue('--yellow-medium-125');

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions({
        key: 'disciplinesVoies',
        domain,
        parameters: [
          lastObservationSnap,
          disciplineField,
          `oa_details.${observationSnap}.oa_host_type.keyword`,
        ],
        objectType: ['publications'],
      });
      // const res = await Axios.post(ES_API_URL, query, HEADERS);
      // const res = graphData;

      /* eslint-disable no-underscore-dangle */
      // 1回目のクエリ 最新のcalc_dateを取得
      const latestDateRes = await Axios.post(ES_API_URL, {
        size: 1,
        _source: ['calc_date'],
        sort: [
          {
            calc_date: {
              order: 'desc',
            },
          },
        ],
      });

      // 1回目のクエリで得たcalc_dateをlatestCalcDateに代入
      /* eslint-disable no-underscore-dangle */
      const latestCalcDate = latestDateRes.data.hits.hits[0]._source.calc_date;

      // calc_dateの1年前の年数をgraphYearDataに代入
      const graphYearData = (parseInt(latestCalcDate.substring(0, 4), 10) - 1);

      // 2回目のクエリ 最新のcalc_dateのデータを取得
      const preRes = await Axios.post(ES_API_URL, {
        size: 10000,
        query: {
          bool: {
            must: [
              { term: { calc_date: latestCalcDate } },
              { term: { data_type: 'disciplines.voies-ouverture.get-data' } },
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
      });

      let res;
      if (lastObservationSnap) {
      // データ成形処理
      res = { data: { aggregations: { by_discipline: { buckets: [] } } } };
      const bucketsObject = {};

      // データを集計
      /* eslint-disable no-underscore-dangle */
      preRes.data.hits.hits.forEach((hit) => {
        const { field } = hit._source;
        hit._source.data.forEach((item) => {
          const year = item.publication_year;
          if (year === graphYearData) {
            if (!bucketsObject[field]) {
              bucketsObject[field] = {
                key: field,
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
            bucketsObject[field].doc_count += item.closed + item.publisher + item.repository + item['publisher;repository'];
            bucketsObject[field].by_oa_host_type.buckets.find((b) => b.key === 'closed').doc_count += item.closed;
            bucketsObject[field].by_oa_host_type.buckets.find((b) => b.key === 'publisher').doc_count += item.publisher;
            bucketsObject[field].by_oa_host_type.buckets.find((b) => b.key === 'repository').doc_count += item.repository;
            bucketsObject[field].by_oa_host_type.buckets.find((b) => b.key === 'publisher;repository').doc_count += item['publisher;repository'];
          }
        });
      });
      /* eslint-enable no-underscore-dangle */

      // 集計したデータを配列に変換し、年順にソート
      res.data.aggregations.by_discipline.buckets = Object.values(bucketsObject).sort((a, b) => a.key - b.key);
    } else {
      res = {
        data: {
          aggregations: {
            by_discipline: {
              buckets: [],
            },
          },
        },
      };
    }

      if (IS_TEST) {
        console.log('voies-ouverture_preRes:', preRes); // eslint-disable-line no-console
        console.log('voies-ouverture_res:', res); // eslint-disable-line no-console
      }

      let data = res.data.aggregations.by_discipline.buckets;

      const categories = []; // Elements d'abscisse
      const categoriesComments = []; // Elements d'abscisse
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
      data = data
        .filter((item) => item.key !== 'unknown')
        .map((item) => ({
          by_oa_host_type: item.by_oa_host_type,
          key: item.key,
          total: item.doc_count,
          closed:
            item.by_oa_host_type.buckets.find((item2) => item2.key === 'closed')
              ?.doc_count || 0,
          repository:
            item.by_oa_host_type.buckets.find(
              (item2) => item2.key === 'repository',
            )?.doc_count || 0,
          publisher:
            item.by_oa_host_type.buckets.find(
              (item2) => item2.key === 'publisher',
            )?.doc_count || 0,
          publisherRepo:
            item.by_oa_host_type.buckets.find(
              (item2) => item2.key === 'publisher;repository',
            )?.doc_count || 0,
        }));
      data.forEach((item, catIndex) => {
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
        const nameClean = item.key ? item.key.replace(/\n/g, '').replace('  ', ' ') : 'unknown';
        categories.push({
          key: nameClean,
          staff: totalCurrent,
          percent: (oaCurrent / totalCurrent) * 100,
        });
        categoriesComments.push(
          capitalize(intl.formatMessage({ id: `app.discipline.${nameClean}` })),
        );
        closed.push({
          y: (closedCurrent / totalCurrent) * 100,
          y_abs: closedCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
        });
        oa.push({
          y: (oaCurrent / totalCurrent) * 100,
          y_abs: oaCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
        });
        repository.push({
          y: (repositoryCurrent / totalCurrent) * 100,
          y_abs: repositoryCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
          oaRate: (oaCurrent / totalCurrent) * 100,
        });
        publisher.push({
          y: (publisherCurrent / totalCurrent) * 100,
          y_abs: publisherCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
          oaRate: (oaCurrent / totalCurrent) * 100,
        });
        publisherRepository.push({
          y: (publisherRepositoryCurrent / totalCurrent) * 100,
          y_abs: publisherRepositoryCurrent,
          y_tot: totalCurrent,
          x: catIndex,
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: categoriesComments[catIndex],
          bsoDomain,
          oaRate: (oaCurrent / totalCurrent) * 100,
        });
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
          dataLabels: {
            ...noOutline,
            style: { color: getCSSValue('--g-800') },
          },
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.type-hebergement.publisher-repository',
            }),
          ),
          data: publisherRepository,
          color: getCSSValue('--green-light-100'),
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

      const discipline = dataGraph?.[0]?.data?.[0]?.discipline.toLowerCase() || '';
      const publisherRate = dataGraph?.[0]?.data?.[0]?.y.toFixed(0) || 0;
      const publisherRepositoryRate = dataGraph?.[1]?.data?.[0]?.y.toFixed(0) || 0;
      const repositoryRate = dataGraph?.[2]?.data?.[0]?.y.toFixed(0) || 0;

      const comments = {
        discipline,
        observationYear: getObservationLabel(lastObservationSnap, intl),
        publicationYear: getObservationLabel(beforeLastObservationSnap, intl),
        publisherRate,
        publisherRepositoryRate,
        repositoryRate,
      };

      return {
        categories,
        comments,
        dataGraph,
      };
    },
    [
      beforeLastObservationSnap,
      bsoDomain,
      disciplineField,
      domain,
      intl,
      yellowMedium125,
      observationSnap,
    ],
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
