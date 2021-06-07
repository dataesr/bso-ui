/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import Axios from 'axios';
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

  async function getData() {
    const allAxios = queries.map((q) => Axios.post(ES_API_URL, q, headers));
    const res = await Axios.all(allAxios).catch((_error) => {
      console.log('er');
      setError(true);
      setLoading(false);
    });
    console.log('ok', res);
    setData(res);
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  return { data, isLoading, isError };
}

export default useGetData;
