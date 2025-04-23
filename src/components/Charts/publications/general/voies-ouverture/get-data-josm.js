import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

// import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { ES_API_URL, IS_TEST } from '../../../../../config/config';
// import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getObservationLabel,
} from '../../../../../utils/helpers';

function useGetData(beforeLastObservationSnap, observationSnap, domain) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      // const query = getFetchOptions({
      //   key: 'oaHostType',
      //   domain,
      //   parameters: [
      //     lastObservationSnap,
      //     `oa_details.${lastObservationSnap}.oa_host_type.keyword`,
      //     'year',
      //   ],
      //   objectType: ['publications'],
      // });
      // const res = await Axios.post(ES_API_URL, query, HEADERS);
      // const data = res.data.aggregations.by_publication_year.buckets.sort(
      //   (a, b) => a.key - b.key,
      // );
      // const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

      // const res = graphData;
      // const data = (res?.data?.aggregations?.by_publication_year?.buckets && Array.isArray(res.data.aggregations.by_publication_year.buckets))
      // ? res.data.aggregations.by_publication_year.buckets.sort((a, b) => a.key - b.key)
      // : [];

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

      // latestCalcDateを取得
      /* eslint-disable no-underscore-dangle */
      const latestCalcDate = latestDateRes.data.hits.hits[0]._source.calc_date;

      // 2回目のクエリ 最新のcalc_dateのデータを取得
      const preRes = await Axios.post(
        ES_API_URL,
        {
          query: {
            bool: {
              must: [
                { term: { calc_date: latestCalcDate } },
                { term: { data_type: 'general.voies-ouverture.get-data' } },
              ],
            },
          },
        },
      );

      let res;
      if (lastObservationSnap) {
      // ここに変更を記述
      res = { data: { aggregations: { by_publication_year: { buckets: [] } } } };
      const bucketsObject = {};

      // データを集計
      /* eslint-disable no-underscore-dangle */
      preRes.data.hits.hits.forEach((hit) => {
        hit._source.data.forEach((item) => {
          const year = item.publication_year;
          if (!bucketsObject[year]) {
            bucketsObject[year] = {
              key: year,
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
          bucketsObject[year].doc_count += item.closed + item.publisher + item.repository + item['publisher;repository'];
          bucketsObject[year].by_oa_host_type.buckets.find((b) => b.key === 'closed').doc_count += item.closed;
          bucketsObject[year].by_oa_host_type.buckets.find((b) => b.key === 'publisher').doc_count += item.publisher;
          bucketsObject[year].by_oa_host_type.buckets.find((b) => b.key === 'repository').doc_count += item.repository;
          bucketsObject[year].by_oa_host_type.buckets.find((b) => b.key === 'publisher;repository').doc_count += item['publisher;repository'];
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
        console.log('voies-ouverture_preRes:', preRes); // eslint-disable-line no-console
        console.log('voies-ouverture_res:', res); // eslint-disable-line no-console
      }

      const data = res.data.aggregations.by_publication_year.buckets.sort(
        (a, b) => a.key - b.key,
      );
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

      const categories = [];
      const repository = [];
      const publisher = [];
      const publisherRepository = [];
      const oa = [];
      const closed = [];
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      data
        .filter(
          (el) => el.key > 2012
            && lastObservationSnap.length
            && parseInt(el.key, 10)
              < parseInt(lastObservationSnap?.substring(0, 4), 10),
        )
        .forEach((el) => {
          categories.push(el.key);

          const closedCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 'closed')
            ?.doc_count || 0;
          const repositoryCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 'repository')
            ?.doc_count || 0;
          const publisherCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 'publisher')
            ?.doc_count || 0;
          const publisherRepositoryCurrent = el.by_oa_host_type.buckets.find(
            (item) => item.key === 'publisher;repository',
          )?.doc_count || 0;
          const totalCurrent = repositoryCurrent
            + publisherCurrent
            + publisherRepositoryCurrent
            + closedCurrent;
          const oaCurrent = repositoryCurrent + publisherCurrent + publisherRepositoryCurrent;
          closed.push({
            y: (100 * closedCurrent) / totalCurrent,
            y_abs: closedCurrent,
            y_tot: totalCurrent,
            y_oa: oaCurrent,
            x: el.key,
            bsoDomain,
          });
          oa.push({
            y: (100 * oaCurrent) / totalCurrent,
            y_abs: oaCurrent,
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x: el.key,
            bsoDomain,
          });
          repository.push({
            y: (100 * repositoryCurrent) / totalCurrent,
            y_abs: repositoryCurrent,
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x: el.key,
            bsoDomain,
          });
          publisher.push({
            y: (100 * publisherCurrent) / totalCurrent,
            y_oa: oaCurrent,
            y_abs: publisherCurrent,
            y_tot: totalCurrent,
            x: el.key,
            bsoDomain,
          });
          publisherRepository.push({
            y: (100 * publisherRepositoryCurrent) / totalCurrent,
            y_oa: oaCurrent,
            y_abs: publisherRepositoryCurrent,
            y_tot: totalCurrent,
            x: el.key,
            bsoDomain,
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
          color: getCSSValue('--yellow-medium-125'),
          dataLabels: noOutline,
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

      const dataGraph3 = [
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.open' }),
          id: 'oa',
          value: oa[oa.length - 1]?.y_abs,
          percentage: oa[oa.length - 1]?.y,
          publicationDate: categories[categories.length - 1],
          color: getCSSValue('--yellow-medium-125'),
          dataLabels: noOutline,
          bsoDomain,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.publisher' }),
          value: publisher[publisher.length - 1]?.y_abs,
          parent: 'oa',
          percentage: publisher[publisher.length - 1]?.y,
          publicationDate: categories[categories.length - 1],
          color: getCSSValue('--yellow-medium-125'),
          dataLabels: noOutline,
          bsoDomain,
        },
        {
          name: intl.formatMessage({
            id: 'app.type-hebergement.publisher-repository',
          }),
          value: publisherRepository[publisherRepository.length - 1]?.y_abs,
          parent: 'oa',
          percentage: publisherRepository[publisherRepository.length - 1]?.y,
          publicationDate: categories[categories.length - 1],
          color: getCSSValue('--green-light-100'),
          dataLabels: noOutline,
          bsoDomain,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.repository' }),
          parent: 'oa',
          value: repository[repository.length - 1]?.y_abs,
          percentage: repository[repository.length - 1]?.y,
          publicationDate: categories[categories.length - 1],
          color: getCSSValue('--green-medium-125'),
          dataLabels: noOutline,
          bsoDomain,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.closed' }),
          id: 'closed',
          value: closed[closed.length - 1]?.y_abs,
          percentage: closed[closed.length - 1]?.y,
          publicationDate: categories[categories.length - 1],
          color: getCSSValue('--blue-soft-175'),
          dataLabels: noOutline,
          bsoDomain,
        },
      ];

      const comments = {
        beforeLastObservationSnap: getObservationLabel(
          beforeLastObservationSnap,
          intl,
        ),
        closed: closed[closed.length - 1]?.y.toFixed(0),
        lastObservationSnap: getObservationLabel(lastObservationSnap, intl),
        oa: oa[oa.length - 1]?.y.toFixed(0),
        publisher: publisher[publisher.length - 1]?.y.toFixed(0),
        publisherRepository:
          publisherRepository[publisherRepository.length - 1]?.y.toFixed(0),
        repository: repository[repository.length - 1]?.y.toFixed(0),
      };

      return {
        categories,
        comments,
        dataGraph,
        dataGraph3,
      };
    },
    [beforeLastObservationSnap, domain, intl],
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
