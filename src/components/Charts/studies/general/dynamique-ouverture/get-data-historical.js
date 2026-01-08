import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType, sponsor = '*', filterOnDrug = false) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const observationSnaps = ['2023Q4', '2024Q4', '2025Q1', '2025Q4']?.sort();

  async function getDataAxios() {
    // Create sponsors list
    const currentYear = parseInt(
      process.env.REACT_APP_LAST_OBSERVATION_CLINICAL_TRIALS.substring(0, 4),
      10,
    );
    const years10Max = currentYear - 1;
    const years10Min = years10Max - 9;
    const querySponsorsList = getFetchOptions({
      key: 'sponsorsList',
      parameters: [studyType, years10Min, years10Max],
      objectType: ['clinicalTrials'],
    });
    const resultsSponsorsList = await Axios.post(
      ES_STUDIES_API_URL,
      querySponsorsList,
      HEADERS,
    );
    const sponsors = resultsSponsorsList.data.aggregations.by_sponsor.buckets.map((item) => ({
      value: item.key,
      label: item.key,
    }));

    const queries = [];
    const queriesSponsor = [];
    observationSnaps.forEach((observationSnap) => {
      const quarter = observationSnap.substring(4, 6);
      let years3Max = parseInt(observationSnap.substring(0, 4), 10) - 3;
      if (quarter !== 'Q4') {
        years3Max = parseInt(observationSnap.substring(0, 4), 10) - 4;
      }
      const years3Min = years3Max - 6;
      const queryHasResultsWithin3Years = getFetchOptions({
        key: 'studiesDynamiqueOuvertureWithin3Years',
        parameters: [studyType, years3Min, years3Max, observationSnap],
        objectType: ['clinicalTrials'],
      });
      if (filterOnDrug) {
        queryHasResultsWithin3Years.query.bool.filter.push({
          term: { 'intervention_type.keyword': 'DRUG' },
        });
      }
      queries.push(
        Axios.post(ES_STUDIES_API_URL, queryHasResultsWithin3Years, HEADERS),
      );
      const queryHasResultsWithin3YearsSponsor = getFetchOptions({
        key: 'studiesDynamiqueOuvertureWithin3YearsSponsor',
        parameters: [studyType, sponsor, years3Min, years3Max, observationSnap],
        objectType: ['clinicalTrials'],
      });
      if (filterOnDrug) {
        queryHasResultsWithin3YearsSponsor.query.bool.filter.push({
          term: { 'intervention_type.keyword': 'DRUG' },
        });
      }
      queriesSponsor.push(
        Axios.post(
          ES_STUDIES_API_URL,
          queryHasResultsWithin3YearsSponsor,
          HEADERS,
        ),
      );
    });
    const results = await Axios.all(queries);
    const resultsSponsor = await Axios.all(queriesSponsor);

    const categories = [
      capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
      capitalize(intl.formatMessage({ id: 'app.sponsor.industriel' })),
      capitalize(intl.formatMessage({ id: 'app.sponsor.academique' })),
    ];

    const series = [];
    observationSnaps.forEach((observationSnap, index) => {
      const quarter = observationSnap.substring(4, 6);
      let years3Max = parseInt(observationSnap.substring(0, 4), 10) - 3;
      if (quarter !== 'Q4') {
        years3Max = parseInt(observationSnap.substring(0, 4), 10) - 4;
      }
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
      const data = [];
      data.push({
        color: getCSSValue('--blue-soft-100'),
        name: intl.formatMessage({ id: 'app.all-sponsor-types' }),
        observationSnap,
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
      data.push({
        color: getCSSValue('--lead-sponsor-public'),
        name: intl.formatMessage({ id: 'app.sponsor.academique' }),
        observationSnap,
        y: publicLeadSponsorsRate3,
        y_abs:
          dataHasResultsWithin3YearsAcademicWithResultsLastYear?.doc_count ?? 0,
        y_tot: dataHasResultsWithin3YearsAcademicLastYearCount,
        yearMax: years3Max,
      });
      const privateLeadSponsorsRate3 = 100
        * ((dataHasResultsWithin3YearsIndustrialWithResultsLastYear?.doc_count
          ?? 0)
          / dataHasResultsWithin3YearsIndustrialCount);
      data.push({
        color: getCSSValue('--lead-sponsor-privee'),
        name: intl.formatMessage({ id: 'app.sponsor.industriel' }),
        observationSnap,
        y: privateLeadSponsorsRate3,
        y_abs:
          dataHasResultsWithin3YearsIndustrialWithResultsLastYear?.doc_count
          ?? 0,
        y_tot: dataHasResultsWithin3YearsIndustrialCount,
        yearMax: years3Max,
      });
      if (sponsor !== '*') {
        const dataHasResultsWithin3YearsSponsor = resultsSponsor[index].data.aggregations;
        const dataHasResultsWithin3YearsAcademicSponsor = dataHasResultsWithin3YearsSponsor.by_sponsor_type.buckets.find(
          (ele) => ele.key === 'academique',
        );
        const dataHasResultsWithin3YearsAcademicWithResultsSponsor = dataHasResultsWithin3YearsAcademicSponsor?.by_has_results_within_3_years.buckets.find(
          (ele) => ele.key === 1,
        );
        const dataHasResultsWithin3YearsAcademicWithResultsLastYearSponsor = dataHasResultsWithin3YearsAcademicWithResultsSponsor?.by_completion_year.buckets.find(
          (ele) => ele.key === years3Max,
        );
        const dataHasResultsWithin3YearsAcademicWithoutResultsSponsor = dataHasResultsWithin3YearsAcademicSponsor?.by_has_results_within_3_years.buckets.find(
          (ele) => ele.key === 0,
        );
        const dataHasResultsWithin3YearsAcademicWithoutResultsLastYearSponsor = dataHasResultsWithin3YearsAcademicWithoutResultsSponsor?.by_completion_year.buckets.find(
          (ele) => ele.key === years3Max,
        );
        const dataHasResultsWithin3YearsAcademicLastYearCountSponsor = (dataHasResultsWithin3YearsAcademicWithResultsLastYearSponsor?.doc_count
            || 0)
          + (dataHasResultsWithin3YearsAcademicWithoutResultsLastYearSponsor?.doc_count
            || 0);

        const publicLeadSponsorsRate3Sponsor = 100
          * ((dataHasResultsWithin3YearsAcademicWithResultsLastYearSponsor?.doc_count
            ?? 0)
            / dataHasResultsWithin3YearsAcademicLastYearCountSponsor);
        data.push({
          color: getCSSValue('--lead-sponsor-highlight'),
          name: sponsor,
          observationSnap,
          y: publicLeadSponsorsRate3Sponsor,
          y_abs:
            dataHasResultsWithin3YearsAcademicWithResultsLastYearSponsor?.doc_count
            ?? 0,
          y_tot: dataHasResultsWithin3YearsAcademicLastYearCountSponsor,
          yearMax: years3Max,
        });
      }
      series.push({ name: observationSnap, data });
      categories.push(sponsor);
    });
    const dataGraph = { categories, series };

    return {
      dataGraph,
      sponsors,
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
  }, [studyType, sponsor]);

  return { allData, isError, isLoading };
}
export default useGetData;
