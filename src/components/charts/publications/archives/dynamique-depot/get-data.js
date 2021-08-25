/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
// import {
//   archiveouverte100,
// } from '../../../../../style/colours.module.scss';
import { getFetchOptions } from '../../../../../utils/helpers';

function useGetData(observationDate) {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function GetData() {
    const query = getFetchOptions('repositoriesHisto', 'health', observationDate);

    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));

    const tab = [];
    res.data.aggregations.by_repository.buckets.forEach((archive) => {
      if (archive.key !== 'N/A') {
        const obj = {
          name: archive.key,
          data: archive.by_year.buckets
            .sort((a, b) => b.key - a.key)
            .slice(1, 5)
            .sort((a, b) => a.key - b.key)
            .map((el) => ({
              name: el.key,
              year: el.key,
              y: el.doc_count,
            })),
        };
        tab.push(obj);
      }
    });

    return tab.slice(0, 12);
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await GetData();
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationDate]);

  return { data, isLoading };
}
export default useGetData;
