/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  diamond,
  goldapc,
  hybrid,
} from '../../../../../style/colours.module.scss';
import { getFetchOptions } from '../../../../../utils/helpers';

function useGetData(observationDate) {
  const [allData, setAllData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  async function getDataGraph() {
    const query = getFetchOptions('publishersTypesHisto', observationDate);
    const term = {};
    term[`oa_details.${observationDate}.oa_host_type`] = 'publisher';
    query.query.bool.filter.push({ term });

    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));
    const data = res.data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key >= 2013
          && parseInt(el.key, 10) < parseInt(observationDate.substring(0, 4), 10),
      );

    const categories = data.map((dataYear) => dataYear.key);
    const goldData = [];
    const hybridData = [];
    const diamongData = [];

    data.forEach((dataYear) => {
      goldData.push(
        dataYear.by_oa_colors.buckets.find((el) => el.key === 'gold').doc_count,
      );
      hybridData.push(
        dataYear.by_oa_colors.buckets.find((el) => el.key === 'hybrid')
          .doc_count,
      );
      diamongData.push(
        dataYear.by_oa_colors.buckets.find((el) => el.key === 'diamond')
          .doc_count,
      );
    });
    const dataGraph = [
      {
        name: 'gold',
        data: goldData,
        color: goldapc,
      },
      {
        name: 'hybrid',
        data: hybridData,
        color: hybrid,
      },
      {
        name: 'diamond',
        data: diamongData,
        color: diamond,
      },
    ];

    const dataGraphTreemap = [
      {
        name: 'gold',
        value: data[data.length - 1].by_oa_colors.buckets.find(
          (item) => item.key === 'gold',
        ).doc_count,
        color: goldapc,
      },
      {
        name: 'hybrid',
        value: data[data.length - 1].by_oa_colors.buckets.find(
          (item) => item.key === 'hybrid',
        ).doc_count,
        color: hybrid,
      },
      {
        name: 'diamond',
        value: data[data.length - 1].by_oa_colors.buckets.find(
          (item) => item.key === 'diamond',
        ).doc_count,
        color: diamond,
      },
    ];

    return { categories, dataGraph, dataGraphTreemap };
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
  }, [observationDate]);

  return { allData, isLoading };
}
export default useGetData;
