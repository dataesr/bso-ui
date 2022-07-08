import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(observationSnap, domain) {
  const [allData, setAllData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

  async function getDataGraph() {
    if (!observationSnap) {
      return {};
    }
    const query = getFetchOptions({
      key: 'predatory',
      domain,
      objectType: ['publications'],
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
    let totalPublications = 0;
    let publicationsInList = 0;
    data.forEach((dataYear) => {
      totalPublications += dataYear?.doc_count || 0;
      publicationsInList += parseInt(
        dataYear.by_predatory.buckets.find((item) => item.key === 1)
          ?.doc_count || 0,
        10,
      );
    });
    predatory.push({
      bsoDomain,
      y_tot: totalPublications,
      y_abs: publicationsInList,
      y: (publicationsInList / totalPublications) * 100,
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
