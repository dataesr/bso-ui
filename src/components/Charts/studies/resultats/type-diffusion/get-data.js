/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType, sponsorType = '*') {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function getDataAxios() {
    const queries = [];
    const query1 = getFetchOptions('studiesResultsTypeDiffusion', '', studyType, sponsorType);
    queries.push(Axios.post(ES_STUDIES_API_URL, query1, HEADERS));
    const res = await Axios.all(queries).catch(() => {
      setLoading(false);
    });
    const data1SortedByYear = res[0].data.aggregations.by_year.buckets.sort(
      (a, b) => a.key - b.key,
    );
    const dataGraph1 = {
      categories: data1SortedByYear.map((el) => el.key),
      series: [
        {
          name: intl.formatMessage({ id: 'app.studies.results-only' }),
          data: data1SortedByYear.map((el) => ({
            y: el.by_has_result.buckets.find((ele) => ele.key === 1)?.by_has_publications_result.buckets.find((ele) => ele.key === 0)?.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--resultat-100'),
        },
        {
          name: intl.formatMessage({ id: 'app.studies.publications-only' }),
          data: data1SortedByYear.map((el) => ({
            y: el.by_has_result.buckets.find((ele) => ele.key === 0)?.by_has_publications_result.buckets.find((ele) => ele.key === 1)?.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--publication-100'),
        },
        {
          name: intl.formatMessage({ id: 'app.studies.results-and-publications' }),
          data: data1SortedByYear.map((el) => ({
            y: el.by_has_result.buckets.find((ele) => ele.key === 1)?.by_has_publications_result.buckets.find((ele) => ele.key === 1)?.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--resultat-et-publication'),
        },
        {
          name: intl.formatMessage({ id: 'app.studies.no-results-publications' }),
          data: data1SortedByYear.map((el) => ({
            y: el.by_has_result.buckets.find((ele) => ele.key === 0)?.by_has_publications_result.buckets.find((ele) => ele.key === 0)?.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--g-400'),
        },
      ],
    };

    return { dataGraph1 };
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
  }, [studyType, sponsorType]);

  return { allData, isLoading };
}
export default useGetData;
