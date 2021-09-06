/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { redmedium150 } from '../../../../../style/colours.module.scss';
import { getFetchOptions } from '../../../../../utils/chartOptions';

function useGetData(observationSnap, domain) {
  const [allData, setAllData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  async function getDataGraph() {
    const query = getFetchOptions('predatory', domain);

    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));
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
        color: redmedium150,
      },
    ];

    return { categories, dataGraph };
  }

  useEffect(() => {
    async function getData() {
      try {
        const obj = await getDataGraph();
        setAllData(obj);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationSnap]);

  return { allData, isLoading };
}
export default useGetData;
