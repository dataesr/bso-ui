import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

// import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { ES_API_URL, IS_TEST } from '../../../../../config/config';
import { getCSSValue, getObservationLabel } from '../../../../../utils/helpers';

function useGetData(observationSnaps, needle = '*', domain) {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

  async function getDataByObservationSnaps(observationYears) {
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
      query: {
        term: {
          data_type: 'archives.dynamique-ouverture.get-data',
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
    lastDateOfYear.sort((a, b) => new Date(b) - new Date(a));

    /* eslint-disable no-underscore-dangle */
    let preRes;

    if (needle === '*') {
      const preAllDataRes = await Axios.post(
        ES_API_URL,
        {
          query: {
            bool: {
              filter: [
                { terms: { calc_date: lastDateOfYear } },
                { term: { data_type: 'archives.dynamique-ouverture.get-data' } },
              ],
              must_not: [
                { term: { repository: 'ja-repository' } },
              ],
            },
          },
          aggs: {
            by_calc_date: {
              terms: {
                field: 'calc_date',
                size: 1000,
                order: { _key: 'desc' },
              },
              aggs: {
                nested_data: {
                  nested: {
                    path: 'data',
                  },
                  aggs: {
                    total_per_year: {
                      terms: {
                        field: 'data.publication_year',
                        size: 1000,
                      },
                      aggs: {
                        total_sum: {
                          sum: {
                            field: 'data.total',
                          },
                        },
                        oa_sum: {
                          sum: {
                            field: 'data.oa',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      );

      const preSource = [];
      let preData = [];
      const preBuckets = preAllDataRes.data.aggregations.by_calc_date.buckets;

      for (let i = 0; i < preBuckets.length; i += 1) {
        const preNestDatabuckets = preBuckets[i].nested_data.total_per_year.buckets;
        for (let j = 0; j < preNestDatabuckets.length; j += 1) {
          const publicationYear = preNestDatabuckets[j].key;
          const total = preNestDatabuckets[j].total_sum.value;
          const oa = preNestDatabuckets[j].oa_sum.value;
          preData.push({
            pubulication_year: publicationYear,
            total,
            oa,
          });
        }
        preSource.push({
          _source: {
            data: preData,
          },
        });
        preData = [];
      }
      preRes = {
        data: {
          hits: {
            hits: preSource,
          },
        },
      };
      if (IS_TEST) {
        console.log('dynamique-ouverture_preRes:', preRes); // eslint-disable-line no-console
      }
    } else {
      preRes = await Axios.post(
        ES_API_URL,
        {
          query: {
            bool: {
              filter: [
                { terms: { calc_date: lastDateOfYear } },
                { term: { data_type: 'archives.dynamique-ouverture.get-data' } },
                { term: { repository: needle } },
              ],
            },
          },
        },
      );
      if (IS_TEST) {
        console.log('dynamique-ouverture_preRes:', preRes); // eslint-disable-line no-console
      }
      const preList = preRes.data.hits.hits;
      const preSource = preList.map((hit) => ({
        _source: {
          data: hit._source.data.map((item) => ({
            pubulication_year: item.publication_year,
            total: item.total,
            oa: item.oa,
          })),
        },
      }));

      preRes = {
        data: {
          hits: {
            hits: preSource,
          },
        },
      };
    }

    let responses;
    if (observationYears) {
    // 成形処理
    responses = preRes.data.hits.hits.flatMap((hit) => [
      {
        data: {
          aggregations: {
            by_publication_year: {
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
              buckets: hit._source.data.map((item) => ({
                key: item.pubulication_year,
                doc_count: item.oa,
                by_is_oa: {
                  doc_count_error_upper_bound: 0,
                  sum_other_doc_count: 0,
                  buckets: [
                    {
                      key: 1,
                      key_as_string: 'true',
                      doc_count: item.oa,
                    },
                  ],
                },
              })),
            },
          },
        },
      },
      {
        data: {
          aggregations: {
            by_publication_year: {
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
              buckets: hit._source.data.map((item) => ({
                key: item.pubulication_year,
                doc_count: item.total,
                by_is_oa: {
                  doc_count_error_upper_bound: 0,
                  sum_other_doc_count: 0,
                  buckets: [
                    {
                      key: 1,
                      key_as_string: 'true',
                      doc_count: item.total,
                    },
                  ],
                },
              })),
            },
          },
        },
      },
    ]);
  } else {
    responses = [];
  }

    if (IS_TEST) {
      console.log('dynamique-ouverture_res:', responses); // eslint-disable-line no-console
    }

    const allData = [];
    for (let i = 0; i < responses.length; i += 1) {
      const newData = {};
      if (i % 2 === 1) {
        newData.observationSnap = observationYears[(i - 1) / 2];
        newData.data = {};
        const responseFiltered = responses[
          i - 1
        ].data.aggregations.by_publication_year.buckets
          .sort((a, b) => a.key - b.key)
          .filter(
            (el) => el.key < parseInt(newData.observationSnap.substring(0, 4), 10)
              && el.by_is_oa.buckets.length > 0
              && el.doc_count
              && el.key > 2012,
          );
        const publicationDates = [];
        const all = [];
        const oaHostTypes = [];
        const tmpData = responses[
          i
        ].data.aggregations.by_publication_year.buckets
          .sort((a, b) => a.key - b.key)
          .filter(
            (el) => el.key < parseInt(newData.observationSnap.substring(0, 4), 10)
              && el.by_is_oa.buckets.length > 0
              && el.doc_count
              && el.key > 2012,
          );
        tmpData.forEach((el) => {
          publicationDates.push(el.key);
          all.push(el.doc_count);
          oaHostTypes.push(
            responseFiltered.filter((r) => r.key === el.key)[0]?.doc_count || 0,
          );
        });
        newData.data.publicationDates = publicationDates;
        newData.data.all = all;
        newData.data.oaHostType = oaHostTypes;
        allData.push(newData);
      }
    }

    const colors = [
      getCSSValue('--green-medium-125'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
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
    let archive;
    if (needle === '*') {
      archive = intl.formatMessage({ id: 'app.all-repositories' });
    } else if (needle === 'ja-repository') {
      archive = intl.formatMessage({ id: 'app.ja-repositories' });
    } else {
      archive = needle;
    }
    allData.forEach((observationSnapData, i) => {
      const serie = {};
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
      serie.data = observationSnapData.data.oaHostType.map((value, index) => ({
        y: (value * 100) / observationSnapData.data.all[index],
        y_tot: observationSnapData.data.all[index],
        y_abs: value,
        bsoDomain,
        archive,
        name: getObservationLabel(observationSnapData.observationSnap, intl), // observation date
        publicationDate: observationSnapData.data.publicationDates[index],
      }));
      serie.ratios = observationSnapData.data.oaHostType.map(
        (value, index) => `(${value} / ${observationSnapData.data.all[index]})`,
      );
      serie.publicationDate = observationSnapData.data.publicationDates[
        observationSnapData.data.publicationDates.length - 1
      ];
      dataGraph2.push(serie);
    });
    const dataGraph1 = dataGraph2
      .map((el) => ({
        name: el.name, // observation date
        bsoDomain,
        y: el.data[el.data.length - 1]?.y || 0,
        archive,
        ratio: el.ratios[el.data.length - 1],
        publicationDate: el.publicationDate,
      }));
    // .filter((el) => el.y > 0);

    const categories = dataGraph2?.[0]?.data.map((item) => item.publicationDate) || [];
    let firstObservationYear = '';
    let percentage = '';
    let publicationDate = '';
    let value1 = '';
    let value2 = '';
    let y = '';
    let year = '';
    let year1 = '';
    let year2 = '';
    if (observationSnaps && dataGraph1.length && dataGraph2.length) {
      //  eslint-disable-next-line prefer-destructuring
      year = observationSnaps[0];
      // year = getObservationLabel(observationSnaps[0], intl);
      y = dataGraph1.find((item) => item.name === year).y;
      publicationDate = dataGraph1.find(
        (item) => item.name === year,
      ).publicationDate;
      percentage = y?.toFixed(0);
      year1 = dataGraph2[dataGraph2.length - 1].name;
      value1 = dataGraph2[dataGraph2.length - 1].data
        .find((item) => item.publicationDate === 2017)
        ?.y.toFixed(0);
      year2 = dataGraph2[0].name;
      value2 = dataGraph2[0].data
        .find((item) => item.publicationDate === 2017)
        ?.y.toFixed(0);
      firstObservationYear = getObservationLabel(
        observationSnaps[observationSnaps.length - 1],
        intl,
      );
    }

    const comments = {
      firstObservationYear,
      percentage,
      publicationDate,
      value1,
      value2,
      year,
      year1,
      year2,
    };

    return {
      categories,
      comments,
      dataGraph1,
      dataGraph2,
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
  }, [observationSnaps, needle]);

  return { data, isError, isLoading };
}
export default useGetData;
