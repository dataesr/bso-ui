import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType) {
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  async function getDataAxios() {
    const currentYear = parseInt(
      process.env.REACT_APP_LAST_OBSERVATION_CLINICAL_TRIALS.substring(0, 4),
      10,
    );
    const yearMin = currentYear - 11;
    const yearMax = currentYear - 1;
    const queries = [];
    const queryWaste = getFetchOptions({
      key: 'wasteByYear',
      parameters: [studyType, yearMin, yearMax, false],
      objectType: ['clinicalTrials'],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, queryWaste, HEADERS));
    const queryValuation = getFetchOptions({
      key: 'wasteByYear',
      parameters: [studyType, yearMin, yearMax, true],
      objectType: ['clinicalTrials'],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, queryValuation, HEADERS));
    const results = await Axios.all(queries);
    const bucketsWaste = results?.[0]?.data?.aggregations?.by_year?.buckets ?? [];
    const years = bucketsWaste.map((bucket) => bucket.key);
    const waste = years.map((year) => {
      const ct = bucketsWaste.find((bucket) => bucket.key === year);
      return {
        count: ct?.doc_count ?? 0,
        name: 'waste',
        y: ct?.financement_total?.value ?? 0,
        year,
      };
    });
    const bucketsValuation = results?.[1]?.data?.aggregations?.by_year?.buckets ?? [];
    const valuation = years.map((year) => {
      const ct = bucketsValuation.find((bucket) => bucket.key === year);
      return {
        count: ct?.doc_count ?? 0,
        name: 'valuation',
        y: ct?.financement_total?.value ?? 0,
        year,
      };
    });
    const series = [
      { color: getCSSValue('--hybrid'), data: waste, name: 'Waste' },
      {
        color: getCSSValue('--yellow-medium-100'),
        data: valuation,
        name: 'Valuation',
      },
    ];
    return { dataGraph: { categories: years, series } };
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
  }, [studyType]);

  return { allData, isError, isLoading };
}
export default useGetData;
