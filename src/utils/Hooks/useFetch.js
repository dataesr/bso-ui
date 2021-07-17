import axios from 'axios';
import { useEffect, useState } from 'react';

import { HEADERS } from '../../config/config';

export default function useFetch({ method, url, options }) {
  const [response, setResponse] = useState({});
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      axios[method](url, options, HEADERS)
        .then((jsonData) => {
          setResponse(jsonData);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          setError({ error: true, message: err });
        });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  if (!response) return null;
  return { response, isLoading, error };
}
