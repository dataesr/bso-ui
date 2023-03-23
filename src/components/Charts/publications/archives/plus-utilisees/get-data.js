import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
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
    const query = getFetchOptions({
      key: 'repositoriesList',
      domain,
      parameters: [observationSnap],
      objectType: ['publications'],
    });
    const res = await Axios.post(ES_API_URL, query, HEADERS);
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
