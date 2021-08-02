import axios from 'axios';
import { useRef, useState } from 'react';

import { HEADERS } from '../../config/config';

export default function useFetch({ method, url, options }) {
  const isMounted = useRef();
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  return {
    response,
    loading,
    isMounted,
    error,
    reset: () => setResponse(),
    fetch: async (reload = false) => {
      setLoading(true);
      isMounted.current = true;
      if (!response || reload) {
        setLoading(true);
      }
      axios[method](url, options, HEADERS)
        .then((res) => {
          if (isMounted.current) {
            if (res) {
              setResponse(res.data);
            }
            setLoading(false);
          }
        })
        .catch((err) => {
          setError({ error: true, message: err });
        });
    },
  };
}
