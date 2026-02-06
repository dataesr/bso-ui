import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getObservationLabel,
} from '../../../../../utils/helpers';

function useGetData(studyType, filterOnDrug = false) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const observationSnaps = ['2022Q4', '2023Q4', '2024Q4', '2025Q4'].sort();
  const years10Max = 2023;
  const years10Min = 2014;
  const years3Max = 2021;
  const years3Min = 2015;

  async function getDataAxios() {
    const queries = [];
    observationSnaps.forEach((observationSnap) => {
      const queryHasResults = getFetchOptions({
        key: 'studiesDynamiqueOuverture',
        parameters: [studyType, years10Min, years10Max, observationSnap],
        objectType: ['clinicalTrials'],
      });
      const queryHasResultsWithin3Years = getFetchOptions({
        key: 'studiesDynamiqueOuvertureWithin3Years',
        parameters: [studyType, years3Min, years3Max, observationSnap],
        objectType: ['clinicalTrials'],
      });
      if (filterOnDrug) {
        queryHasResults.query.bool.filter.push({
          term: { 'intervention_type.keyword': 'DRUG' },
        });
        queryHasResultsWithin3Years.query.bool.filter.push({
          term: { 'intervention_type.keyword': 'DRUG' },
        });
      }
      queries.push(
        Axios.post(ES_STUDIES_API_URL, queryHasResultsWithin3Years, HEADERS),
      );
    });
    const results = await Axios.all(queries);

    const categories = [];
    const seriesWithin3Years = [{ data: [] }];
    const seriesWithin3YearsAcademic = [{ data: [] }];
    observationSnaps.forEach((observationSnap, index) => {
      categories.push(getObservationLabel(observationSnap, intl));
      const dataHasResultsWithin3Years = results[index].data.aggregations;
      const dataHasResultsWithin3YearsAcademic = dataHasResultsWithin3Years.by_sponsor_type.buckets.find(
        (ele) => ele.key === 'academique',
      );
      const dataHasResultsWithin3YearsAcademicWithResults = dataHasResultsWithin3YearsAcademic?.by_has_results_within_3_years.buckets.find(
        (ele) => ele.key === 1,
      );
      const dataHasResultsWithin3YearsAcademicWithResultsLastYear = dataHasResultsWithin3YearsAcademicWithResults?.by_completion_year.buckets.find(
        (ele) => ele.key === years3Max,
      );
      const dataHasResultsWithin3YearsAcademicWithoutResults = dataHasResultsWithin3YearsAcademic?.by_has_results_within_3_years.buckets.find(
        (ele) => ele.key === 0,
      );
      const dataHasResultsWithin3YearsAcademicWithoutResultsLastYear = dataHasResultsWithin3YearsAcademicWithoutResults?.by_completion_year.buckets.find(
        (ele) => ele.key === years3Max,
      );
      const dataHasResultsWithin3YearsAcademicLastYearCount = (dataHasResultsWithin3YearsAcademicWithResultsLastYear?.doc_count
          || 0)
        + (dataHasResultsWithin3YearsAcademicWithoutResultsLastYear?.doc_count
          || 0);
      const dataHasResultsWithin3YearsIndustrial = dataHasResultsWithin3Years.by_sponsor_type.buckets.find(
        (ele) => ele.key === 'industriel',
      );
      const dataHasResultsWithin3YearsIndustrialWithResults = dataHasResultsWithin3YearsIndustrial?.by_has_results_within_3_years.buckets.find(
        (el) => el.key === 1,
      );
      const dataHasResultsWithin3YearsIndustrialWithResultsLastYear = dataHasResultsWithin3YearsIndustrialWithResults?.by_completion_year.buckets.find(
        (ele) => ele.key === years3Max,
      );
      const dataHasResultsWithin3YearsIndustrialWithoutResults = dataHasResultsWithin3YearsIndustrial?.by_has_results_within_3_years.buckets.find(
        (el) => el.key === 0,
      );
      const dataHasResultsWithin3YearsIndustrialWithoutResultsLastYear = dataHasResultsWithin3YearsIndustrialWithoutResults?.by_completion_year.buckets.find(
        (ele) => ele.key === years3Max,
      );
      const dataHasResultsWithin3YearsIndustrialCount = (dataHasResultsWithin3YearsIndustrialWithResultsLastYear?.doc_count
          || 0)
        + (dataHasResultsWithin3YearsIndustrialWithoutResultsLastYear?.doc_count
          || 0);

      const allLeadSponsorRate3 = 100
        * ((dataHasResultsWithin3YearsAcademicWithResultsLastYear?.doc_count
          + dataHasResultsWithin3YearsIndustrialWithResultsLastYear?.doc_count)
          / (dataHasResultsWithin3YearsAcademicLastYearCount
            + dataHasResultsWithin3YearsIndustrialCount));
      seriesWithin3Years[0].data.push({
        color: getCSSValue('--blue-soft-100'),
        name: capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
        observationSnap,
        observationSnapLabel: `${intl.formatMessage({
          id: 'app.observedin',
        })} ${getObservationLabel(observationSnap, intl)}`,
        y: allLeadSponsorRate3,
        y_abs:
          (dataHasResultsWithin3YearsAcademicWithResultsLastYear?.doc_count
            ?? 0)
          + (dataHasResultsWithin3YearsIndustrialWithResultsLastYear?.doc_count
            ?? 0),
        y_tot:
          dataHasResultsWithin3YearsAcademicLastYearCount
          + dataHasResultsWithin3YearsIndustrialCount,
        yearMax: years3Max,
      });
      const publicLeadSponsorsRate3 = 100
        * ((dataHasResultsWithin3YearsAcademicWithResultsLastYear?.doc_count
          ?? 0)
          / dataHasResultsWithin3YearsAcademicLastYearCount);
      seriesWithin3YearsAcademic[0].data.push({
        color: getCSSValue('--lead-sponsor-public'),
        name: getObservationLabel(observationSnap, intl),
        observationSnap,
        observationSnapLabel: `${intl.formatMessage({
          id: 'app.observedin',
        })} ${getObservationLabel(observationSnap, intl)}`,
        y: publicLeadSponsorsRate3,
        y_abs:
          dataHasResultsWithin3YearsAcademicWithResultsLastYear?.doc_count ?? 0,
        y_tot: dataHasResultsWithin3YearsAcademicLastYearCount,
        yearMax: years3Max,
      });
      // const privateLeadSponsorsRate3 = 100
      //   * ((dataHasResultsWithin3YearsIndustrialWithResultsLastYear?.doc_count
      //     ?? 0)
      //     / dataHasResultsWithin3YearsIndustrialCount);
      // dataWithin3Years.push({
      //   color: getCSSValue('--lead-sponsor-privee'),
      //   name: capitalize(intl.formatMessage({ id: 'app.sponsor.industriel' })),
      //   observationSnap,
      //   observationSnapLabel: `${intl.formatMessage({
      //     id: 'app.observedin',
      //   })} ${getObservationLabel(observationSnap, intl)}`,
      //   y: privateLeadSponsorsRate3,
      //   y_abs:
      //     dataHasResultsWithin3YearsIndustrialWithResultsLastYear?.doc_count
      //     ?? 0,
      //   y_tot: dataHasResultsWithin3YearsIndustrialCount,
      //   yearMax: years3Max,
      // });
    });

    const dataGraphWithin3Years = { categories, series: seriesWithin3Years };
    const dataGraphWithin3YearsAcademic = {
      categories,
      series: seriesWithin3YearsAcademic,
    };
    const dataTitleWithin3Years = {
      year: parseInt(observationSnaps[0].substring(0, 4), 10) - 3,
    };

    return {
      dataGraphWithin3Years,
      dataGraphWithin3YearsAcademic,
      dataTitleWithin3Years,
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
  }, [studyType]);

  return { allData, isError, isLoading };
}
export default useGetData;
