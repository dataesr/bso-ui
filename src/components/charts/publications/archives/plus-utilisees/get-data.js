/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { getFetchOptions } from '../../../../../utils/helpers';

function useGetData(observationDate) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  async function GetData() {
    const query = getFetchOptions('publishersList', 'health');
    const term = {};
    term[`oa_details.${observationDate}.oa_host_type`] = 'repository';
    query.query.bool.filter.push({ term });

    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));

    const dataGraph = res.data.aggregations.by_publisher.buckets.map((el) => ({
      name: el.key,
      y: el.doc_count,
    }));

    return dataGraph.slice(0, 20);
  }

  useEffect(() => {
    async function getData() {
      try {
        const tempData = await GetData();
        setData(tempData);
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
