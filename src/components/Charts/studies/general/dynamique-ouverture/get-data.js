/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType) {
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function getDataAxios() {
    const query = getFetchOptions('studiesDynamiqueOuverture', '', studyType);

    const res = await Axios.post(ES_STUDIES_API_URL, query, HEADERS).catch(
      (e) => console.log(e),
    );
    const dataSortedByYear = res.data.aggregations.by_year.buckets.sort(
      (a, b) => a.key - b.key,
    );

    const dataGraph1 = {
      categories: dataSortedByYear.map((el) => el.key),
      series: [
        {
          name: 'public',
          data: dataSortedByYear.map(
            (el) => el.by_sponsor_type.buckets.find((ele) => ele.key === 'academique')
              .doc_count,
          ),
          color: getCSSValue('--lead-sponsor-public'),
        },
        {
          name: 'privé',
          data: dataSortedByYear.map(
            (el) => el.by_sponsor_type.buckets.find((ele) => ele.key === 'industriel')
              .doc_count,
          ),
          color: getCSSValue('--lead-sponsor-privee'),
        },
      ],
    };

    return dataGraph1;
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataAxios();
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyType]);

  return { allData, isLoading };
}
export default useGetData;
