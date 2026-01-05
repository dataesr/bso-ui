import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType, sponsor = '*', filterOnDrug = false) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  async function getDataAxios() {
    const queries = [];
    const currentYear = parseInt(
      process.env.REACT_APP_LAST_OBSERVATION_CLINICAL_TRIALS.substring(0, 4),
      10,
    );
    const observationSnap = process.env.REACT_APP_LAST_OBSERVATION_CLINICAL_TRIALS;
    const years10Max = currentYear - 1;
    const years10Min = years10Max - 9;
    const years3Max = currentYear - 3;
    const years3Min = years3Max - 6;

    const querySponsorsList = getFetchOptions({
      key: 'sponsorsList',
      parameters: [studyType, years10Min, years10Max],
      objectType: ['clinicalTrials'],
    });
    const queryHasResults = getFetchOptions({
      key: 'studiesDynamiqueOuverture',
      parameters: [studyType, years10Min, years10Max],
      objectType: ['clinicalTrials'],
    });
    const queryHasResultsFilterBySponsor = getFetchOptions({
      key: 'studiesDynamiqueOuvertureSponsor',
      parameters: [studyType, sponsor, years10Min, years10Max],
      objectType: ['clinicalTrials'],
    });
    const queryHasResultsWithin3Years = getFetchOptions({
      key: 'studiesDynamiqueOuvertureWithin3Years',
      parameters: [studyType, years3Min, years3Max, observationSnap],
      objectType: ['clinicalTrials'],
    });
    const queryHasResultsWithin1Year = getFetchOptions({
      key: 'studiesDynamiqueOuvertureWithin1Year',
      parameters: [studyType, years10Min, years10Max],
      objectType: ['clinicalTrials'],
    });
    if (filterOnDrug) {
      queryHasResults.query.bool.filter.push({
        term: { 'intervention_type.keyword': 'DRUG' },
      });
      queryHasResultsFilterBySponsor.query.bool.filter.push({
        term: { 'intervention_type.keyword': 'DRUG' },
      });
      queryHasResultsWithin3Years.query.bool.filter.push({
        term: { 'intervention_type.keyword': 'DRUG' },
      });
      queryHasResultsWithin1Year.query.bool.filter.push({
        term: { 'intervention_type.keyword': 'DRUG' },
      });
    }
    queries.push(Axios.post(ES_STUDIES_API_URL, querySponsorsList, HEADERS));
    queries.push(Axios.post(ES_STUDIES_API_URL, queryHasResults, HEADERS));
    queries.push(
      Axios.post(ES_STUDIES_API_URL, queryHasResultsFilterBySponsor, HEADERS),
    );
    queries.push(
      Axios.post(ES_STUDIES_API_URL, queryHasResultsWithin3Years, HEADERS),
    );
    queries.push(
      Axios.post(ES_STUDIES_API_URL, queryHasResultsWithin1Year, HEADERS),
    );
    const series1 = [{ data: [] }];
    const series3 = [{ data: [] }];
    const series4 = [{ data: [] }];
    const results = await Axios.all(queries);
    const sponsors = results[0].data.aggregations.by_sponsor.buckets.map(
      (item) => ({
        value: item.key,
        label: item.key,
      }),
    );
    const dataHasResults = results[1].data.aggregations;
    const dataHasResultsFilterBySponsor = results[2].data.aggregations;
    const dataHasResultsWithin3Years = results[3].data.aggregations;
    const dataHasResultsWithin1Year = results[4].data.aggregations;
    const dataHasResultsAcademic = dataHasResults.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'academique',
    );
    const dataHasResultsAcademicWithResults = dataHasResultsAcademic?.by_has_result.buckets.find(
      (ele) => ele.key === 1,
    );
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
    const dataHasResultsWithin3YearsAcademicLastYearCount = (dataHasResultsWithin3YearsAcademicWithResultsLastYear?.doc_count || 0)
      + (dataHasResultsWithin3YearsAcademicWithoutResultsLastYear?.doc_count
        || 0);
    const dataHasResultsWithin1YearAcademic = dataHasResultsWithin1Year.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'academique',
    );
    const dataHasResultsWithin1YearAcademicWithResults = dataHasResultsWithin1YearAcademic?.by_has_results_within_1_year.buckets.find(
      (ele) => ele.key === 1,
    );
    const dataHasResultsWithin1YearAcademicWithResultsLastYear = dataHasResultsWithin1YearAcademicWithResults?.by_completion_year.buckets.find(
      (ele) => ele.key === years10Max,
    );
    const dataHasResultsWithin1YearAcademicWithoutResults = dataHasResultsWithin1YearAcademic?.by_has_results_within_1_year.buckets.find(
      (ele) => ele.key === 0,
    );
    const dataHasResultsWithin1YearAcademicWithoutResultsLastYear = dataHasResultsWithin1YearAcademicWithoutResults?.by_completion_year.buckets.find(
      (ele) => ele.key === years10Max,
    );
    const academicTotalLastYear4 = (dataHasResultsWithin1YearAcademicWithResultsLastYear?.doc_count || 0)
      + (dataHasResultsWithin1YearAcademicWithoutResultsLastYear?.doc_count || 0);
    const dataHasResultsIndustrial = dataHasResults.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'industriel',
    );
    const dataHasResultsIndustrialWithResults = dataHasResultsIndustrial?.by_has_result.buckets.find(
      (el) => el.key === 1,
    );
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
    const dataHasResultsWithin1YearIndustrial = dataHasResultsWithin1Year.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'industriel',
    );
    const dataHasResultsWithin1YearIndustrialWithResults = dataHasResultsWithin1YearIndustrial?.by_has_results_within_1_year.buckets.find(
      (ele) => ele.key === 1,
    );
    const dataHasResultsWithin1YearIndustrialWithResultsLastYear = dataHasResultsWithin1YearIndustrialWithResults?.by_completion_year.buckets.find(
      (ele) => ele.key === years10Max,
    );
    const dataHasResultsWithin1YearIndustrialWithoutResults = dataHasResultsWithin1YearIndustrial?.by_has_results_within_1_year.buckets.find(
      (el) => el.key === 0,
    );
    const dataHasResultsWithin1YearIndustrialWithoutResultsLastYear = dataHasResultsWithin1YearIndustrialWithoutResults?.by_completion_year.buckets.find(
      (ele) => ele.key === years10Max,
    );
    const dataHasResultsWithin1YearIndustrialLastYearCount = (dataHasResultsWithin1YearIndustrialWithResultsLastYear?.doc_count || 0)
      + (dataHasResultsWithin1YearIndustrialWithoutResultsLastYear?.doc_count
        || 0);
    const dataHasResultsFilterBySponsorWithResults = dataHasResultsFilterBySponsor?.by_has_result.buckets.find(
      (el) => el.key === 1,
    );
    const dataHasResultsFilterBySponsorWithoutResults = dataHasResultsFilterBySponsor?.by_has_result.buckets.find(
      (ele) => ele.key === 0,
    );
    const categories = [
      capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
      capitalize(intl.formatMessage({ id: 'app.sponsor.industriel' })),
      capitalize(intl.formatMessage({ id: 'app.sponsor.academique' })),
    ];
    series1[0].data.push({
      color: getCSSValue('--blue-soft-100'),
      name: intl.formatMessage({ id: 'app.all-sponsor-types' }),
      y:
        100
        * ((dataHasResultsAcademicWithResults?.doc_count
          + dataHasResultsIndustrialWithResults?.doc_count)
          / (dataHasResultsAcademic?.doc_count
            + dataHasResultsIndustrial?.doc_count)),
      y_abs:
        (dataHasResultsAcademicWithResults?.doc_count ?? 0)
        + (dataHasResultsIndustrialWithResults?.doc_count ?? 0),
      y_tot:
        (dataHasResultsAcademic?.doc_count ?? 0)
        + (dataHasResultsIndustrial?.doc_count ?? 0),
      yearMax: years10Max,
      yearMin: years10Min,
    });
    series1[0].data.push({
      color: getCSSValue('--lead-sponsor-public'),
      name: intl.formatMessage({ id: 'app.sponsor.academique' }),
      y:
        100
        * ((dataHasResultsAcademicWithResults?.doc_count ?? 0)
          / dataHasResultsAcademic?.doc_count),
      y_abs: dataHasResultsAcademicWithResults?.doc_count ?? 0,
      y_tot: dataHasResultsAcademic?.doc_count ?? 0,
      yearMax: years10Max,
      yearMin: years10Min,
    });
    series1[0].data.push({
      color: getCSSValue('--lead-sponsor-privee'),
      name: intl.formatMessage({ id: 'app.sponsor.industriel' }),
      y:
        100
        * ((dataHasResultsIndustrialWithResults?.doc_count ?? 0)
          / dataHasResultsIndustrial?.doc_count),
      y_abs: dataHasResultsIndustrialWithResults?.doc_count ?? 0,
      y_tot: dataHasResultsIndustrial?.doc_count ?? 0,
      yearMax: years10Max,
      yearMin: years10Min,
    });
    const allLeadSponsorRate3 = 100
      * ((dataHasResultsWithin3YearsAcademicWithResultsLastYear?.doc_count
        + dataHasResultsWithin3YearsIndustrialWithResultsLastYear?.doc_count)
        / (dataHasResultsWithin3YearsAcademicLastYearCount
          + dataHasResultsWithin3YearsIndustrialCount));
    series3[0].data.push({
      color: getCSSValue('--blue-soft-100'),
      name: intl.formatMessage({ id: 'app.all-sponsor-types' }),
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
      * ((dataHasResultsWithin3YearsAcademicWithResultsLastYear?.doc_count ?? 0)
        / dataHasResultsWithin3YearsAcademicLastYearCount);
    series3[0].data.push({
      color: getCSSValue('--lead-sponsor-public'),
      name: intl.formatMessage({ id: 'app.sponsor.academique' }),
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
    series3[0].data.push({
      color: getCSSValue('--lead-sponsor-privee'),
      name: intl.formatMessage({ id: 'app.sponsor.industriel' }),
      y: privateLeadSponsorsRate3,
      y_abs:
        dataHasResultsWithin3YearsIndustrialWithResultsLastYear?.doc_count ?? 0,
      y_tot: dataHasResultsWithin3YearsIndustrialCount,
      yearMax: years3Max,
    });
    const allLeadSponsorRate4 = 100
      * ((dataHasResultsWithin1YearAcademicWithResultsLastYear?.doc_count
        + dataHasResultsWithin1YearIndustrialWithResultsLastYear?.doc_count)
        / (academicTotalLastYear4
          + dataHasResultsWithin1YearIndustrialLastYearCount));
    series4[0].data.push({
      color: getCSSValue('--blue-soft-100'),
      name: intl.formatMessage({ id: 'app.all-sponsor-types' }),
      y: allLeadSponsorRate4,
      y_abs:
        (dataHasResultsWithin1YearAcademicWithResultsLastYear?.doc_count ?? 0)
        + (dataHasResultsWithin1YearIndustrialWithResultsLastYear?.doc_count
          ?? 0),
      y_tot:
        academicTotalLastYear4
        + dataHasResultsWithin1YearIndustrialLastYearCount,
      yearMax: years10Max,
    });
    const publicLeadSponsorsRate4 = 100
      * ((dataHasResultsWithin1YearAcademicWithResultsLastYear?.doc_count ?? 0)
        / academicTotalLastYear4);
    series4[0].data.push({
      color: getCSSValue('--lead-sponsor-public'),
      name: intl.formatMessage({ id: 'app.sponsor.academique' }),
      y: publicLeadSponsorsRate4,
      y_abs:
        dataHasResultsWithin1YearAcademicWithResultsLastYear?.doc_count ?? 0,
      y_tot: academicTotalLastYear4,
      yearMax: years10Max,
    });
    const privateLeadSponsorsRate4 = 100
      * ((dataHasResultsWithin1YearIndustrialWithResultsLastYear?.doc_count
        ?? 0)
        / dataHasResultsWithin1YearIndustrialLastYearCount);
    series4[0].data.push({
      color: getCSSValue('--lead-sponsor-privee'),
      name: intl.formatMessage({ id: 'app.sponsor.industriel' }),
      y: privateLeadSponsorsRate4,
      y_abs:
        dataHasResultsWithin1YearIndustrialWithResultsLastYear?.doc_count ?? 0,
      y_tot: dataHasResultsWithin1YearIndustrialLastYearCount,
      yearMax: years10Max,
    });
    if (sponsor !== '*') {
      series1[0].data.push({
        color: getCSSValue('--lead-sponsor-highlight'),
        name: sponsor,
        y:
          100
          * ((dataHasResultsFilterBySponsorWithResults?.doc_count || 0)
            / ((dataHasResultsFilterBySponsorWithResults?.doc_count || 0)
              + (dataHasResultsFilterBySponsorWithoutResults?.doc_count || 0))),
        y_abs: dataHasResultsFilterBySponsorWithResults?.doc_count || 0,
        y_tot:
          (dataHasResultsFilterBySponsorWithResults?.doc_count || 0)
          + (dataHasResultsFilterBySponsorWithoutResults?.doc_count || 0),
        yearMax: years10Max,
        yearMin: years10Min,
      });
      series3[0].data.push({
        color: getCSSValue('--lead-sponsor-highlight'),
        name: sponsor,
        y:
          100
          * ((dataHasResultsFilterBySponsorWithResults?.doc_count ?? 0)
            / dataHasResultsFilterBySponsor?.doc_count),
        y_abs: dataHasResultsFilterBySponsorWithResults?.doc_count ?? 0,
        y_tot: dataHasResultsFilterBySponsor?.doc_count ?? 0,
        yearMax: years3Max,
        yearMin: years3Min,
      });
      series4[0].data.push({
        color: getCSSValue('--lead-sponsor-highlight'),
        name: sponsor,
        y:
          100
          * ((dataHasResultsFilterBySponsorWithResults?.doc_count ?? 0)
            / dataHasResultsFilterBySponsor?.doc_count),
        y_abs: dataHasResultsFilterBySponsorWithResults?.doc_count ?? 0,
        y_tot: dataHasResultsFilterBySponsor?.doc_count ?? 0,
        yearMax: years10Max,
      });
      categories.push(sponsor);
    }
    const dataGraph1 = { categories, series: series1 };
    const dataGraph3 = { categories, series: series3 };
    const dataGraph4 = { categories, series: series4 };

    const categories5 = dataHasResultsWithin3Years.by_sponsor_type.buckets[0].by_has_results_within_3_years.buckets[0].by_completion_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2010 && y.key <= currentYear)
      .map((item) => item.key);
    const academicData5 = [];
    const industrialData5 = [];
    const allTypesData5 = [];

    categories5.forEach((year) => {
      const academicDataWithResultsForYear = dataHasResultsWithin3YearsAcademicWithResults?.by_completion_year.buckets?.find(
        (item) => item.key === year,
      )?.doc_count ?? 0;
      const academicDataWithoutResultsForYear = dataHasResultsWithin3YearsAcademicWithoutResults?.by_completion_year.buckets?.find(
        (item) => item.key === year,
      )?.doc_count ?? 0;
      const industrialDataWithResultsForYear = dataHasResultsWithin3YearsIndustrialWithResults?.by_completion_year.buckets?.find(
        (item) => item.key === year,
      )?.doc_count ?? 0;
      const industrialDataWithoutResultsForYear = dataHasResultsWithin3YearsIndustrialWithoutResults?.by_completion_year.buckets?.find(
        (item) => item.key === year,
      )?.doc_count ?? 0;
      academicData5.push({
        y:
          100
          * (academicDataWithResultsForYear
            / (academicDataWithResultsForYear
              + academicDataWithoutResultsForYear)),
        y_abs: academicDataWithResultsForYear,
        y_tot:
          academicDataWithResultsForYear + academicDataWithoutResultsForYear,
        year,
      });
      industrialData5.push({
        year,
        y:
          100
          * (industrialDataWithResultsForYear
            / (industrialDataWithResultsForYear
              + industrialDataWithoutResultsForYear)),
        y_abs: industrialDataWithResultsForYear,
        y_tot:
          industrialDataWithResultsForYear
          + industrialDataWithoutResultsForYear,
        yearMax: years10Max,
        yearMin: years10Min,
      });
      allTypesData5.push({
        year,
        y:
          100
          * ((academicDataWithResultsForYear + industrialDataWithResultsForYear)
            / (academicDataWithResultsForYear
              + academicDataWithoutResultsForYear
              + industrialDataWithResultsForYear
              + industrialDataWithoutResultsForYear)),
        y_abs:
          academicDataWithResultsForYear + industrialDataWithResultsForYear,
        y_tot:
          academicDataWithResultsForYear
          + academicDataWithoutResultsForYear
          + industrialDataWithResultsForYear
          + industrialDataWithoutResultsForYear,
        yearMax: years10Max,
        yearMin: years10Min,
      });
    });

    const series5 = [
      {
        id: 'public',
        color: getCSSValue('--lead-sponsor-public'),
        data: academicData5,
        name: capitalize(intl.formatMessage({ id: 'app.sponsor.academique' })),
        pointPlacement: -0.2,
      },
      {
        id: 'prive',
        color: getCSSValue('--lead-sponsor-privee'),
        data: industrialData5,
        name: capitalize(intl.formatMessage({ id: 'app.sponsor.industriel' })),
      },
      {
        id: 'main',
        color: getCSSValue('--blue-soft-100'),
        data: allTypesData5,
        name: capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
        pointPlacement: 0.2,
      },
    ];
    const dataGraph5 = { categories: categories5, series: series5 };

    const categories6 = dataHasResultsWithin1Year.by_sponsor_type.buckets[0].by_has_results_within_1_year.buckets[0].by_completion_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2010 && y.key <= currentYear)
      .map((item) => item.key);
    const academic6 = dataHasResultsWithin1Year.by_sponsor_type.buckets.find(
      (item) => item.key === 'academique',
    );
    const academicData6 = [];
    const industrial6 = dataHasResultsWithin1Year.by_sponsor_type.buckets.find(
      (item) => item.key === 'industriel',
    );
    const industrialData6 = [];
    const allTypesData6 = [];

    categories6.forEach((year) => {
      const academicDataWithResultsForYear = academic6?.by_has_results_within_1_year?.buckets
        ?.find((item) => item.key === 1)
        ?.by_completion_year.buckets?.find((item) => item.key === year)
        ?.doc_count ?? 0;
      const academicDataWithoutResultsForYear = academic6?.by_has_results_within_1_year?.buckets
        ?.find((item) => item.key === 0)
        ?.by_completion_year.buckets?.find((item) => item.key === year)
        ?.doc_count ?? 0;
      const industrialDataWithResultsForYear = industrial6?.by_has_results_within_1_year?.buckets
        ?.find((item) => item.key === 1)
        ?.by_completion_year.buckets?.find((item) => item.key === year)
        ?.doc_count ?? 0;
      const industrialDataWithoutResultsForYear = industrial6?.by_has_results_within_1_year?.buckets
        ?.find((item) => item.key === 0)
        ?.by_completion_year.buckets?.find((item) => item.key === year)
        ?.doc_count ?? 0;
      academicData6.push({
        y:
          100
          * (academicDataWithResultsForYear
            / (academicDataWithResultsForYear
              + academicDataWithoutResultsForYear)),
        y_abs: academicDataWithResultsForYear,
        y_tot:
          academicDataWithResultsForYear + academicDataWithoutResultsForYear,
        year,
      });
      industrialData6.push({
        year,
        y:
          100
          * (industrialDataWithResultsForYear
            / (industrialDataWithResultsForYear
              + industrialDataWithoutResultsForYear)),
        y_abs: industrialDataWithResultsForYear,
        y_tot:
          industrialDataWithResultsForYear
          + industrialDataWithoutResultsForYear,
        yearMax: years10Max,
        yearMin: years10Min,
      });
      allTypesData6.push({
        year,
        y:
          100
          * ((academicDataWithResultsForYear + industrialDataWithResultsForYear)
            / (academicDataWithResultsForYear
              + academicDataWithoutResultsForYear
              + industrialDataWithResultsForYear
              + industrialDataWithoutResultsForYear)),
        y_abs:
          academicDataWithResultsForYear + industrialDataWithResultsForYear,
        y_tot:
          academicDataWithResultsForYear
          + academicDataWithoutResultsForYear
          + industrialDataWithResultsForYear
          + industrialDataWithoutResultsForYear,
        yearMax: years10Max,
        yearMin: years10Min,
      });
    });

    const series6 = [
      {
        id: 'public',
        color: getCSSValue('--lead-sponsor-public'),
        data: academicData6,
        name: capitalize(intl.formatMessage({ id: 'app.sponsor.academique' })),
        pointPlacement: -0.2,
      },
      {
        id: 'prive',
        color: getCSSValue('--lead-sponsor-privee'),
        data: industrialData6,
        name: capitalize(intl.formatMessage({ id: 'app.sponsor.industriel' })),
      },
      {
        id: 'main',
        color: getCSSValue('--blue-soft-100'),
        data: allTypesData6,
        name: capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
        pointPlacement: 0.2,
      },
    ];
    const dataGraph6 = { categories: categories6, series: series6 };

    let allLeadSponsorRate = '';
    let privateLeadSponsorsRate = '';
    let publicLeadSponsorsRate = '';
    if (dataGraph1) {
      const data = dataGraph1?.series[0]?.data;
      const allLeadSponsorLabel = intl.formatMessage({
        id: 'app.all-sponsor-types',
      });
      const privateLeadSponsorsLabel = intl.formatMessage({
        id: 'app.sponsor.industriel',
      });
      const publicLeadSponsorsLabel = intl.formatMessage({
        id: 'app.sponsor.academique',
      });
      allLeadSponsorRate = data
        ?.find((item) => item.name === allLeadSponsorLabel)
        ?.y?.toFixed(0);
      privateLeadSponsorsRate = data
        ?.find((item) => item.name === privateLeadSponsorsLabel)
        ?.y?.toFixed(0);
      publicLeadSponsorsRate = data
        ?.find((item) => item.name === publicLeadSponsorsLabel)
        ?.y?.toFixed(0);
    }

    const comments = {
      allLeadSponsorRate,
      allLeadSponsorRate3: allLeadSponsorRate3.toFixed(0),
      allLeadSponsorRate4: allLeadSponsorRate4.toFixed(0),
      privateLeadSponsorsRate,
      privateLeadSponsorsRate3: privateLeadSponsorsRate3.toFixed(0),
      privateLeadSponsorsRate4: privateLeadSponsorsRate4.toFixed(0),
      publicLeadSponsorsRate,
      publicLeadSponsorsRate3: publicLeadSponsorsRate3.toFixed(0),
      publicLeadSponsorsRate4: publicLeadSponsorsRate4.toFixed(0),
      yearMax: years10Max,
      yearMin2: years3Min,
      yearMax2: years3Max,
    };

    return {
      comments,
      dataGraph1,
      dataGraph3,
      dataGraph4,
      dataGraph5,
      dataGraph6,
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
