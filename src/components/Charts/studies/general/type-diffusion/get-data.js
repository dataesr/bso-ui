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
    const year = currentYear - 3;
    const query = getFetchOptions({
      key: 'studiesResultsByDiffusionBySponsorType',
      parameters: [studyType, year, year],
      objectType: ['clinicalTrials'],
    });
    const results = await Axios.post(ES_STUDIES_API_URL, query, HEADERS);
    const sponsorsTypes =
      results.data.aggregations.by_lead_sponsor_type.buckets;
    const academic = sponsorsTypes.find(
      (bucket) => bucket.key === 'academique',
    );
    const academicWithPublicationsAndResults = academic.by_results.buckets
      .find((bucket) => bucket.key === 1)
      .by_publications_and_results.buckets.find(
        (bucket) => bucket.key === 1,
      ).doc_count;
    const academicWithPublicationsAndResultsPercent =
      (academicWithPublicationsAndResults / academic.doc_count) * 100;
    const academicWithResultsOnly = academic.by_results.buckets
      .find((bucket) => bucket.key === 1)
      .by_publications_and_results.buckets.find(
        (bucket) => bucket.key === 0,
      ).doc_count;
    const academicWithResultsOnlyPercent =
      (academicWithResultsOnly / academic.doc_count) * 100;
    const academicWithPublicationsOnly = academic.by_publications.buckets
      .find((bucket) => bucket.key === 1)
      .by_publications_and_results.buckets.find(
        (bucket) => bucket.key === 0,
      ).doc_count;
    const academicWithPublicationsOnlyPercent =
      (academicWithPublicationsOnly / academic.doc_count) * 100;
    const industrial = sponsorsTypes.find(
      (bucket) => bucket.key === 'industriel',
    );
    const industrialWithPublicationsAndResults = industrial.by_results.buckets
      .find((bucket) => bucket.key === 1)
      .by_publications_and_results.buckets.find(
        (bucket) => bucket.key === 1,
      ).doc_count;
    const industrialWithPublicationsAndResultsPercent =
      (industrialWithPublicationsAndResults / industrial.doc_count) * 100;
    const industrialWithResultsOnly = industrial.by_results.buckets
      .find((bucket) => bucket.key === 1)
      .by_publications_and_results.buckets.find(
        (bucket) => bucket.key === 0,
      ).doc_count;
    const industrialWithResultsOnlyPercent =
      (industrialWithResultsOnly / industrial.doc_count) * 100;
    const industrialWithPublicationsOnly = industrial.by_publications.buckets
      .find((bucket) => bucket.key === 1)
      .by_publications_and_results.buckets.find(
        (bucket) => bucket.key === 0,
      ).doc_count;
    const industrialWithPublicationsOnlyPercent =
      (industrialWithPublicationsOnly / industrial.doc_count) * 100;
    const all = academic.doc_count + industrial.doc_count;
    const allWithPublicationsAndResults =
      academicWithPublicationsAndResults + industrialWithPublicationsAndResults;
    const allWithPublicationsAndResultsPercent =
      (allWithPublicationsAndResults / all) * 100;
    const allWithResultsOnly =
      academicWithResultsOnly + industrialWithResultsOnly;
    const allWithResultsOnlyPercent = (allWithResultsOnly / all) * 100;
    const allWithPublicationsOnly =
      academicWithPublicationsOnly + industrialWithPublicationsOnly;
    const allWithPublicationsOnlyPercent =
      (allWithPublicationsOnly / all) * 100;
    const categories = [
      capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
      capitalize(intl.formatMessage({ id: 'app.sponsor.industriel' })),
      capitalize(intl.formatMessage({ id: 'app.sponsor.academique' })),
    ];
    const series = [
      {
        color: getCSSValue('--publication-100'),
        data: [
          {
            y: allWithResultsOnlyPercent,
            y_abs: allWithResultsOnly,
            y_tot: all,
          },
          {
            y: industrialWithResultsOnlyPercent,
            y_abs: industrialWithResultsOnly,
            y_tot: industrial.doc_count,
          },
          {
            y: academicWithResultsOnlyPercent,
            y_abs: academicWithResultsOnly,
            y_tot: academic.doc_count,
          },
        ],
        id: 'has_results_only',
        index: 3,
        name: capitalize(
          intl.formatMessage({ id: 'app.studies.results-only' }),
        ),
        year,
      },
      {
        color: getCSSValue('--resultat-100'),
        data: [
          {
            y: allWithPublicationsOnlyPercent,
            y_abs: allWithPublicationsOnly,
            y_tot: all,
          },
          {
            y: industrialWithPublicationsOnlyPercent,
            y_abs: industrialWithPublicationsOnly,
            y_tot: industrial.doc_count,
          },
          {
            y: academicWithPublicationsOnlyPercent,
            y_abs: academicWithPublicationsOnly,
            y_tot: academic.doc_count,
          },
        ],
        id: 'has_publications_only',
        index: 2,
        name: capitalize(
          intl.formatMessage({ id: 'app.studies.publications-only' }),
        ),
        year,
      },
      {
        color: getCSSValue('--resultat-et-publication'),
        data: [
          {
            y: allWithPublicationsAndResultsPercent,
            y_abs: allWithPublicationsAndResults,
            y_tot: all,
          },
          {
            y: industrialWithPublicationsAndResultsPercent,
            y_abs: industrialWithPublicationsAndResults,
            y_tot: industrial.doc_count,
          },
          {
            y: academicWithPublicationsAndResultsPercent,
            y_abs: academicWithPublicationsAndResults,
            y_tot: academic.doc_count,
          },
        ],
        id: 'has_publications_and_results',
        index: 1,
        name: capitalize(
          intl.formatMessage({ id: 'app.studies.results-and-publications' }),
        ),
        year,
      },
    ];

    return { dataGraph: { categories, series }, dataTitle: { year } };
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
