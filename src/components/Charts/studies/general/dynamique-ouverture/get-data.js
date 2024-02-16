import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType, sponsor = '*') {
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
    queries.push(Axios.post(ES_STUDIES_API_URL, query1, HEADERS));
    const query2 = getFetchOptions({
      key: 'studiesDynamiqueOuvertureSponsor',
      parameters: [studyType, sponsor, yearMin, yearMax],
      objectType: ['clinicalTrials'],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, query2, HEADERS));
    const query3 = getFetchOptions({
      key: 'studiesDynamiqueOuvertureWithin2Years',
      parameters: [studyType, yearMin2, yearMax2],
      objectType: ['clinicalTrials'],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, query3, HEADERS));
    const query4 = getFetchOptions({
      key: 'studiesDynamiqueOuvertureWithin3Years',
      parameters: [studyType, yearMin2, yearMax2],
      objectType: ['clinicalTrials'],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, query4, HEADERS));
    const res = await Axios.all(queries);
    const data1 = res[0].data.aggregations;
    const data2 = res[1].data.aggregations;
    const data3 = res[2].data.aggregations;
    const data4 = res[3].data.aggregations;
    const series1 = [
      { name: intl.formatMessage({ id: 'app.sponsor-type' }), data: [] },
    ];
    const series2 = [
      { name: intl.formatMessage({ id: 'app.sponsor-type' }), data: [] },
    ];
    const series3 = [
      { name: intl.formatMessage({ id: 'app.sponsor-type' }), data: [] },
    ];
    const academic1 = data1.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'academique',
    );
    const academicWith = academic1?.by_has_result.buckets.find(
      (ele) => ele.key === 1,
    );
    const academic2 = data3.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'academique',
    );
    const academicWith2 = academic2?.by_has_results_within_2_years.buckets.find(
      (ele) => ele.key === 1,
    );
    const academic3 = data4.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'academique',
    );
    const academicWith3 = academic3?.by_has_results_within_3_years.buckets.find(
      (ele) => ele.key === 1,
    );
    const indus = data1.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'industriel',
    );
    const indusWith = indus?.by_has_result.buckets.find((el) => el.key === 1);
    const indus2 = data3.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'industriel',
    );
    const indusWith2 = indus2?.by_has_results_within_2_years.buckets.find(
      (el) => el.key === 1,
    );
    const indus3 = data4.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'industriel',
    );
    const indusWith3 = indus3?.by_has_results_within_3_years.buckets.find(
      (el) => el.key === 1,
    );
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
      y_abs: academicWith?.doc_count ?? 0 + indusWith?.doc_count ?? 0,
      y_tot: academic1?.doc_count ?? 0 + indus?.doc_count ?? 0,
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
    series2[0].data.push({
      color: getCSSValue('--blue-soft-100'),
      name: intl.formatMessage({ id: 'app.all-sponsor-types' }),
      y:
        100
        * ((academicWith2?.doc_count + indusWith2?.doc_count)
          / (academic2?.doc_count + indus2?.doc_count)),
      y_abs: academicWith2?.doc_count ?? 0 + indusWith2?.doc_count ?? 0,
      y_tot: academic2?.doc_count ?? 0 + indus2?.doc_count ?? 0,
      yearMax: yearMax2,
      yearMin: yearMin2,
    });
    series2[0].data.push({
      color: getCSSValue('--lead-sponsor-public'),
      name: intl.formatMessage({ id: 'app.sponsor.academique' }),
      y: 100 * ((academicWith2?.doc_count ?? 0) / academic2?.doc_count),
      y_abs: academicWith2?.doc_count ?? 0,
      y_tot: academic2?.doc_count ?? 0,
      yearMax: yearMax2,
      yearMin: yearMin2,
    });
    series2[0].data.push({
      color: getCSSValue('--lead-sponsor-privee'),
      name: intl.formatMessage({ id: 'app.sponsor.industriel' }),
      y: 100 * ((indusWith2?.doc_count ?? 0) / indus2?.doc_count),
      y_abs: indusWith2?.doc_count ?? 0,
      y_tot: indus2?.doc_count ?? 0,
      yearMax: yearMax2,
      yearMin: yearMin2,
    });
    series3[0].data.push({
      color: getCSSValue('--blue-soft-100'),
      name: intl.formatMessage({ id: 'app.all-sponsor-types' }),
      y:
        100
        * ((academicWith3?.doc_count + indusWith3?.doc_count)
          / (academic3?.doc_count + indus3?.doc_count)),
      y_abs: academicWith3?.doc_count ?? 0 + indusWith3?.doc_count ?? 0,
      y_tot: academic3?.doc_count ?? 0 + indus3?.doc_count ?? 0,
      yearMax: yearMax2,
      yearMin: yearMin2,
    });
    series3[0].data.push({
      color: getCSSValue('--lead-sponsor-public'),
      name: intl.formatMessage({ id: 'app.sponsor.academique' }),
      y: 100 * ((academicWith3?.doc_count ?? 0) / academic3?.doc_count),
      y_abs: academicWith3?.doc_count ?? 0,
      y_tot: academic3?.doc_count ?? 0,
      yearMax: yearMax2,
      yearMin: yearMin2,
    });
    series3[0].data.push({
      color: getCSSValue('--lead-sponsor-privee'),
      name: intl.formatMessage({ id: 'app.sponsor.industriel' }),
      y: 100 * ((indusWith3?.doc_count ?? 0) / indus3?.doc_count),
      y_abs: indusWith3?.doc_count ?? 0,
      y_tot: indus3?.doc_count ?? 0,
      yearMax: yearMax2,
      yearMin: yearMin2,
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
      series2[0].data.push({
        color: getCSSValue('--lead-sponsor-highlight'),
        name: sponsor,
        y: 100 * ((sponsWith?.doc_count ?? 0) / spons?.doc_count),
        y_abs: sponsWith?.doc_count ?? 0,
        y_tot: spons?.doc_count ?? 0,
        yearMax: yearMax2,
        yearMin: yearMin2,
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
      categories.push(sponsor);
    }
    const dataGraph1 = { categories, series: series1 };
    const dataGraph2 = { categories, series: series2 };
    const dataGraph3 = { categories, series: series3 };

    const categories4 = data3.by_sponsor_type.buckets[0].by_has_results_within_2_years.buckets[0].by_completion_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2010 && y.key <= currentYear)
      .map((item) => item.key);
    const academic4 = data3.by_sponsor_type.buckets.find(
      (item) => item.key === 'academique',
    );
    const academicData4 = [];
    const industrial4 = data3.by_sponsor_type.buckets.find(
      (item) => item.key === 'industriel',
    );
    const industrialData4 = [];
    const allTypesData4 = [];

    categories4.forEach((year) => {
      const academicDataWithResultsForYear = academic4?.by_has_results_within_2_years?.buckets
        ?.find((item) => item.key === 1)
        ?.by_completion_year.buckets?.find((item) => item.key === year)
        ?.doc_count ?? 0;
      const academicDataWithoutResultsForYear = academic4?.by_has_results_within_2_years?.buckets
        ?.find((item) => item.key === 0)
        ?.by_completion_year.buckets?.find((item) => item.key === year)
        ?.doc_count ?? 0;
      const industrialDataWithResultsForYear = industrial4?.by_has_results_within_2_years?.buckets
        ?.find((item) => item.key === 1)
        ?.by_completion_year.buckets?.find((item) => item.key === year)
        ?.doc_count ?? 0;
      const industrialDataWithoutResultsForYear = industrial4?.by_has_results_within_2_years?.buckets
        ?.find((item) => item.key === 0)
        ?.by_completion_year.buckets?.find((item) => item.key === year)
        ?.doc_count ?? 0;
      academicData4.push({
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
      industrialData4.push({
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
      allTypesData4.push({
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

    const series4 = [
      {
        id: 'public',
        color: getCSSValue('--lead-sponsor-public'),
        data: academicData4,
        name: capitalize(intl.formatMessage({ id: 'app.sponsor.academique' })),
        pointPlacement: -0.2,
      },
      {
        id: 'prive',
        color: getCSSValue('--lead-sponsor-privee'),
        data: industrialData4,
        name: capitalize(intl.formatMessage({ id: 'app.sponsor.industriel' })),
      },
      {
        id: 'main',
        color: getCSSValue('--blue-soft-100'),
        data: allTypesData4,
        name: capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
        pointPlacement: 0.2,
      },
    ];
    const dataGraph4 = { categories: categories4, series: series4 };

    const categories5 = data4.by_sponsor_type.buckets[0].by_has_results_within_3_years.buckets[0].by_completion_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2010 && y.key <= currentYear)
      .map((item) => item.key);
    const academic5 = data4.by_sponsor_type.buckets.find(
      (item) => item.key === 'academique',
    );
    const academicData5 = [];
    const industrial5 = data4.by_sponsor_type.buckets.find(
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
      privateLeadSponsorsRate,
      publicLeadSponsorsRate,
    };

    return {
      comments,
      dataGraph1,
      dataGraph2,
      dataGraph3,
      dataGraph4,
      dataGraph5,
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
