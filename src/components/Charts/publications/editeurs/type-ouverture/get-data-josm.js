import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

// import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { ES_API_URL, IS_TEST } from '../../../../../config/config';
// import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, getCSSValue } from '../../../../../utils/helpers';

function useGetData(observationSnap, domain) {
  const [allData, setAllData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

  async function getDataGraph() {
    if (!observationSnap) {
      return {};
    }
    // const query = getFetchOptions({
    //   key: 'publishersTypesHisto',
    //   domain,
    //   parameters: [observationSnap],
    //   objectType: ['publications'],
    // });

    // const res = await Axios.post(ES_API_URL, query, HEADERS);

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
      query: {
        term: {
          data_type: 'editeurs.type-ouverture.get-data',
        },
      },
    });

    // 1回目のクエリで得たcalc_dateをlatestCalcDateに代入
    /* eslint-disable no-underscore-dangle */
    const latestCalcDate = latestDateRes.data.hits.hits[0]._source.calc_date;

    // 2回目のクエリ 最新のcalc_dateのデータを取得
    const preRes = await Axios.post(ES_API_URL, {
      query: {
        bool: {
          must: [
            { term: { calc_date: latestCalcDate } },
            { term: { data_type: 'editeurs.type-ouverture.get-data' } },
          ],
        },
      },
    });

    let res;
    if (observationSnap) {
    // 成形処理
    res = {
      data: {
        aggregations: {
          by_year: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: preRes.data.hits.hits[0]._source.data.map((item) => ({
              key: item.publication_year,
              doc_count: Object.values(item).reduce((sum, value) => sum + value, 0) - item.publication_year,
              by_oa_colors: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: Object.keys(item)
                  .filter((key) => key !== 'publication_year')
                  .map((key) => ({
                    key,
                    doc_count: item[key],
                  })),
              },
            })),
          },
        },
      },
    };
  } else {
    res = [];
  }
    if (IS_TEST) {
      console.log('type-ouverture_preRes:', preRes); // eslint-disable-line no-console
      console.log('type-ouverture_res:', res); // eslint-disable-line no-console
    }

    const data = res.data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key >= 2013
          && parseInt(el.key, 10)
            < parseInt(String(observationSnap).substring(0, 4), 10),
      );

    const categories = data.map((dataYear) => dataYear.key);
    const goldData = [];
    const hybridData = [];
    const diamondData = [];
    const otherData = [];
    data.forEach((dataYear) => {
      const goldPublicationsCount = parseInt(
        dataYear.by_oa_colors.buckets.find((item) => item.key === 'gold')
          ?.doc_count || 0,
        10,
      );
      const hybridPublicationsCount = parseInt(
        dataYear.by_oa_colors.buckets.find((el) => el.key === 'hybrid')
          ?.doc_count || 0,
        10,
      );
      const diamondPublicationsCount = parseInt(
        dataYear.by_oa_colors.buckets.find((el) => el.key === 'diamond')
          ?.doc_count || 0,
        10,
      );
      const otherPublicationsCount = parseInt(
        dataYear.by_oa_colors.buckets.find((el) => el.key === 'other')
          ?.doc_count || 0,
        10,
      );
      goldData.push({
        publicationDate: dataYear.key,
        bsoDomain,
        y_abs: goldPublicationsCount,
        y_tot: dataYear?.doc_count || 0,
        y: (goldPublicationsCount / dataYear?.doc_count || 0) * 100,
      });
      hybridData.push({
        bsoDomain,
        publicationDate: dataYear.key,
        y_abs: hybridPublicationsCount,
        y_tot: dataYear?.doc_count || 0,
        y: (hybridPublicationsCount / dataYear?.doc_count || 0) * 100,
      });
      diamondData.push({
        bsoDomain,
        publicationDate: dataYear.key,
        y_abs: diamondPublicationsCount,
        y_tot: dataYear?.doc_count || 0,
        y: (diamondPublicationsCount / dataYear?.doc_count || 0) * 100,
      });
      otherData.push({
        bsoDomain,
        publicationDate: dataYear.key,
        y_abs: otherPublicationsCount,
        y_tot: dataYear?.doc_count || 0,
        y: (otherPublicationsCount / dataYear?.doc_count || 0) * 100,
      });
    });
    const dataGraph = [
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.other',
          }),
        ),
        data: otherData,
        color: getCSSValue('--orange-soft-100'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.hybrid',
          }),
        ),
        data: hybridData,
        color: getCSSValue('--hybrid'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.gold',
          }),
        ),
        data: goldData,
        color: getCSSValue('--yellow-medium-100'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.diamond',
          }),
        ),
        data: diamondData,
        color: getCSSValue('--diamond'),
      },
    ];

    const dataGraphTreemap = [
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.gold',
          }),
        ),
        publicationDate: goldData[goldData.length - 1].publicationDate,
        bsoDomain,
        y_tot: goldData[goldData.length - 1].y_tot,
        y_abs: goldData[goldData.length - 1].y_abs,
        value: goldData[goldData.length - 1].y,
        color: getCSSValue('--yellow-medium-100'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.other',
          }),
        ),
        bsoDomain,
        publicationDate: otherData[otherData.length - 1].publicationDate,
        y_tot: otherData[otherData.length - 1].y_tot,
        y_abs: otherData[otherData.length - 1].y_abs,
        value: otherData[otherData.length - 1].y,
        color: getCSSValue('--orange-soft-100'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.hybrid',
          }),
        ),
        bsoDomain,
        publicationDate: hybridData[hybridData.length - 1].publicationDate,
        y_tot: hybridData[hybridData.length - 1].y_tot,
        y_abs: hybridData[hybridData.length - 1].y_abs,
        value: hybridData[hybridData.length - 1].y,
        color: getCSSValue('--hybrid'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.diamond',
          }),
        ),
        bsoDomain,
        publicationDate: diamondData[diamondData.length - 1].publicationDate,
        y_tot: diamondData[diamondData.length - 1].y_tot,
        y_abs: diamondData[diamondData.length - 1].y_abs,
        value: diamondData[diamondData.length - 1].y,
        color: getCSSValue('--diamond'),
      },
    ];

    const year1 = diamondData[diamondData.length - 3].publicationDate;
    const diamond1 = diamondData[diamondData.length - 3]?.y.toFixed(0);
    const year2 = diamondData[diamondData.length - 2].publicationDate;
    const diamond2 = diamondData[diamondData.length - 2]?.y.toFixed(0);
    const year3 = diamondData[diamondData.length - 1].publicationDate;
    const diamond3 = diamondData[diamondData.length - 1]?.y.toFixed(0);
    const comments = {
      year1,
      year2,
      year3,
      diamond1,
      diamond2,
      diamond3,
    };

    return { categories, dataGraph, dataGraphTreemap, comments };
  }

  useEffect(() => {
    async function getData() {
      try {
        const obj = await getDataGraph();
        setAllData(obj);
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
