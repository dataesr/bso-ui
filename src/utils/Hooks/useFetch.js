import axios from 'axios';
import { useRef, useState } from 'react';

import { HEADERS } from '../../config/config';

export default function useFetch({ method, url, options }) {
  const isMounted = useRef(true);
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  return {
    response,
    loading,
    isMounted,
    error,
    reset: () => setResponse(),
    fetch: async (params = {}) => {
      const { options: fetchOptions, reload } = params;

      setLoading(true);
      isMounted.current = true;
      if (!response || reload) {
        setLoading(true);
      }
      axios[method](url, fetchOptions || options, HEADERS)
        .then((res) => {
          if (res) {
            setResponse(res.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError({ error: true, message: err });
        });
    },
  };
}
