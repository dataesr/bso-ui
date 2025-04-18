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
      process.env.REACT_APP_LAST_OBSERVATION.substring(0, 4),
      10,
    );
    const yearMax = currentYear - 1;
    const yearMin = yearMax - 10;
    const yearMax2 = currentYear - 3;
    const yearMin2 = yearMax2 - 6;
    const query1 = getFetchOptions({
      key: 'studiesDynamiqueOuverture',
      parameters: [studyType, yearMin, yearMax],
      objectType: ['clinicalTrials'],
    });
    const query2 = getFetchOptions({
      key: 'studiesDynamiqueOuvertureSponsor',
      parameters: [studyType, sponsor, yearMin, yearMax],
      objectType: ['clinicalTrials'],
    });
    const query3 = getFetchOptions({
      key: 'studiesDynamiqueOuvertureWithin3Years',
      parameters: [studyType, yearMin2, yearMax2],
      objectType: ['clinicalTrials'],
    });
    const query4 = getFetchOptions({
      key: 'studiesDynamiqueOuvertureWithin1Year',
      parameters: [studyType, yearMin, yearMax],
      objectType: ['clinicalTrials'],
    });
    if (filterOnDrug) {
      query1.query.bool.filter.push({
        term: { 'intervention_type.keyword': 'DRUG' },
      });
      query2.query.bool.filter.push({
        term: { 'intervention_type.keyword': 'DRUG' },
      });
      query3.query.bool.filter.push({
        term: { 'intervention_type.keyword': 'DRUG' },
      });
      query4.query.bool.filter.push({
        term: { 'intervention_type.keyword': 'DRUG' },
      });
    }
    queries.push(Axios.post(ES_STUDIES_API_URL, query1, HEADERS));
    queries.push(Axios.post(ES_STUDIES_API_URL, query2, HEADERS));
    queries.push(Axios.post(ES_STUDIES_API_URL, query3, HEADERS));
    queries.push(Axios.post(ES_STUDIES_API_URL, query4, HEADERS));
    const series1 = [{ data: [] }];
    const series3 = [{ data: [] }];
    const series4 = [{ data: [] }];
    const res = await Axios.all(queries);
    const data1 = res[0].data.aggregations;
    const data2 = res[1].data.aggregations;
    const data3 = res[2].data.aggregations;
    const data4 = res[3].data.aggregations;
    // TODO rename data4 refers to 1Y, should be data1Y etc ...
    const academic1 = data1.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'academique',
    );
    const academicWith = academic1?.by_has_result.buckets.find(
      (ele) => ele.key === 1,
    );
    const academic3 = data3.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'academique',
    );
    const academicWith3 = academic3?.by_has_results_within_3_years.buckets
      .find((ele) => ele.key === 1)
      ?.by_completion_year.buckets.find((ele) => ele.key === yearMax2);
    const academicWithout3 = academic3?.by_has_results_within_3_years.buckets
      .find((ele) => ele.key === 0)
      ?.by_completion_year.buckets.find((ele) => ele.key === yearMax2);
    const academicTotal3 = (academicWith3?.doc_count || 0) + (academicWithout3?.doc_count || 0);
    const academic4 = data4.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'academique',
    );
    const academicWith4 = academic4?.by_has_results_within_1_year.buckets
      .find((ele) => ele.key === 1)
      ?.by_completion_year.buckets.find((ele) => ele.key === yearMax);
    const academicWithout4 = academic4?.by_has_results_within_1_year.buckets
      .find((ele) => ele.key === 0)
      ?.by_completion_year.buckets.find((ele) => ele.key === yearMax);
    const academicTotal4 = (academicWith4?.doc_count || 0) + (academicWithout4?.doc_count || 0);
    const indus = data1.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'industriel',
    );
    const indusWith = indus?.by_has_result.buckets.find((el) => el.key === 1);
    const indus3 = data3.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'industriel',
    );
    const indusWith3 = indus3?.by_has_results_within_3_years.buckets
      .find((el) => el.key === 1)
      ?.by_completion_year.buckets.find((ele) => ele.key === yearMax2);
    const indusWithout3 = indus3?.by_has_results_within_3_years.buckets
      .find((el) => el.key === 0)
      ?.by_completion_year.buckets.find((ele) => ele.key === yearMax2);
    const indusTotal3 = (indusWith3?.doc_count || 0) + (indusWithout3?.doc_count || 0);
    const indus4 = data4.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'industriel',
    );
    const indusWith4 = indus4?.by_has_results_within_1_year.buckets
      .find((el) => el.key === 1)
      ?.by_completion_year.buckets.find((ele) => ele.key === yearMax);
    const indusWithout4 = indus4?.by_has_results_within_1_year.buckets
      .find((el) => el.key === 0)
      ?.by_completion_year.buckets.find((ele) => ele.key === yearMax);
    const indusTotal4 = (indusWith4?.doc_count || 0) + (indusWithout4?.doc_count || 0);
    const spons = data2;
    const sponsWith = spons?.by_has_result.buckets.find((el) => el.key === 1);
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
        * ((academicWith?.doc_count + indusWith?.doc_count)
          / (academic1?.doc_count + indus?.doc_count)),
      y_abs: (academicWith?.doc_count ?? 0) + (indusWith?.doc_count ?? 0),
      y_tot: (academic1?.doc_count ?? 0) + (indus?.doc_count ?? 0),
      yearMax,
      yearMin,
    });
    series1[0].data.push({
      color: getCSSValue('--lead-sponsor-public'),
      name: intl.formatMessage({ id: 'app.sponsor.academique' }),
      y: 100 * ((academicWith?.doc_count ?? 0) / academic1?.doc_count),
      y_abs: academicWith?.doc_count ?? 0,
      y_tot: academic1?.doc_count ?? 0,
      yearMax,
      yearMin,
    });
    series1[0].data.push({
      color: getCSSValue('--lead-sponsor-privee'),
      name: intl.formatMessage({ id: 'app.sponsor.industriel' }),
      y: 100 * ((indusWith?.doc_count ?? 0) / indus?.doc_count),
      y_abs: indusWith?.doc_count ?? 0,
      y_tot: indus?.doc_count ?? 0,
      yearMax,
      yearMin,
    });
    const allLeadSponsorRate3 = 100
      * ((academicWith3?.doc_count + indusWith3?.doc_count)
        / (academicTotal3 + indusTotal3));
    series3[0].data.push({
      color: getCSSValue('--blue-soft-100'),
      name: intl.formatMessage({ id: 'app.all-sponsor-types' }),
      y: allLeadSponsorRate3,
      y_abs: (academicWith3?.doc_count ?? 0) + (indusWith3?.doc_count ?? 0),
      y_tot: academicTotal3 + indusTotal3,
      yearMax: yearMax2,
    });
    const publicLeadSponsorsRate3 = 100 * ((academicWith3?.doc_count ?? 0) / academicTotal3);
    series3[0].data.push({
      color: getCSSValue('--lead-sponsor-public'),
      name: intl.formatMessage({ id: 'app.sponsor.academique' }),
      y: publicLeadSponsorsRate3,
      y_abs: academicWith3?.doc_count ?? 0,
      y_tot: academicTotal3,
      yearMax: yearMax2,
    });
    const privateLeadSponsorsRate3 = 100 * ((indusWith3?.doc_count ?? 0) / indusTotal3);
    series3[0].data.push({
      color: getCSSValue('--lead-sponsor-privee'),
      name: intl.formatMessage({ id: 'app.sponsor.industriel' }),
      y: privateLeadSponsorsRate3,
      y_abs: indusWith3?.doc_count ?? 0,
      y_tot: indusTotal3,
      yearMax: yearMax2,
    });
    const allLeadSponsorRate4 = 100
      * ((academicWith4?.doc_count + indusWith4?.doc_count)
        / (academicTotal4 + indusTotal4));
    series4[0].data.push({
      color: getCSSValue('--blue-soft-100'),
      name: intl.formatMessage({ id: 'app.all-sponsor-types' }),
      y: allLeadSponsorRate4,
      y_abs: (academicWith4?.doc_count ?? 0) + (indusWith4?.doc_count ?? 0),
      y_tot: academicTotal4 + indusTotal4,
      yearMax,
    });
    const publicLeadSponsorsRate4 = 100 * ((academicWith4?.doc_count ?? 0) / academicTotal4);
    series4[0].data.push({
      color: getCSSValue('--lead-sponsor-public'),
      name: intl.formatMessage({ id: 'app.sponsor.academique' }),
      y: publicLeadSponsorsRate4,
      y_abs: academicWith4?.doc_count ?? 0,
      y_tot: academicTotal4,
      yearMax,
    });
    const privateLeadSponsorsRate4 = 100 * ((indusWith4?.doc_count ?? 0) / indusTotal4);
    series4[0].data.push({
      color: getCSSValue('--lead-sponsor-privee'),
      name: intl.formatMessage({ id: 'app.sponsor.industriel' }),
      y: privateLeadSponsorsRate4,
      y_abs: indusWith4?.doc_count ?? 0,
      y_tot: indusTotal4,
      yearMax,
    });
    if (sponsor !== '*') {
      series1[0].data.push({
        color: getCSSValue('--lead-sponsor-highlight'),
        name: sponsor,
        y: 100 * ((sponsWith?.doc_count ?? 0) / spons?.doc_count),
        y_abs: sponsWith?.doc_count ?? 0,
        y_tot: spons?.doc_count ?? 0,
        yearMax,
        yearMin,
      });
      series3[0].data.push({
        color: getCSSValue('--lead-sponsor-highlight'),
        name: sponsor,
        y: 100 * ((sponsWith?.doc_count ?? 0) / spons?.doc_count),
        y_abs: sponsWith?.doc_count ?? 0,
        y_tot: spons?.doc_count ?? 0,
        yearMax: yearMax2,
        yearMin: yearMin2,
      });
      series4[0].data.push({
        color: getCSSValue('--lead-sponsor-highlight'),
        name: sponsor,
        y: 100 * ((sponsWith?.doc_count ?? 0) / spons?.doc_count),
        y_abs: sponsWith?.doc_count ?? 0,
        y_tot: spons?.doc_count ?? 0,
        yearMax,
      });
      categories.push(sponsor);
    }
    const dataGraph1 = { categories, series: series1 };
    const dataGraph3 = { categories, series: series3 };
    const dataGraph4 = { categories, series: series4 };

    const categories5 = data3.by_sponsor_type.buckets[0].by_has_results_within_3_years.buckets[0].by_completion_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2010 && y.key <= currentYear)
      .map((item) => item.key);
    const academic5 = data3.by_sponsor_type.buckets.find(
      (item) => item.key === 'academique',
    );
    const academicData5 = [];
    const industrial5 = data3.by_sponsor_type.buckets.find(
      (item) => item.key === 'industriel',
    );
    const industrialData5 = [];
    const allTypesData5 = [];

    categories5.forEach((year) => {
      const academicDataWithResultsForYear = academic5?.by_has_results_within_3_years?.buckets
        ?.find((item) => item.key === 1)
        ?.by_completion_year.buckets?.find((item) => item.key === year)
        ?.doc_count ?? 0;
      const academicDataWithoutResultsForYear = academic5?.by_has_results_within_3_years?.buckets
        ?.find((item) => item.key === 0)
        ?.by_completion_year.buckets?.find((item) => item.key === year)
        ?.doc_count ?? 0;
      const industrialDataWithResultsForYear = industrial5?.by_has_results_within_3_years?.buckets
        ?.find((item) => item.key === 1)
        ?.by_completion_year.buckets?.find((item) => item.key === year)
        ?.doc_count ?? 0;
      const industrialDataWithoutResultsForYear = industrial5?.by_has_results_within_3_years?.buckets
        ?.find((item) => item.key === 0)
        ?.by_completion_year.buckets?.find((item) => item.key === year)
        ?.doc_count ?? 0;
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
        yearMax,
        yearMin,
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
        yearMax,
        yearMin,
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

    const categories6 = data4.by_sponsor_type.buckets[0].by_has_results_within_1_year.buckets[0].by_completion_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2010 && y.key <= currentYear)
      .map((item) => item.key);
    const academic6 = data4.by_sponsor_type.buckets.find(
      (item) => item.key === 'academique',
    );
    const academicData6 = [];
    const industrial6 = data4.by_sponsor_type.buckets.find(
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
        yearMax,
        yearMin,
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
        yearMax,
        yearMin,
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
      yearMax,
      yearMin2,
      yearMax2,
    };

    return {
      comments,
      dataGraph1,
      dataGraph3,
      dataGraph4,
      dataGraph5,
      dataGraph6,
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
