import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, getCSSValue } from '../../../../../utils/helpers';

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
      key: 'predatoryPublishers',
      domain,
      parameters: [observationSnap, 2013],
      objectType: ['publications'],
    });

    const res = await Axios.post(ES_API_URL, query, HEADERS);
    const data = res.data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key >= 2013
          && parseInt(el.key, 10)
            < parseInt(String(observationSnap).substring(0, 4), 10),
      );
    const categories = data.map((dataYear) => dataYear.key);
    const mdpiData = [];
    const frontiersData = [];
    const otherData = [];
    data.forEach((dataYear) => {
      const predatory = dataYear.by_predatory.buckets.find(
        (item) => item.key === 1,
      );
      const mdpiPublicationsCount = parseInt(
        predatory.by_publisher.buckets.find((item) => item.key === 'MDPI')
          ?.doc_count || 0,
        10,
      );
      const frontiersPublicationsCount = parseInt(
        predatory.by_publisher.buckets.find((item) => item.key === 'Frontiers')
          ?.doc_count || 0,
        10,
      );
      const otherPublicationsCount = parseInt(
        predatory.by_publisher?.sum_other_doc_count || 0,
        10,
      );
      mdpiData.push({
        publicationDate: dataYear.key,
        bsoDomain,
        y_abs: mdpiPublicationsCount,
        y_tot: dataYear?.doc_count || 0,
        y: (mdpiPublicationsCount / dataYear?.doc_count || 0) * 100,
      });
      frontiersData.push({
        bsoDomain,
        publicationDate: dataYear.key,
        y_abs: frontiersPublicationsCount,
        y_tot: dataYear?.doc_count || 0,
        y: (frontiersPublicationsCount / dataYear?.doc_count || 0) * 100,
      });
      otherData.push({
        bsoDomain,
        publicationDate: dataYear.key,
        y_abs: otherPublicationsCount,
        y_tot: dataYear?.doc_count || 0,
        y: (otherPublicationsCount / dataYear?.doc_count || 0) * 100,
      });
    });
    const dataGraph = [
      {
        name: capitalize(
          intl.formatMessage({
            id: 'Other predatory',
          }),
        ),
        data: otherData,
        color: getCSSValue('--orange-soft-100'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'Frontiers',
          }),
        ),
        data: frontiersData,
        color: getCSSValue('--diamond'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'MDPI',
          }),
        ),
        data: mdpiData,
        color: getCSSValue('--yellow-medium-100'),
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

  return { allData, isError, isLoading };
}
export default useGetData;
