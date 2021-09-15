/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';

function useGetData(studyType) {
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function getDataAxios() {
    const query = getFetchOptions('studiesDynamiqueOuverture', studyType);

    const res = await Axios.post(ES_STUDIES_API_URL, query, HEADERS).catch((e) => console.log(e));
    return res.data;
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataAxios();
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyType]);

  return { allData, isLoading };
}
export default useGetData;
