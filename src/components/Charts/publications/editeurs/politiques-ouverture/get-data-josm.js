import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

// import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { ES_API_URL, IS_TEST } from '../../../../../config/config';
// import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  cleanNumber,
  getCSSValue,
  getObservationLabel,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';

function useGetData(beforeLastObservationSnap, lastObservationSnap, domain) {
  const [allData, setAllData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
  const yellowMedium125 = getCSSValue('--yellow-medium-125');
  const yellowMedium100 = getCSSValue('--yellow-medium-100');
  const yellowMedium25 = getCSSValue('--yellow-medium-25');

  async function getDataGraph() {
    // const queries = [];
    // const query = getFetchOptions({
    //   key: 'publishersPolitiqueHisto',
    //   domain,
    //   parameters: [lastObservationSnap],
    //   objectType: ['publications'],
    // });
    // queries.push(Axios.post(ES_API_URL, query, HEADERS));
    // const queryBulle = getFetchOptions({
    //   key: 'publishersPolitiqueBulle',
    //   domain,
    //   parameters: [lastObservationSnap],
    //   objectType: ['publications'],
    // });
    // queries.push(Axios.post(ES_API_URL, queryBulle, HEADERS));
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
          data_type: 'editeurs.politiques-ouverture.get-data',
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
    const preRes = await Axios.post(ES_API_URL, {
      size: 25,
      query: {
        bool: {
          must: [
            { term: { calc_date: latestCalcDate } },
            { term: { data_type: 'editeurs.politiques-ouverture.get-data' } },
            {
              nested: {
                path: 'data',
                query: {
                  term: { 'data.publication_year': targetYear },
                },
              },
            },
          ],
        },
      },
      sort: [
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
      ],
    });

    let res;
    if (lastObservationSnap) {
    // 成形処理
    res = [{
      data: {
        aggregations: {
          by_publisher: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: preRes.data.hits.hits.map((hit) => ({
              key: hit._source.publisher,
              doc_count: hit._source.data
                .filter((item) => item.publication_year === targetYear)
                .reduce((sum, item) => sum + Object.entries(item).reduce((a, [key, value]) => (key !== 'publication_year' ? a + value : a), 0), 0),
              by_oa_colors: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: Object.keys(hit._source.data[0])
                  .filter((key) => key !== 'publication_year')
                  .map((key) => ({
                    key,
                    doc_count: hit._source.data
                      .filter((item) => item.publication_year === targetYear)
                      .reduce((sum, item) => sum + (item[key] || 0), 0),
                  })),
              },
            })),
          },
        },
      },
    }];
  } else {
    res = [{
      data: {
        aggregations: {
          by_publisher: {
            buckets: [],
          },
        },
      },
    }];
  }
    if (IS_TEST) {
      console.log('politiques-ouverture_preRes:', preRes); // eslint-disable-line no-console
      console.log('politiques-ouverture_res:', res); // eslint-disable-line no-console
    }

    // 1er graphe (bar)
    const data = res[0].data.aggregations.by_publisher.buckets;
    const openByPublishers = [];
    const greenOnly = [];
    const closed = [];
    const categories = [];
    data.forEach((item) => {
      const greenPublicationsCount = parseInt(
        item.by_oa_colors.buckets.find((el) => el.key === 'green')
          ?.doc_count || 0,
        10,
      );
      const oaPublicationsCount = parseInt(
        item.by_oa_colors.buckets
          .filter((el) => ['gold', 'hybrid', 'diamond', 'other'].includes(el.key))
          .reduce((a, b) => a + b.doc_count, 0),
        10,
      );
      const closedPublicationsCount = parseInt(
        item.by_oa_colors.buckets.find((el) => el.key === 'closed')
          ?.doc_count || 0,
        10,
      );
      openByPublishers.push({
        bsoDomain,
        publicationDate:
          getPublicationYearFromObservationSnap(lastObservationSnap),
        publisher: item.key,
        y_abs: oaPublicationsCount,
        y_tot: item.doc_count,
        y_rel: (oaPublicationsCount / item.doc_count) * 100,
      });
      greenOnly.push({
        bsoDomain,
        publicationDate:
          getPublicationYearFromObservationSnap(lastObservationSnap),
        publisher: item.key,
        y_abs: greenPublicationsCount,
        y_tot: item.doc_count,
        y_rel: (greenPublicationsCount / item.doc_count) * 100,
      });
      closed.push({
        bsoDomain,
        publicationDate:
          getPublicationYearFromObservationSnap(lastObservationSnap),
        publisher: item.key,
        y_abs: closedPublicationsCount,
        y_tot: item.doc_count,
        y_rel: (closedPublicationsCount / item.doc_count) * 100,
      });
      const totalCurrent = item.doc_count;
      const nameClean = item.key;
      categories.push(
        nameClean
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
          intl.formatMessage({ id: 'app.type-hebergement.closed' }),
        ),
        name_code: 'closed',
        data: closed,
        color: getCSSValue('--blue-soft-175'),
      },
      {
        name: capitalize(
          intl.formatMessage({ id: 'app.publishers.open-by-publisher' }),
        ),
        data: openByPublishers,
        color: yellowMedium125,
      },
      {
        name: capitalize(
          intl.formatMessage({ id: 'app.publishers.green-only' }),
        ),
        data: greenOnly,
        color: getCSSValue('--green-medium-125'),
      },
    ];
    // 2e graph (graphe à bulles)
    const dataBubbles = res[0].data.aggregations.by_publisher.buckets;
    const bubbles = [];
    dataBubbles.forEach((item) => {
      const greenPublicationsCount = parseInt(
        item.by_oa_colors.buckets.find((el) => el.key === 'green')?.doc_count
          || 0,
        10,
      );
      const oaPublicationsCount = parseInt(
        item.by_oa_colors.buckets
          .filter((el) => ['gold', 'hybrid', 'diamond', 'other'].includes(el.key))
          .reduce((a, b) => a + b.doc_count, 0),
        10,
      );
      bubbles.push({
        bsoDomain,
        publicationDate:
          getPublicationYearFromObservationSnap(lastObservationSnap),
        publisher: item.key,
        x: (oaPublicationsCount / item.doc_count) * 100,
        x_abs: oaPublicationsCount,
        y: (greenPublicationsCount / item.doc_count) * 100,
        y_abs: greenPublicationsCount,
        z: item.doc_count,
      });
    });
    const bubbleGraph = [
      {
        name: intl.formatMessage({ id: 'app.publishers' }),
        data: bubbles,
        color: yellowMedium100,
        marker: {
          fillColor: yellowMedium25,
          lineWidth: 3,
          lineColor: yellowMedium100,
        },
        showInLegend: false,
      },
      {
        type: 'line',
        color: getCSSValue('--g-600'),
        dashStyle: 'ShortDot',
        enableMouseTracking: false,
        showInLegend: false,
        marker: { enabled: false },
        data: [
          {
            x: 0,
            y: 0,
          },
          {
            x: 100,
            y: 100,
          },
        ],
      },
    ];

    const publisher = 'Wiley';
    const wiley = bubbleGraph
      .find((item) => item.name === 'éditeurs et plateformes')
      ?.data?.find((item) => item.publisher === publisher);
    let x = '';
    let y = '';
    if (wiley) {
      x = wiley.x.toFixed(0);
      y = wiley.y.toFixed(0);
    }

    const comments = {
      publicationYear: getObservationLabel(beforeLastObservationSnap, intl),
      publisher,
      x,
      y,
    };

    return {
      bubbleGraph,
      categories,
      comments,
      dataGraph,
    };
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
  }, [lastObservationSnap]);

  return { allData, isError, isLoading };
}
export default useGetData;
