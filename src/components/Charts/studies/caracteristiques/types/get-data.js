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

    const query = getFetchOptions({
      key: 'studiesCaracteristiquesTypes',
      parameters: [studyType, sponsorType],
    });
    const res = await Axios.post(ES_STUDIES_API_URL, query, HEADERS);

    const currentYear = new Date().getFullYear() - 1;
    const dataSortedByYear = res.data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2012 && y.key <= currentYear);

    const colors = {
      Behavioral: getCSSValue('--yellow-medium-125'),
      Biological: getCSSValue('--green-soft-125'),
      CombinationProduct: getCSSValue('--pink-medium-150'),
      Device: getCSSValue('--blue-soft-100'),
      DiagnosticTest: getCSSValue('--green-medium-150'),
      DietarySupplement: getCSSValue('--blue-dark-125'),
      Drug: getCSSValue('--orange-soft-100'),
      Genetic: getCSSValue('--purple-medium-100'),
      Other: getCSSValue('--g-400'),
      Procedure: getCSSValue('--orange-medium-100'),
      Radiation: getCSSValue('--pink-light-100'),
    };

    const dataGraph = [];

    const categoriesSet = new Set();

    dataSortedByYear.forEach((el) => {
      el.by_intervention_type.buckets.forEach((ele) => {
        categoriesSet.add(ele.key);
      });
    });

    Array.from(categoriesSet).forEach((cat) => {
      dataGraph.push({
        name: intl.formatMessage({
          id: `app.studies.intervention-type.${cat}`,
        }),
        color: colors[cat.split(' ').join('')],
        data: dataSortedByYear.map((el) => {
          const x = el.key;
          const yValue = el.by_intervention_type.buckets.find(
            (ele) => ele.key === cat,
          )?.doc_count;
          const y = (yValue / el.doc_count) * 100;
          const yLabel = Number(y)?.toFixed(2);
          const yTotal = el.doc_count;
          return { x, yValue, y, yLabel, yTotal };
        }),
      });
    });
    dataGraph.reverse();

    const year = 2019;
    const category = intl.formatMessage({
      id: 'app.studies.intervention-type.Drug',
    });
    const value = dataGraph
      ?.find((item) => item.name === category)
      ?.data?.find((item) => item.x === year)
      ?.y?.toFixed(0);

    const comments = {
      category,
      value,
      year,
    };

    return {
      comments,
      dataGraph,
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
  }, [studyType, sponsorType]);

  return { allData, isLoading, isError };
}
export default useGetData;
