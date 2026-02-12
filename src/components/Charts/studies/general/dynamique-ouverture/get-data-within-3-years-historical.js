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

function useGetData(studyType, sponsorType = '*', selectedDelay = '3y', filterOnDrug = false) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const observationSnaps = ['2022Q4', '2023Q4', '2024Q4', '2025Q4'].sort();
  const lastObservationYear = parseInt(
    process.env.REACT_APP_LAST_OBSERVATION_CLINICAL_TRIALS.substring(0, 4),
    10,
  );
  const years10Max = lastObservationYear - 1;
  const years10Min = years10Max - 9;
  const year = 2019;

  async function getDataAxios() {
    // Sponsor types
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

    let queryKey = 'studiesDynamiqueOuvertureWithin3Years';
    let responseField = 'by_has_results_within_3_years';
    if (selectedDelay === '1y') {
      queryKey = 'studiesDynamiqueOuvertureWithin1Year';
      responseField = 'by_has_results_within_1_year';
    }
    const queries = [];
    observationSnaps.forEach((observationSnap) => {
      const queryHasResults = getFetchOptions({
        key: 'studiesDynamiqueOuverture',
        parameters: [studyType, years10Min, years10Max, observationSnap],
        objectType: ['clinicalTrials'],
      });
      const queryHasResultsWithin3Years = getFetchOptions({
        key: queryKey,
        parameters: [studyType, sponsorType, year, year, observationSnap],
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
    const seriesWithin3Years = [{
      data: [],
      delay: intl.formatMessage({ id: `app.sponsor-results-delay-${selectedDelay}` }),
      name: intl.formatMessage({ id: 'app.all-sponsors' }).toLowerCase(),
    }];
    const seriesWithin3YearsAcademic = [{
      data: [],
      delay: intl.formatMessage({ id: `app.sponsor-results-delay-${selectedDelay}` }),
      name: intl.formatMessage({ id: 'app.sponsors.academique' }).toLowerCase(),
    }];
    const seriesWithin3YearsIndustrial = [{
      data: [],
      delay: intl.formatMessage({ id: `app.sponsor-results-delay-${selectedDelay}` }),
      name: intl.formatMessage({ id: 'app.sponsors.industriel' }).toLowerCase(),
    }];
    observationSnaps.forEach((observationSnap, index) => {
      categories.push(getObservationLabel(observationSnap, intl));
      const dataHasResultsWithin3Years = results[index].data.aggregations;
      const dataHasResultsWithin3YearsAcademic = dataHasResultsWithin3Years.by_sponsor_type.buckets.find(
        (ele) => ele.key === 'academique',
      );
      const dataHasResultsWithin3YearsAcademicWithResults = dataHasResultsWithin3YearsAcademic?.[responseField].buckets.find(
        (ele) => ele.key === 1,
      );
      const dataHasResultsWithin3YearsAcademicWithResultsLastYear = dataHasResultsWithin3YearsAcademicWithResults?.by_completion_year.buckets.find(
        (ele) => ele.key === year,
      );
      const dataHasResultsWithin3YearsAcademicWithoutResults = dataHasResultsWithin3YearsAcademic?.[responseField].buckets.find(
        (ele) => ele.key === 0,
      );
      const dataHasResultsWithin3YearsAcademicWithoutResultsLastYear = dataHasResultsWithin3YearsAcademicWithoutResults?.by_completion_year.buckets.find(
        (ele) => ele.key === year,
      );
      const dataHasResultsWithin3YearsAcademicLastYearCount = (dataHasResultsWithin3YearsAcademicWithResultsLastYear?.doc_count
          || 0)
        + (dataHasResultsWithin3YearsAcademicWithoutResultsLastYear?.doc_count
          || 0);
      const dataHasResultsWithin3YearsIndustrial = dataHasResultsWithin3Years.by_sponsor_type.buckets.find(
        (ele) => ele.key === 'industriel',
      );
      const dataHasResultsWithin3YearsIndustrialWithResults = dataHasResultsWithin3YearsIndustrial?.[responseField].buckets.find(
        (el) => el.key === 1,
      );
      const dataHasResultsWithin3YearsIndustrialWithResultsLastYear = dataHasResultsWithin3YearsIndustrialWithResults?.by_completion_year.buckets.find(
        (ele) => ele.key === year,
      );
      const dataHasResultsWithin3YearsIndustrialWithoutResults = dataHasResultsWithin3YearsIndustrial?.[responseField].buckets.find(
        (el) => el.key === 0,
      );
      const dataHasResultsWithin3YearsIndustrialWithoutResultsLastYear = dataHasResultsWithin3YearsIndustrialWithoutResults?.by_completion_year.buckets.find(
        (ele) => ele.key === year,
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
        yearMax: year,
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
        yearMax: year,
      });
      const privateLeadSponsorsRate3 = 100
        * ((dataHasResultsWithin3YearsIndustrialWithResultsLastYear?.doc_count
          ?? 0)
          / dataHasResultsWithin3YearsIndustrialCount);
      seriesWithin3YearsIndustrial[0].data.push({
        color: getCSSValue('--lead-sponsor-privee'),
        name: capitalize(intl.formatMessage({ id: 'app.sponsor.industriel' })),
        observationSnap,
        observationSnapLabel: `${intl.formatMessage({
          id: 'app.observedin',
        })} ${getObservationLabel(observationSnap, intl)}`,
        y: privateLeadSponsorsRate3,
        y_abs:
          dataHasResultsWithin3YearsIndustrialWithResultsLastYear?.doc_count
          ?? 0,
        y_tot: dataHasResultsWithin3YearsIndustrialCount,
        yearMax: year,
      });
    });

    const dataGraphWithin3Years = { categories, series: seriesWithin3Years };
    const dataGraphWithin3YearsAcademic = {
      categories,
      series: seriesWithin3YearsAcademic,
    };
    const dataGraphWithin3YearsIndustrial = {
      categories,
      series: seriesWithin3YearsIndustrial,
    };
    let dataGraphWithin3YearsWithType;
    switch (sponsorType) {
    case 'academique':
      dataGraphWithin3YearsWithType = dataGraphWithin3YearsAcademic;
      break;
    case 'industriel':
      dataGraphWithin3YearsWithType = dataGraphWithin3YearsIndustrial;
      break;
    default:
      dataGraphWithin3YearsWithType = dataGraphWithin3Years;
    }

    return {
      dataGraphWithin3Years,
      dataGraphWithin3YearsAcademic,
      dataGraphWithin3YearsIndustrial,
      dataGraphWithin3YearsWithType,
      sponsorTypes,
      year,
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
  }, [studyType, sponsorType, selectedDelay]);

  return { allData, isError, isLoading };
}
export default useGetData;
