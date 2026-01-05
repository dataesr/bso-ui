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
  const [isError, setError] = useState(false);

  async function getDataAxios() {
    const querySponsorTypes = getFetchOptions({
      key: 'sponsorsTypesList',
      parameters: [studyType],
      objectType: ['clinicalTrials'],
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
      parameters: [studyType, sponsorType],
      objectType: ['clinicalTrials'],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, query1, HEADERS));
    const res = await Axios.all(queries);
    const currentYear = parseInt(
      process.env.REACT_APP_LAST_OBSERVATION_CLINICAL_TRIALS.substring(0, 4),
      10,
    );
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
          color: getCSSValue('--g-300'),
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
          color: getCSSValue('--g-500'),
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

    const yesLabel = intl.formatMessage({ id: 'app.studies.plan-partage-yes' });
    const yesData = dataGraph1?.series?.find(
      (item) => item.name === yesLabel,
    )?.data;
    const value1 = yesData[0]?.y?.toFixed(0);
    const value2 = yesData[yesData.length - 1]?.y?.toFixed(0);
    const year1 = yesData[0]?.year;
    const year2 = yesData[yesData.length - 1]?.year;
    const comments = {
      value1,
      value2,
      year1,
      year2,
    };

    return {
      comments,
      dataGraph1,
      sponsorTypes,
    };
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
  }, [sponsorType, studyType]);

  return { allData, isError, isLoading };
}
export default useGetData;
