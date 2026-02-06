import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  async function getDataAxios() {
    const currentYear = parseInt(
      process.env.REACT_APP_LAST_OBSERVATION_CLINICAL_TRIALS.substring(0, 4),
      10,
    );
    const years3Max = currentYear - 3;
    const years3Min = years3Max - 6;
    const query = getFetchOptions({
      key: 'studiesResultsByDiffusionBySponsorType',
      parameters: [studyType, years3Min, years3Max],
      objectType: ['clinicalTrials'],
    });
    const results = await Axios.post(ES_STUDIES_API_URL, query, HEADERS);
    const sponsorsTypes = results.data.aggregations.by_lead_sponsor_type.buckets;
    const categories = [
      // capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
      // capitalize(intl.formatMessage({ id: 'app.sponsor.industriel' })),
      // capitalize(intl.formatMessage({ id: 'app.sponsor.academique' })),
    ];
    const series = [
      {
        color: getCSSValue('--publication-100'),
        data: [],
        id: 'has_publications_only',
        index: 3,
        name: capitalize(
          intl.formatMessage({ id: 'app.studies.results-only' }),
        ),
      },
      {
        color: getCSSValue('--resultat-100'),
        data: [],
        id: 'has_results_only',
        index: 2,
        name: capitalize(
          intl.formatMessage({ id: 'app.studies.publications-only' }),
        ),
      },
      {
        color: getCSSValue('--resultat-et-publication'),
        data: [],
        id: 'has_publications_and_results',
        index: 1,
        name: capitalize(
          intl.formatMessage({ id: 'app.studies.results-and-publications' }),
        ),
      },
      {
        color: getCSSValue('--g-400'),
        data: [],
        id: 'no_results',
        index: 0,
        name: capitalize(
          intl.formatMessage({ id: 'app.studies.no-results-publications' }),
        ),
      },
    ];
    console.log(sponsorsTypes);
    sponsorsTypes.forEach((sponsorType) => {
      // categories.push(capitalize(intl.formatMessage({ id: `app.sponsor.${sponsorType.key}` })));
      const hasPublicationsOnly = sponsorType.by_has_results.buckets
        .find((bucket) => bucket.key === 0)
        .by_has_publications_result.buckets.find((bucket) => bucket.key === 1)
        ?.doc_count ?? 0;
      const hasResultsOnly = sponsorType.by_has_results.buckets
        .find((bucket) => bucket.key === 1)
        .by_has_publications_result.buckets.find((bucket) => bucket.key === 0)
        ?.doc_count ?? 0;
      const hasPublicationsAndResults = sponsorType.by_has_results.buckets
        .find((bucket) => bucket.key === 1)
        .by_has_publications_result.buckets.find((bucket) => bucket.key === 1)
        ?.doc_count ?? 0;
      const noResult = sponsorType.by_has_results.buckets
        .find((bucket) => bucket.key === 0)
        .by_has_publications_result.buckets.find((bucket) => bucket.key === 0)
        ?.doc_count ?? 0;
      const total = hasPublicationsAndResults
        + hasResultsOnly
        + hasPublicationsOnly
        + noResult;
      const hasPublicationsOnlyPercent = (hasPublicationsOnly / total) * 100;
      const hasResultsOnlyPercent = (hasResultsOnly / total) * 100;
      const hasPublicationsAndResultsPercent = (hasPublicationsAndResults / total) * 100;
      const noResultPercent = (noResult / total) * 100;
      series
        .find((serie) => serie.id === 'has_publications_only')
        .data.push({
          y: hasPublicationsOnlyPercent,
          y_abs: hasPublicationsOnly,
        });
      series
        .find((serie) => serie.id === 'has_results_only')
        .data.push({
          y: hasResultsOnlyPercent,
          y_abs: hasResultsOnly,
        });
      series
        .find((serie) => serie.id === 'has_publications_and_results')
        .data.push({
          y: hasPublicationsAndResultsPercent,
          y_abs: hasPublicationsAndResults,
        });
      series
        .find((serie) => serie.id === 'no_results')
        .data.push({
          y: noResultPercent,
          y_abs: noResult,
        });
    });
    // const series = [
    //   {
    //     name: capitalize(intl.formatMessage({ id: 'app.studies.no-results-publications' })),
    //     y_abs: data.by_has_result.buckets
    //       .find((ele) => ele.key === 0)
    //       ?.by_has_publications_result.buckets.find(
    //         (ele) => ele.key === 0,
    //       )?.doc_count,
    //     y:
    //       (100
    //         * (data.by_has_result.buckets
    //           .find((ele) => ele.key === 0)
    //           ?.by_has_publications_result.buckets.find(
    //             (ele) => ele.key === 0,
    //           )?.doc_count || 0))
    //       / dataTotal,
    //     y_tot: dataTotal,
    //     yearMin,
    //     yearMax,
    //     color: getCSSValue('--g-400'),
    //   },
    //   {
    //     name: capitalize(intl.formatMessage({ id: 'app.studies.results-and-publications' })),
    //     y_abs: data.by_has_result.buckets
    //       .find((ele) => ele.key === 1)
    //       ?.by_has_publications_result.buckets.find(
    //         (ele) => ele.key === 1,
    //       )?.doc_count,
    //     y:
    //       (100
    //         * (data.by_has_result.buckets
    //           .find((ele) => ele.key === 1)
    //           ?.by_has_publications_result.buckets.find(
    //             (ele) => ele.key === 1,
    //           )?.doc_count || 0))
    //       / dataTotal,
    //     y_tot: dataTotal,
    //     yearMin,
    //     yearMax,
    //     color: getCSSValue('--resultat-et-publication'),
    //   },
    //   {
    //     name: capitalize(intl.formatMessage({ id: 'app.studies.publications-only' })),
    //     y_abs: data.by_has_result.buckets
    //       .find((ele) => ele.key === 0)
    //       ?.by_has_publications_result.buckets.find(
    //         (ele) => ele.key === 1,
    //       )?.doc_count,
    //     y:
    //       (100
    //         * (data.by_has_result.buckets
    //           .find((ele) => ele.key === 0)
    //           ?.by_has_publications_result.buckets.find(
    //             (ele) => ele.key === 1,
    //           )?.doc_count || 0))
    //       / dataTotal,
    //     y_tot: dataTotal,
    //     yearMin,
    //     yearMax,
    //     color: getCSSValue('--publication-100'),
    //   },
    //   {
    //     name: capitalize(intl.formatMessage({ id: 'app.studies.results-only' })),
    //     y_abs: data.by_has_result.buckets
    //       .find((ele) => ele.key === 1)
    //       ?.by_has_publications_result.buckets.find(
    //         (ele) => ele.key === 0,
    //       )?.doc_count,
    //     y:
    //       (100
    //         * (data.by_has_result.buckets
    //           .find((ele) => ele.key === 1)
    //           ?.by_has_publications_result.buckets.find(
    //             (ele) => ele.key === 0,
    //           )?.doc_count || 0))
    //       / dataTotal,
    //     y_tot: dataTotal,
    //     yearMin,
    //     yearMax,
    //     color: getCSSValue('--resultat-100'),
    //   },
    // ];

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
