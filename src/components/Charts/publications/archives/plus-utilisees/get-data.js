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
  const { search } = useLocation();

  async function GetData() {
    const query = getFetchOptions({
      key: 'repositoriesList',
      domain,
      search,
      parameters: [observationSnap],
    });
    const res = await Axios.post(ES_API_URL, query, HEADERS);
    let dataGraph = res.data.aggregations.by_repository.buckets.map((el) => ({
      name: el.key,
      bsoDomain,
      y: el.doc_count,
      publicationDate: getPublicationYearFromObservationSnap(observationSnap),
    }));
    dataGraph = dataGraph.slice(0, 15);

    let name1 = '';
    let name2 = '';
    let name3 = '';
    let name4 = '';
    let publicationDate = '';
    let y = '';
    if (dataGraph) {
      name1 = dataGraph[0].name;
      name2 = dataGraph[1].name;
      name3 = dataGraph[2].name;
      name4 = dataGraph[3].name;
      publicationDate = dataGraph.find(
        (item) => item.name === name1,
      )?.publicationDate;
      y = dataGraph.find((item) => item.name === name1)?.y;
    }
    const comments = {
      name1,
      name2,
      name3,
      name4,
      publicationDate,
      value: y,
    };
    return { comments, dataGraph };
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
