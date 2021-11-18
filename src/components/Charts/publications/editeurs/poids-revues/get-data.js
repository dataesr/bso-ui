import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(observationSnap, domain) {
  const [allData, setAllData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
  const location = useLocation().search;

  async function getDataGraph() {
    const query = getFetchOptions({
      key: 'predatory',
      domain,
      location,
    });
    const res = await Axios.post(ES_API_URL, query, HEADERS);
    const data = res.data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key >= 2013
          && parseInt(el.key, 10)
            < parseInt(observationSnap[0].substring(0, 4), 10),
      );

    const categories = data.map((dataYear) => dataYear.key);
    const predatory = [];
    data.forEach((dataYear) => {
      predatory.push({
        publicationDate: dataYear.key,
        bsoDomain,
        y_abs: dataYear.by_predatory.buckets.find((el) => el.key === 1)
          .doc_count,
        y_tot: dataYear.doc_count,
        y:
          (100
            * dataYear.by_predatory.buckets.find((el) => el.key === 1)
              .doc_count)
          / dataYear.doc_count,
      });
    });
    const dataGraph = [
      {
        name: 'predatory',
        data: predatory,
        color: getCSSValue('--red-medium-150'),
      },
    ];

    return { categories, dataGraph };
  }

  useEffect(() => {
    async function getData() {
      try {
        const obj = await getDataGraph();
        setAllData(obj);
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

  return { allData, isLoading, isError };
}
export default useGetData;
