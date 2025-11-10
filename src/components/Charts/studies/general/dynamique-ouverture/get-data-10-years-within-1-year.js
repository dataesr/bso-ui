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
    const currentYear = parseInt(
      process.env.REACT_APP_LAST_OBSERVATION.substring(0, 4),
      10,
    );
    const years10Max = currentYear - 1;
    const years10Min = years10Max - 9;

    const querySponsorsList = getFetchOptions({
      key: 'sponsorsList',
      objectType: ['clinicalTrials'],
      parameters: [studyType, years10Min, years10Max],
    });
    const queryHasResultsWithin1Year = getFetchOptions({
      key: 'studiesDynamiqueOuvertureWithin1Year',
      objectType: ['clinicalTrials'],
      parameters: [studyType, years10Min, years10Max],
    });
    const queryHasResultsWithin1YearFilterBySponsor = getFetchOptions({
      key: 'studiesDynamiqueOuvertureWithin1YearSponsor',
      objectType: ['clinicalTrials'],
      parameters: [studyType, sponsor, years10Min, years10Max],
    });
    const queries = [];
    queries.push(Axios.post(ES_STUDIES_API_URL, querySponsorsList, HEADERS));
    queries.push(
      Axios.post(ES_STUDIES_API_URL, queryHasResultsWithin1Year, HEADERS),
    );
    queries.push(
      Axios.post(
        ES_STUDIES_API_URL,
        queryHasResultsWithin1YearFilterBySponsor,
        HEADERS,
      ),
    );
    const results = await Axios.all(queries);

    const categories = [
      capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
      capitalize(intl.formatMessage({ id: 'app.sponsor.industriel' })),
      capitalize(intl.formatMessage({ id: 'app.sponsor.academique' })),
    ];
    const sponsors = results[0].data.aggregations.by_sponsor.buckets.map(
      (item) => ({
        value: item.key,
        label: item.key,
      }),
    );
    const dataHasResultsWithin1Year = results[1].data.aggregations;
    const dataHasResultsWithin1YearAcademic = dataHasResultsWithin1Year.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'academique',
    );
    const dataHasResultsWithin1YearAcademicWithResults = dataHasResultsWithin1YearAcademic?.by_has_results_within_1_year.buckets.find(
      (ele) => ele.key === 1,
    );
    const dataHasResultsWithin1YearIndustrial = dataHasResultsWithin1Year.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'industriel',
    );
    const dataHasResultsWithin1YearIndustrialWithResults = dataHasResultsWithin1YearIndustrial?.by_has_results_within_1_year.buckets.find(
      (ele) => ele.key === 1,
    );
    const dataHasResultsWithin1YearIndustrialWithResultsLastYear = dataHasResultsWithin1YearIndustrialWithResults?.by_completion_year.buckets.find(
      (ele) => ele.key === years10Max,
    );
    const dataHasResultsWithin1YearFilterBySponsor = results[2].data.aggregations;
    const dataHasResultsWithin1YearFilterBySponsorWithResults = dataHasResultsWithin1YearFilterBySponsor?.by_has_results_within_1_year.buckets.find(
      (el) => el.key === 1,
    );
    const dataHasResultsWithin1YearFilterBySponsorWithoutResults = dataHasResultsWithin1YearFilterBySponsor?.by_has_results_within_1_year.buckets.find(
      (ele) => ele.key === 0,
    );

    const series = [{ data: [] }];
    series[0].data.push({
      color: getCSSValue('--blue-soft-100'),
      name: intl.formatMessage({ id: 'app.all-sponsor-types' }),
      y:
        100
        * ((dataHasResultsWithin1YearAcademicWithResults?.doc_count
          + dataHasResultsWithin1YearIndustrialWithResults?.doc_count)
          / (dataHasResultsWithin1YearAcademic?.doc_count
            + dataHasResultsWithin1YearIndustrial?.doc_count)),
      y_abs:
        (dataHasResultsWithin1YearAcademicWithResults?.doc_count ?? 0)
        + (dataHasResultsWithin1YearIndustrialWithResults?.doc_count ?? 0),
      y_tot:
        (dataHasResultsWithin1YearAcademic?.doc_count ?? 0)
        + (dataHasResultsWithin1YearIndustrial?.doc_count ?? 0),
      yearMax: years10Max,
      yearMin: years10Min,
    });
    series[0].data.push({
      color: getCSSValue('--lead-sponsor-public'),
      name: intl.formatMessage({ id: 'app.sponsor.academique' }),
      y:
        100
        * ((dataHasResultsWithin1YearAcademicWithResults?.doc_count ?? 0)
          / dataHasResultsWithin1YearAcademic?.doc_count),
      y_abs: dataHasResultsWithin1YearAcademicWithResults?.doc_count ?? 0,
      y_tot: dataHasResultsWithin1YearAcademic?.doc_count ?? 0,
      yearMax: years10Max,
      yearMin: years10Min,
    });
    series[0].data.push({
      color: getCSSValue('--lead-sponsor-privee'),
      name: intl.formatMessage({ id: 'app.sponsor.industriel' }),
      y:
        100
        * ((dataHasResultsWithin1YearIndustrialWithResults?.doc_count ?? 0)
          / dataHasResultsWithin1YearIndustrial?.doc_count),
      y_abs:
        dataHasResultsWithin1YearIndustrialWithResultsLastYear?.doc_count ?? 0,
      y_tot: dataHasResultsWithin1YearIndustrial?.doc_count ?? 0,
      yearMax: years10Max,
      yearMin: years10Min,
    });

    if (sponsor !== '*') {
      series[0].data.push({
        color: getCSSValue('--lead-sponsor-highlight'),
        name: sponsor,
        y:
          100
          * ((dataHasResultsWithin1YearFilterBySponsorWithResults?.doc_count
            || 0)
            / ((dataHasResultsWithin1YearFilterBySponsorWithResults?.doc_count
              || 0)
              + (dataHasResultsWithin1YearFilterBySponsorWithoutResults?.doc_count
                || 0))),
        y_abs:
          dataHasResultsWithin1YearFilterBySponsorWithResults?.doc_count || 0,
        y_tot:
          (dataHasResultsWithin1YearFilterBySponsorWithResults?.doc_count
            || 0)
          + (dataHasResultsWithin1YearFilterBySponsorWithoutResults?.doc_count
            || 0),
        yearMax: years10Max,
        yearMin: years10Min,
      });
      categories.push(sponsor);
    }

    return {
      dataGraph: { categories, series },
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
