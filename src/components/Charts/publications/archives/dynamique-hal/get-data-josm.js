import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

// import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { ES_API_URL, IS_TEST } from '../../../../../config/config';
// import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getObservationLabel,
} from '../../../../../utils/helpers';

function useGetData(beforeLastObservationSnap, lastObservationSnap, domain) {
  const intl = useIntl();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

  async function GetData() {
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
          data_type: 'archives.dynamique-hal.get-data',
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
            { term: { data_type: 'archives.dynamique-hal.get-data' } },
          ],
        },
      },
    });

    let res;
    if (lastObservationSnap) {
    // 成形処理
    /* eslint-disable no-underscore-dangle */
    res = [
      {
        data: {
          aggregations: {
            by_publication_year: {
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
              buckets: preRes.data.hits.hits[0]._source.data.map((item) => ({
                key: item.publication_year,
                doc_count: item.jp_repo,
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
              buckets: preRes.data.hits.hits[0]._source.data.map((item) => ({
                key: item.publication_year,
                doc_count: item.other_repo + item.jp_repo,
              })),
            },
          },
        },
      },
    ];
  } else {
    res = [{
      data: {
        aggregations: {
          by_publication_year: {
            buckets: [],
          },
        },
      },
    },
    {
      data: {
        aggregations: {
          by_publication_year: {
            buckets: [],
          },
        },
      },
    }];
  }
    /* eslint-enable no-underscore-dangle */
    if (IS_TEST) {
      console.log('dynamique-hal_preRes:', preRes); // eslint-disable-line no-console
      console.log('dynamique-hal_res:', res); // eslint-disable-line no-console
    }

    let dataHAL = res[0].data.aggregations.by_publication_year.buckets;
    dataHAL = dataHAL
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key > 2012
          && parseInt(el.key, 10)
            < parseInt(lastObservationSnap.substring(0, 4), 10),
      );
    let dataArchive = res[1].data.aggregations.by_publication_year.buckets;
    dataArchive = dataArchive
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key > 2012
          && parseInt(el.key, 10)
            < parseInt(lastObservationSnap.substring(0, 4), 10),
      );
    const publicationYears = [];
    const hal = [];
    const notHal = [];
    dataHAL.forEach((el, index) => {
      publicationYears.push(el.key);
      hal.push({
        y_abs: el.doc_count,
        y: (100 * el.doc_count) / dataArchive[index].doc_count,
        bsoDomain,
        y_percHAL: (100 * el.doc_count) / dataArchive[index].doc_count,
        y_tot: dataArchive[index].doc_count,
        x: el.key,
      });
      notHal.push({
        y_abs: dataArchive[index].doc_count - el.doc_count,
        y:
          (100 * (dataArchive[index].doc_count - el.doc_count))
          / dataArchive[index].doc_count,
        bsoDomain,
        y_percHAL:
          (100 * (dataArchive[index].doc_count - el.doc_count))
          / dataArchive[index].doc_count,
        y_tot: dataArchive[index].doc_count,
        x: el.key,
      });
    });
    const dataGraph2 = [
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.health-publi.repositories.dynamique-hal.notHal',
          }),
        ),
        data: notHal,
        color: getCSSValue('--green-medium-150'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.health-publi.repositories.dynamique-hal.hal',
          }),
        ),
        data: hal,
        color: getCSSValue('--acces-ouvert'),
      },
    ];

    const valueHalLabel = capitalize(
      intl.formatMessage({
        id: 'app.health-publi.repositories.dynamique-hal.hal',
      }),
    );
    const valueNotHalLabel = capitalize(
      intl.formatMessage({
        id: 'app.health-publi.repositories.dynamique-hal.notHal',
      }),
    );
    let valueHAL = '';
    let valueNotHAL = '';
    if (dataGraph2) {
      valueHAL = dataGraph2
        .find((item) => item.name === valueHalLabel)
        ?.data.find(
          (item) => item.x.toString()
            === getObservationLabel(beforeLastObservationSnap, intl),
        )
        ?.y.toFixed(0);
      valueNotHAL = dataGraph2
        .find((item) => item.name === valueNotHalLabel)
        ?.data.find(
          (item) => item.x.toString()
            === getObservationLabel(beforeLastObservationSnap, intl),
        )
        ?.y.toFixed(0);
    }

    const comments = {
      observationYear: getObservationLabel(lastObservationSnap, intl),
      publicationYear: getObservationLabel(beforeLastObservationSnap, intl),
      valueHAL,
      valueNotHAL,
    };

    return {
      comments,
      dataGraph2,
      publicationYears,
    };
  }

  useEffect(() => {
    async function getData() {
      try {
        const tempData = await GetData();
        setData(tempData);
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
  }, [beforeLastObservationSnap, lastObservationSnap]);

  return { data, isError, isLoading };
}
export default useGetData;
