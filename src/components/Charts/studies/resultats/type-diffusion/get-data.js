import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType, sponsorType = '*') {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const location = useLocation().search;

  async function getDataAxios() {
    const querySponsorTypes = getFetchOptions({
      key: 'sponsorsTypesList',
      location,
      parameters: [studyType],
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

    const queries = [];
    const query1 = getFetchOptions({
      key: 'studiesResultsTypeDiffusion',
      location,
      parameters: [studyType, sponsorType],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, query1, HEADERS));
    const query2 = getFetchOptions({
      key: 'studiesResultsTypeDiffusionTypeIntervention',
      location,
      parameters: [studyType, sponsorType],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, query2, HEADERS));
    const res = await Axios.all(queries);
    const currentYear = new Date().getFullYear();
    const data1SortedByYear = res[0].data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2010 && y.key <= currentYear);
    const dataGraph1 = {
      categories: data1SortedByYear.map((el) => el.key),
      series: [
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.studies.no-results-publications',
            }),
          ),
          data: data1SortedByYear.map((el) => ({
            y_abs: el.by_has_result.buckets
              .find((ele) => ele.key === 0)
              ?.by_has_publications_result.buckets.find((ele) => ele.key === 0)
              ?.doc_count,
            y:
              (100
                * (el.by_has_result.buckets
                  .find((ele) => ele.key === 0)
                  ?.by_has_publications_result.buckets.find(
                    (ele) => ele.key === 0,
                  )?.doc_count || 0))
              / el.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--g-400'),
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.studies.results-and-publications',
            }),
          ),
          data: data1SortedByYear.map((el) => ({
            y_abs: el.by_has_result.buckets
              .find((ele) => ele.key === 1)
              ?.by_has_publications_result.buckets.find((ele) => ele.key === 1)
              ?.doc_count,
            y:
              (100
                * (el.by_has_result.buckets
                  .find((ele) => ele.key === 1)
                  ?.by_has_publications_result.buckets.find(
                    (ele) => ele.key === 1,
                  )?.doc_count || 0))
              / el.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--resultat-et-publication'),
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.studies.publications-only',
            }),
          ),
          data: data1SortedByYear.map((el) => ({
            y_abs: el.by_has_result.buckets
              .find((ele) => ele.key === 0)
              ?.by_has_publications_result.buckets.find((ele) => ele.key === 1)
              ?.doc_count,
            y:
              (100
                * (el.by_has_result.buckets
                  .find((ele) => ele.key === 0)
                  ?.by_has_publications_result.buckets.find(
                    (ele) => ele.key === 1,
                  )?.doc_count || 0))
              / el.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--publication-100'),
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.studies.results-only',
            }),
          ),
          data: data1SortedByYear.map((el) => ({
            y_abs: el.by_has_result.buckets
              .find((ele) => ele.key === 1)
              ?.by_has_publications_result.buckets.find((ele) => ele.key === 0)
              ?.doc_count,
            y:
              (100
                * (el.by_has_result.buckets
                  .find((ele) => ele.key === 1)
                  ?.by_has_publications_result.buckets.find(
                    (ele) => ele.key === 0,
                  )?.doc_count || 0))
              / el.doc_count,
            y_tot: el.doc_count,
            year: el.key,
          })),
          color: getCSSValue('--resultat-100'),
        },
      ],
    };
    const data2 = res[1].data.aggregations.by_intervention_type.buckets;
    const dataGraph2 = {
      categories: data2.map((el) => intl.formatMessage({ id: `app.studies.intervention-type.${el.key}` })),
      series: [
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.studies.no-results-publications',
            }),
          ),
          data: data2.map((el) => ({
            y_abs:
              el.by_has_result.buckets
                .find((ele) => ele.key === 0)
                ?.by_has_publications_result.buckets.find(
                  (ele) => ele.key === 0,
                )?.doc_count || 0,
            y:
              (100
                * (el.by_has_result.buckets
                  .find((ele) => ele.key === 0)
                  ?.by_has_publications_result.buckets.find(
                    (ele) => ele.key === 0,
                  )?.doc_count || 0))
              / el.doc_count,
            y_tot: el.doc_count,
            intervention_type: intl.formatMessage({
              id: `app.studies.intervention-type.${el.key}`,
            }),
          })),
          color: getCSSValue('--g-400'),
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.studies.results-and-publications',
            }),
          ),
          data: data2.map((el) => ({
            y_abs:
              el.by_has_result.buckets
                .find((ele) => ele.key === 1)
                ?.by_has_publications_result.buckets.find(
                  (ele) => ele.key === 1,
                )?.doc_count || 0,
            y:
              (100
                * (el.by_has_result.buckets
                  .find((ele) => ele.key === 1)
                  ?.by_has_publications_result.buckets.find(
                    (ele) => ele.key === 1,
                  )?.doc_count || 0))
              / el.doc_count,
            y_tot: el.doc_count,
            intervention_type: intl.formatMessage({
              id: `app.studies.intervention-type.${el.key}`,
            }),
          })),
          color: getCSSValue('--resultat-et-publication'),
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.studies.publications-only',
            }),
          ),
          data: data2.map((el) => ({
            y_abs:
              el.by_has_result.buckets
                .find((ele) => ele.key === 0)
                ?.by_has_publications_result.buckets.find(
                  (ele) => ele.key === 1,
                )?.doc_count || 0,
            y:
              (100
                * (el.by_has_result.buckets
                  .find((ele) => ele.key === 0)
                  ?.by_has_publications_result.buckets.find(
                    (ele) => ele.key === 1,
                  )?.doc_count || 0))
              / el.doc_count,
            y_tot: el.doc_count,
            intervention_type: intl.formatMessage({
              id: `app.studies.intervention-type.${el.key}`,
            }),
          })),
          color: getCSSValue('--publication-100'),
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.studies.results-only',
            }),
          ),
          data: data2.map((el) => ({
            y_abs:
              el.by_has_result.buckets
                .find((ele) => ele.key === 1)
                ?.by_has_publications_result.buckets.find(
                  (ele) => ele.key === 0,
                )?.doc_count || 0,
            y:
              (100
                * (el.by_has_result.buckets
                  .find((ele) => ele.key === 1)
                  ?.by_has_publications_result.buckets.find(
                    (ele) => ele.key === 0,
                  )?.doc_count || 0))
              / el.doc_count,
            y_tot: el.doc_count,
            intervention_type: intl.formatMessage({
              id: `app.studies.intervention-type.${el.key}`,
            }),
          })),
          color: getCSSValue('--resultat-100'),
        },
      ],
    };
    return { sponsorTypes, dataGraph1, dataGraph2 };
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
  }, [studyType, sponsorType]);

  return { allData, isLoading, isError };
}
export default useGetData;
