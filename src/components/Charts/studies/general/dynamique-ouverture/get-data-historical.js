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

function useGetData(studyType, sponsor = '*', filterOnDrug = false) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const observationSnaps = ['2022Q4', '2023Q4', '2024Q4', '2025Q4'].sort();
  const lastObservationYear = parseInt(
    process.env.REACT_APP_LAST_OBSERVATION_CLINICAL_TRIALS.substring(0, 4),
    10,
  );
  const years10Max = lastObservationYear - 4;
  const years10Min = years10Max - 9;

  async function getDataAxios() {
    // Create sponsors types list
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

    // Create sponsors list
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
      const queryHasResults = getFetchOptions({
        key: 'studiesDynamiqueOuverture',
        parameters: [studyType, years10Min, years10Max, observationSnap],
        objectType: ['clinicalTrials'],
      });
      if (filterOnDrug) {
        queryHasResults.query.bool.filter.push({
          term: { 'intervention_type.keyword': 'DRUG' },
        });
      }
      queries.push(Axios.post(ES_STUDIES_API_URL, queryHasResults, HEADERS));
      const queryHasResultsFilterBySponsor = getFetchOptions({
        key: 'studiesDynamiqueOuvertureSponsor',
        parameters: [
          studyType,
          sponsor,
          '*',
          years10Min,
          years10Max,
          observationSnap,
        ],
        objectType: ['clinicalTrials'],
      });
      if (filterOnDrug) {
        queryHasResultsFilterBySponsor.query.bool.filter.push({
          term: { 'intervention_type.keyword': 'DRUG' },
        });
      }
      queriesSponsor.push(
        Axios.post(ES_STUDIES_API_URL, queryHasResultsFilterBySponsor, HEADERS),
      );
    });
    const results = await Axios.all(queries);
    const resultsSponsor = await Axios.all(queriesSponsor);

    // The horizontal bars order is defined by the categories order
    const categories = [];
    if (sponsor !== '*') categories.push(sponsor);
    categories.push(
      capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
    );
    categories.push(
      capitalize(intl.formatMessage({ id: 'app.sponsor.industriel' })),
    );
    categories.push(
      capitalize(intl.formatMessage({ id: 'app.sponsor.academique' })),
    );

    const series = [];
    observationSnaps.forEach((observationSnap, index) => {
      const dataHasResults = results[index].data.aggregations;
      const dataHasResultsAcademic = dataHasResults.by_sponsor_type.buckets.find(
        (ele) => ele.key === 'academique',
      );
      const dataHasResultsAcademicWithResults = dataHasResultsAcademic?.by_has_result.buckets.find(
        (ele) => ele.key === 1,
      );
      const dataHasResultsIndustrial = dataHasResults.by_sponsor_type.buckets.find(
        (ele) => ele.key === 'industriel',
      );
      const dataHasResultsIndustrialWithResults = dataHasResultsIndustrial?.by_has_result.buckets.find(
        (el) => el.key === 1,
      );
      const data = [];
      data.push({
        color: getCSSValue('--blue-soft-100'),
        name: capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
        observationSnap,
        observationSnapLabel: `${intl.formatMessage({
          id: 'app.observedin',
        })} ${getObservationLabel(observationSnap, intl)}`,
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
      data.push({
        color: getCSSValue('--lead-sponsor-public'),
        name: capitalize(intl.formatMessage({ id: 'app.sponsor.academique' })),
        observationSnap,
        observationSnapLabel: `${intl.formatMessage({
          id: 'app.observedin',
        })} ${getObservationLabel(observationSnap, intl)}`,
        y:
          100
          * ((dataHasResultsAcademicWithResults?.doc_count ?? 0)
            / dataHasResultsAcademic?.doc_count),
        y_abs: dataHasResultsAcademicWithResults?.doc_count ?? 0,
        y_tot: dataHasResultsAcademic?.doc_count ?? 0,
        yearMax: years10Max,
        yearMin: years10Min,
      });
      data.push({
        color: getCSSValue('--lead-sponsor-privee'),
        name: capitalize(intl.formatMessage({ id: 'app.sponsor.industriel' })),
        observationSnap,
        observationSnapLabel: `${intl.formatMessage({
          id: 'app.observedin',
        })} ${getObservationLabel(observationSnap, intl)}`,
        y:
          100
          * ((dataHasResultsIndustrialWithResults?.doc_count ?? 0)
            / dataHasResultsIndustrial?.doc_count),
        y_abs: dataHasResultsIndustrialWithResults?.doc_count ?? 0,
        y_tot: dataHasResultsIndustrial?.doc_count ?? 0,
        yearMax: years10Max,
        yearMin: years10Min,
      });

      if (sponsor !== '*') {
        const dataHasResultsFilterBySponsor = resultsSponsor[index].data.aggregations;
        const dataHasResultsFilterBySponsorWithResults = dataHasResultsFilterBySponsor?.by_has_result.buckets.find(
          (el) => el.key === 1,
        );
        const dataHasResultsFilterBySponsorWithoutResults = dataHasResultsFilterBySponsor?.by_has_result.buckets.find(
          (ele) => ele.key === 0,
        );
        data.push({
          color: getCSSValue('--lead-sponsor-highlight'),
          name: sponsor,
          observationSnap,
          observationSnapLabel: `${intl.formatMessage({
            id: 'app.observedin',
          })} ${getObservationLabel(observationSnap, intl)}`,
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
      }
      series.push({ data });
    });
    const dataGraph = { categories, series };

    const dataTitle = {
      yearMax: years10Max,
      yearMin: years10Min,
    };

    return {
      dataGraph,
      dataTitle,
      sponsors,
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
  }, [studyType, sponsor]);

  return { allData, isError, isLoading };
}
export default useGetData;
