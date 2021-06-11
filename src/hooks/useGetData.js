import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../configs/config';

function useGetData(queries = []) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    function getData() {
      const allAxios = queries.map((query) => Axios.post(ES_API_URL, query, HEADERS));
      Axios.all(allAxios)
        .then((response) => setData(response))
        .catch((error) => {
          console.log(error);
          setError(true);
        })
        .then(() => setLoading(false));
    }
    getData();
  }, [queries]);

  return { data, isLoading, isError };
}

export default useGetData;
