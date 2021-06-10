import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL } from '../configs/config';

const headers = {
  headers: {
    Authorization: 'Basic QlNPOnZuODRxOVhlZjlVN3BtVQ==',
    'Content-Type': 'application/json',
  },
};

function useGetData(queries = []) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    async function getData() {
      const allAxios = queries.map((q) => Axios.post(ES_API_URL, q, headers));
      const res = await Axios.all(allAxios).catch((_error) => {
        console.log(_error);
        setError(true);
        setLoading(false);
      });
      console.log('ok', res);
      setData(res);
      setLoading(false);
    }
    getData();
  }, [queries]);

  return { data, isLoading, isError };
}

export default useGetData;
