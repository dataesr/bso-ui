import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getPublicationYearFromObservationSnap } from '../../../../../utils/helpers';

function useGetData(observationSnap, domain) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
  const location = useLocation().search;

  async function GetData() {
    const query = getFetchOptions({
      key: 'repositoriesList',
      domain,
      location,
      parameters: [observationSnap],
    });
    const res = await Axios.post(ES_API_URL, query, HEADERS);
    const dataGraph = res.data.aggregations.by_repository.buckets.map((el) => ({
      name: el.key,
      bsoDomain,
      y: el.doc_count,
      publicationDate: getPublicationYearFromObservationSnap(observationSnap),
    }));
    return dataGraph.slice(0, 15);
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

  return { data, isLoading, isError };
}
export default useGetData;
