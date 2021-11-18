import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType, sponsorType = '*') {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const location = useLocation().search;

  async function getDataAxios() {
    const querySponsorTypes = getFetchOptions({
      key: 'sponsorsTypesList',
      location,
      parameters: [studyType],
    });
    const responseSponsorTypes = await Axios.post(
      ES_STUDIES_API_URL,
      querySponsorTypes,
      HEADERS,
    );
    let sponsorTypes = responseSponsorTypes.data.aggregations.by_sponsor_type.buckets.map(
      (item) => item.key,
    );
    sponsorTypes = sponsorTypes.map((st) => ({
      value: st,
      label: intl.formatMessage({ id: `app.sponsor.${st}` }),
    }));

    const queries = [];
    const query1 = getFetchOptions({
      key: 'studiesResultsPlanPartage',
      location,
      parameters: [studyType, sponsorType],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, query1, HEADERS));
    const res = await Axios.all(queries);
    const currentYear = new Date().getFullYear();
    const data1SortedByYear = res[0].data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2010 && y.key <= currentYear);
    const dataGraph1 = {
      categories: data1SortedByYear.map((el) => el.key),
      series: [
        {
          name: intl.formatMessage({ id: 'app.studies.plan-partage-na' }),
          data: data1SortedByYear.map((el) => ({
            y_abs: el.by_ipd.buckets.find((ele) => ele.key === 'NA')?.doc_count,
            y:
              (100
                * el.by_ipd.buckets.find((ele) => ele.key === 'NA')?.doc_count)
              / el.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--g-400'),
        },
        {
          name: intl.formatMessage({
            id: 'app.studies.plan-partage-undecided',
          }),
          data: data1SortedByYear.map((el) => ({
            y_abs: el.by_ipd.buckets.find((ele) => ele.key === 'Undecided')
              ?.doc_count,
            y:
              (100
                * el.by_ipd.buckets.find((ele) => ele.key === 'Undecided')
                  ?.doc_count)
              / el.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--patient-25'),
        },
        {
          name: intl.formatMessage({ id: 'app.studies.plan-partage-no' }),
          data: data1SortedByYear.map((el) => ({
            y_abs: el.by_ipd.buckets.find((ele) => ele.key === 'No')?.doc_count,
            y:
              (100
                * el.by_ipd.buckets.find((ele) => ele.key === 'No')?.doc_count)
              / el.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--g-600'),
        },
        {
          name: intl.formatMessage({ id: 'app.studies.plan-partage-yes' }),
          data: data1SortedByYear.map((el) => ({
            y_abs: el.by_ipd.buckets.find((ele) => ele.key === 'Yes')
              ?.doc_count,
            y:
              (100
                * el.by_ipd.buckets.find((ele) => ele.key === 'Yes')?.doc_count)
              / el.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--patient-100'),
        },
      ],
    };
    return { sponsorTypes, dataGraph1 };
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataAxios();
        setData(dataGraph);
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
  }, [studyType, sponsorType]);

  return { allData, isLoading, isError };
}
export default useGetData;
