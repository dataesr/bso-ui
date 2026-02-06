import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType) {
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const observationSnaps = ['2025Q1', '2026Q1'].sort();

  async function getDataAxios() {
    const currentYear = parseInt(
      process.env.REACT_APP_LAST_OBSERVATION_CLINICAL_TRIALS.substring(0, 4),
      10,
    );
    const yearMin = 2018;
    const yearMax = currentYear - 1;
    const queries = [];
    observationSnaps.forEach((observationSnap) => {
      const queryWaste = getFetchOptions({
        key: 'wasteByYear',
        parameters: [studyType, yearMin, yearMax, false, observationSnap],
        objectType: ['clinicalTrials'],
      });
      queries.push(Axios.post(ES_STUDIES_API_URL, queryWaste, HEADERS));
      const queryValuation = getFetchOptions({
        key: 'wasteByYear',
        parameters: [studyType, yearMin, yearMax, true, observationSnap],
        objectType: ['clinicalTrials'],
      });
      queries.push(Axios.post(ES_STUDIES_API_URL, queryValuation, HEADERS));
    });
    const results = await Axios.all(queries);
    const series = [];
    const categories = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];

    for (let i = 0; i < results.length; i += 2) {
      const bucketsWaste = results?.[i]?.data?.aggregations?.by_year?.buckets ?? [];
      const years = bucketsWaste.map((bucket) => bucket.key);
      const waste = years.map((year) => {
        const ct = bucketsWaste.find((bucket) => bucket.key === year);
        return {
          count: ct?.doc_count ?? 0,
          y: ct?.financement_total?.value ?? 0,
          year,
        };
      });
      const bucketsValuation = results?.[i + 1]?.data?.aggregations?.by_year?.buckets ?? [];
      const valuation = years.map((year) => {
        const ct = bucketsValuation.find((bucket) => bucket.key === year);
        return {
          count: ct?.doc_count ?? 0,
          y: ct?.financement_total?.value ?? 0,
          year,
        };
      });
      series.push({
        color: getCSSValue('--hybrid'),
        data: waste,
        name: `Gaspillage ${i === 0 ? 'avant' : 'après'} le courrier`,
        stack: i === 0 ? 'before' : 'after',
        stackLabel: i === 0 ? 'Avant le courrier' : 'Après le courrier',
      });
      series.push({
        color: getCSSValue('--yellow-medium-100'),
        data: valuation,
        name: `Valorisation ${i === 0 ? 'avant' : 'après'} le courrier`,
        stack: i === 0 ? 'before' : 'after',
        stackLabel: i === 0 ? 'Avant le courrier' : 'Après le courrier',
      });
    }

    return { dataGraph: { categories, series } };
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
