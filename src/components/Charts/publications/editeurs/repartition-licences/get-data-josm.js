import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

// import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { ES_API_URL, IS_TEST } from '../../../../../config/config';
// import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';

function useGetData(observationSnaps, isDetailed, needle = '*', domain = '') {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

  async function getDataByObservationSnaps(observationYears) {
    if (!observationYears || observationYears.length === 0) {
      return {};
    }
    // const queries = [];
    // const query = getFetchOptions({
    //   key: 'publishersLicence',
    //   domain,
    //   parameters: [observationYears[0], needle],
    //   objectType: ['publications'],
    // });
    const publicationDate = getPublicationYearFromObservationSnap(
      observationYears[0],
    );
    // queries.push(Axios.post(ES_API_URL, query, HEADERS));
    // const res = await Axios.all(queries);

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
          data_type: 'editeurs.repartition-licences.get-data',
        },
      },
    });

    // 1回目のクエリで得たcalc_dateをlatestCalcDateに代入
    /* eslint-disable no-underscore-dangle */
    const latestCalcDate = latestDateRes.data.hits.hits[0]._source.calc_date;

    // 取得したlatestCalcDateの最初の4文字をcalcYearとして設定
    const calcYear = parseInt(latestCalcDate.substring(0, 4), 10);

    // calcYearの1年前をtargetYearとして設定
    const targetYear = calcYear - 1;

    // 2回目のクエリ 最新のcalc_dateのデータを取得
    const query = {
      bool: {
        must: [
          { term: { calc_date: latestCalcDate } },
          { term: { data_type: 'editeurs.repartition-licences.get-data' } },
          {
            nested: {
              path: 'data',
              query: {
                bool: {
                  must: [
                    { term: { 'data.publication_year': targetYear } },
                  ],
                },
              },
            },
          },
        ],
      },
    };

    if (needle !== '*') {
      query.bool.must.push({ term: { publisher: needle } });
    }

    const sort = [
      {
        _script: {
          type: 'number',
          script: {
            source: `
              def sum = 0;
              for (item in params._source.data) {
                if (item.publication_year == params.targetYear) {
                  for (entry in item.entrySet()) {
                    if (entry.getKey() != 'publication_year' && entry.getValue() instanceof Number) {
                      sum += entry.getValue();
                    }
                  }
                }
              }
              return sum;
            `,
            params: {
              targetYear,
            },
          },
          order: 'desc',
        },
      },
    ];

    const preRes = await Axios.post(ES_API_URL, {
      size: 25,
      query,
      sort,
    });

    let res;
    if (observationYears) {
    // 成形処理
    res = [{
      data: {
        aggregations: {
          by_is_oa: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [],
          },
          by_publisher: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [],
          },
        },
      },
    }];

    const byIsOaBuckets = res[0].data.aggregations.by_is_oa.buckets;
    const byPublisherBuckets = res[0].data.aggregations.by_publisher.buckets;

    const licenceCounts = {};
    let totalDocCount = 0;

    preRes.data.hits.hits.forEach((hit) => {
      const { data: hitData, publisher } = hit._source;
      const filteredData = hitData.filter((item) => item.publication_year === targetYear);
      const docCount = filteredData.reduce((sum, item) => sum + Object.entries(item).reduce((a, [key, value]) => (key !== 'publication_year' ? a + value : a), 0), 0);
      totalDocCount += docCount;

      const byLicenceBuckets = Object.keys(filteredData[0])
        .filter((key) => key !== 'publication_year')
        .map((key) => {
          const count = filteredData.reduce((sum, item) => sum + (item[key] || 0), 0);
          if (!licenceCounts[key]) {
            licenceCounts[key] = 0;
          }
          licenceCounts[key] += count;
          return {
            key,
            doc_count: count,
          };
        });

      byPublisherBuckets.push({
        key: publisher,
        doc_count: docCount,
        by_licence: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: byLicenceBuckets,
        },
      });
    });

    const byLicenceBuckets = Object.keys(licenceCounts).map((key) => ({
      key: key !== 'no_license' ? key : 'no license',
      doc_count: licenceCounts[key],
    }));

    byIsOaBuckets.push({
      key: 1,
      key_as_string: 'true',
      doc_count: totalDocCount,
      by_licence: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: byLicenceBuckets,
      },
    });
    } else {
      res = [];
    }
    if (IS_TEST) {
      console.log('repartition-licences_preRes:', preRes); // eslint-disable-line no-console
      console.log('repartition-licences_res:', res); // eslint-disable-line no-console
    }

    const results = res[0].data.aggregations.by_is_oa.buckets?.[0]?.by_licence?.buckets ?? [];
    const nbTotal = res[0].data.aggregations.by_is_oa.buckets?.[0]?.doc_count ?? 0;
    const openLicenceNumber = results
      .filter((item) => item.key !== 'no license')
      .reduce((a, b) => a + b.doc_count, 0);
    const ccbyLicenceNumber = results.find((item) => item.key === 'cc-by')?.doc_count ?? 0;
    const openLicenceRate = (100 * openLicenceNumber) / nbTotal;
    const ccbyLicenceRate = (100 * ccbyLicenceNumber) / nbTotal;
    const dataGraphTreemap = [];
    if (isDetailed) {
      results.forEach((el) => {
        dataGraphTreemap.push({
          name: capitalize(
            intl.formatMessage({
              id: `app.licenses.${el.key}`,
            }),
          ),
          publisher:
            needle === '*'
              ? intl.formatMessage({ id: 'app.all-publishers' })
              : needle,
          value: el.doc_count,
          y_tot: nbTotal,
          bsoDomain,
          y_perc: (100 * el.doc_count) / nbTotal,
          publicationDate,
          color:
            el.key === 'no license'
              ? getCSSValue('--g-400')
              : getCSSValue('--acces-ouvert'),
        });
      });
    } else {
      dataGraphTreemap.push({
        name: capitalize(
          intl.formatMessage({
            id: 'app.licenses.open-license',
          }),
        ),
        publisher:
          needle === '*'
            ? intl.formatMessage({ id: 'app.all-publishers' })
            : needle,
        color: getCSSValue('--acces-ouvert'),
        value: openLicenceNumber,
        y_tot: nbTotal,
        bsoDomain,
        y_perc: openLicenceRate,
        publicationDate,
      });
      const noLicenceElem = results.find((el) => el.key === 'no license');
      const nbNoLicence = noLicenceElem ? noLicenceElem.doc_count : 0;
      dataGraphTreemap.push({
        name: capitalize(
          intl.formatMessage({
            id: 'app.licenses.no license',
          }),
        ),
        publisher:
          needle === '*'
            ? intl.formatMessage({ id: 'app.all-publishers' })
            : needle,
        color: getCSSValue('--g-400'),
        value: nbNoLicence,
        y_tot: nbTotal,
        bsoDomain,
        y_perc: (100 * nbNoLicence) / nbTotal,
        publicationDate,
      });
    }

    const openLicence = [];
    const noLicence = [];
    const categories = [];
    res[0].data.aggregations.by_publisher.buckets.forEach((elem) => {
      categories.push(elem.key);
      const noLicenceElem = elem.by_licence.buckets.find(
        (el) => el.key === 'no license',
      );
      noLicence.push({
        publisher: elem.key,
        bsoDomain,
        y_tot: elem.doc_count,
        y_abs: noLicenceElem ? noLicenceElem.doc_count : 0,
        y:
          (100 * (noLicenceElem ? noLicenceElem.doc_count : 0))
          / elem.doc_count,
        publicationDate,
      });
      openLicence.push({
        publisher: elem.key,
        bsoDomain,
        y_tot: elem.doc_count,
        y_abs: elem.by_licence.buckets
          .filter((el) => el.key !== 'no license')
          .reduce((a, b) => a + b.doc_count, 0),
        y:
          (100
            * elem.by_licence.buckets
              .filter((el) => el.key !== 'no license')
              .reduce((a, b) => a + b.doc_count, 0))
          / elem.doc_count,
        publicationDate,
      });
    });
    const dataGraphBar = [
      {
        name: capitalize(intl.formatMessage({ id: 'app.licenses.no license' })),
        data: noLicence,
        color: getCSSValue('--g-400'),
      },
      {
        name: capitalize(
          intl.formatMessage({ id: 'app.licenses.open-license' }),
        ),
        data: openLicence,
        color: getCSSValue('--acces-ouvert'),
      },
    ];

    const publisher = 'Elsevier';
    const openLicenseLabel = capitalize(
      intl.formatMessage({ id: 'app.licenses.open-license' }),
    );
    const comments = {
      openLicenceRate: openLicenceRate.toFixed(0),
      ccbyLicenceRate: ccbyLicenceRate.toFixed(0),
      publicationDate,
      publisher,
      elsevierOpenLicenceRate: dataGraphBar
        ?.find((item) => item.name === openLicenseLabel)
        ?.data.find((item) => item.publisher === publisher)
        ?.y.toFixed(0),
    };

    return {
      categories,
      comments,
      dataGraphBar,
      dataGraphTreemap,
    };
  }

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
  }, [observationSnaps, isDetailed, needle]);

  return { data, isError, isLoading };
}
export default useGetData;
