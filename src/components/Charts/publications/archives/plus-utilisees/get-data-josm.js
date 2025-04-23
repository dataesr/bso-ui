import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

// import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { ES_API_URL, IS_TEST } from '../../../../../config/config';
// import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { EXCLUDE_REPOSITORIES_LIST } from '../../../../../config/publicationDataLists';
import {
  formatNumberByLang,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';
import useLang from '../../../../../utils/Hooks/useLang';

function useGetData(observationSnap, domain) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
  const { lang } = useLang();

  async function GetData() {
    // const query = getFetchOptions({
    //   key: 'repositoriesList',
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
          data_type: 'archives.dynamique-ouverture.get-data',
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
            { term: { data_type: 'archives.dynamique-ouverture.get-data' } },
          ],
          must_not: [
            {
              terms: {
                repository: EXCLUDE_REPOSITORIES_LIST,
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
                def oa_count = 0;
                for (item in params._source.data) {
                  if (item.publication_year == params.targetYear) {
                    for (entry in item.entrySet()) {
                      if (entry.getKey() == 'oa' && entry.getValue() instanceof Number) {
                        oa_count = entry.getValue();
                      }
                    }
                  }
                }
                return oa_count;
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
    if (observationSnap) {
    // 成形処理
    const buckets = preRes.data.hits.hits.map((hit) => ({
      key: hit._source.repository,
      doc_count: hit._source.data
        // publication_yearがtargetYearと一致するitemのみ抽出
        .filter((item) => item.publication_year === targetYear)
        .reduce((acc, item) => acc + item.oa, 0),
    }));

    res = {
      data: {
        aggregations: {
          by_repository: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets,
          },
        },
      },
    };
  } else {
    res = {
      data: {
        aggregations: {
          by_repository: {
            buckets: [],
          },
        },
      },
    };
  }
    if (IS_TEST) {
      console.log('plus-utilisees_preRes:', preRes); // eslint-disable-line no-console
      console.log('plus-utilisees_res:', res); // eslint-disable-line no-console
    }

    let dataGraph = res.data.aggregations.by_repository.buckets.map((item) => ({
      name: intl.formatMessage({
        id: `app.repositories.label.${item.key
          .toLowerCase()
          .replace(/ /g, '')}`,
        defaultMessage: item.key,
      }),
      bsoDomain,
      y: item.doc_count,
      publicationDate: getPublicationYearFromObservationSnap(observationSnap),
    }));
    dataGraph = dataGraph.slice(0, 15);

    const name1 = dataGraph?.[0]?.name || '';
    const name2 = dataGraph?.[1]?.name || '';
    const name3 = dataGraph?.[2]?.name || '';
    const name4 = dataGraph?.[3]?.name || '';
    const publicationDate = dataGraph?.find((item) => item.name === name1)?.publicationDate || '';
    const value = formatNumberByLang(
      dataGraph?.find((item) => item.name === name1)?.y || '',
      lang,
    );
    const domain1 = intl.messages[`app.repositories.domain.${name1}`]
      ? intl.formatMessage({ id: `app.repositories.domain.${name1}` })
      : intl.formatMessage({ id: 'app.repositories.domain.all' });
    const domain2 = intl.messages[`app.repositories.domain.${name2}`]
      ? intl.formatMessage({ id: `app.repositories.domain.${name2}` })
      : intl.formatMessage({ id: 'app.repositories.domain.all' });
    const domain3 = intl.messages[`app.repositories.domain.${name3}`]
      ? intl.formatMessage({ id: `app.repositories.domain.${name3}` })
      : intl.formatMessage({ id: 'app.repositories.domain.all' });
    const domain4 = intl.messages[`app.repositories.domain.${name4}`]
      ? intl.formatMessage({ id: `app.repositories.domain.${name4}` })
      : intl.formatMessage({ id: 'app.repositories.domain.all' });

    const comments = {
      domain1,
      domain2,
      domain3,
      domain4,
      name1,
      name2,
      name3,
      name4,
      publicationDate,
      value,
    };

    return {
      comments,
      dataGraph,
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
  }, [observationSnap]);

  return { data, isError, isLoading };
}
export default useGetData;
