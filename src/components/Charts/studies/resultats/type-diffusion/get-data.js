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
    const query = getFetchOptions('studiesResultsTypeDiffusion', '', studyType);

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
          name: 'results_only',
          data: dataSortedByYear.map((el) => ({
            y: el.by_has_result.buckets.find((ele) => ele.key === 1)?.by_has_publications_result.buckets.find((ele) => ele.key === 0)?.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--resultat-100'),
        },
        {
          name: 'publications_only',
          data: dataSortedByYear.map((el) => ({
            y: el.by_has_result.buckets.find((ele) => ele.key === 0)?.by_has_publications_result.buckets.find((ele) => ele.key === 1)?.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--publication-100'),
        },
        {
          name: 'results_and_publications',
          data: dataSortedByYear.map((el) => ({
            y: el.by_has_result.buckets.find((ele) => ele.key === 1)?.by_has_publications_result.buckets.find((ele) => ele.key === 1)?.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--resultat-et-publication'),
        },
        {
          name: 'no_results_publications',
          data: dataSortedByYear.map((el) => ({
            y: el.by_has_result.buckets.find((ele) => ele.key === 0)?.by_has_publications_result.buckets.find((ele) => ele.key === 0)?.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--g-400'),
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
