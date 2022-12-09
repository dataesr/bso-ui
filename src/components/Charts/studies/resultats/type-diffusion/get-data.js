import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType, sponsorType = '*') {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  async function getDataAxios() {
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
      label: intl.formatMessage({ id: `app.sponsor.${st}` }),
      value: st,
    }));

    const currentYear = parseInt(
      process.env.REACT_APP_LAST_OBSERVATION.substr(0, 4),
      10,
    );
    const yearMin = currentYear - 11;
    const yearMax = currentYear - 1;
    const queries = [];
    const query1 = getFetchOptions({
      key: 'studiesResultsTypeDiffusion',
      parameters: [studyType, sponsorType, yearMin, yearMax],
      objectType: ['clinicalTrials'],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, query1, HEADERS));
    const query2 = getFetchOptions({
      key: 'studiesResultsTypeDiffusionTypeIntervention',
      parameters: [studyType, sponsorType, yearMin, yearMax],
      objectType: ['clinicalTrials'],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, query2, HEADERS));
    const res = await Axios.all(queries);
    const data1 = res[0].data.aggregations;
    let data1Total = data1.by_has_result.buckets.find((ele) => ele.key === 0)?.doc_count || 0;
    data1Total
      += data1.by_has_result.buckets.find((ele) => ele.key === 1)?.doc_count || 0;
    const dataGraph1 = {
      categories: [
        capitalize(
          intl.formatMessage({
            id: 'app.studies.no-results-publications',
          }),
        ),
        capitalize(
          intl.formatMessage({
            id: 'app.studies.results-and-publications',
          }),
        ),
        capitalize(
          intl.formatMessage({
            id: 'app.studies.publications-only',
          }),
        ),
        capitalize(
          intl.formatMessage({
            id: 'app.studies.results-only',
          }),
        ),
      ],
      series: [
        {
          data: [
            {
              name: capitalize(
                intl.formatMessage({
                  id: 'app.studies.no-results-publications',
                }),
              ),
              y_abs: data1.by_has_result.buckets
                .find((ele) => ele.key === 0)
                ?.by_has_publications_result.buckets.find(
                  (ele) => ele.key === 0,
                )?.doc_count,
              y:
                (100
                  * (data1.by_has_result.buckets
                    .find((ele) => ele.key === 0)
                    ?.by_has_publications_result.buckets.find(
                      (ele) => ele.key === 0,
                    )?.doc_count || 0))
                / data1Total,
              y_tot: data1Total,
              yearMin,
              yearMax,
              color: getCSSValue('--g-400'),
            },
            {
              name: capitalize(
                intl.formatMessage({
                  id: 'app.studies.results-and-publications',
                }),
              ),
              y_abs: data1.by_has_result.buckets
                .find((ele) => ele.key === 1)
                ?.by_has_publications_result.buckets.find(
                  (ele) => ele.key === 1,
                )?.doc_count,
              y:
                (100
                  * (data1.by_has_result.buckets
                    .find((ele) => ele.key === 1)
                    ?.by_has_publications_result.buckets.find(
                      (ele) => ele.key === 1,
                    )?.doc_count || 0))
                / data1Total,
              y_tot: data1Total,
              yearMin,
              yearMax,
              color: getCSSValue('--resultat-et-publication'),
            },
            {
              name: capitalize(
                intl.formatMessage({
                  id: 'app.studies.publications-only',
                }),
              ),
              y_abs: data1.by_has_result.buckets
                .find((ele) => ele.key === 0)
                ?.by_has_publications_result.buckets.find(
                  (ele) => ele.key === 1,
                )?.doc_count,
              y:
                (100
                  * (data1.by_has_result.buckets
                    .find((ele) => ele.key === 0)
                    ?.by_has_publications_result.buckets.find(
                      (ele) => ele.key === 1,
                    )?.doc_count || 0))
                / data1Total,
              y_tot: data1Total,
              yearMin,
              yearMax,
              color: getCSSValue('--publication-100'),
            },
            {
              name: capitalize(
                intl.formatMessage({
                  id: 'app.studies.results-only',
                }),
              ),
              y_abs: data1.by_has_result.buckets
                .find((ele) => ele.key === 1)
                ?.by_has_publications_result.buckets.find(
                  (ele) => ele.key === 0,
                )?.doc_count,
              y:
                (100
                  * (data1.by_has_result.buckets
                    .find((ele) => ele.key === 1)
                    ?.by_has_publications_result.buckets.find(
                      (ele) => ele.key === 0,
                    )?.doc_count || 0))
                / data1Total,
              y_tot: data1Total,
              yearMin,
              yearMax,
              color: getCSSValue('--resultat-100'),
            },
          ],
        },
      ],
    };
    const THRESHOLD = 29;
    const data2 = res[1].data.aggregations.by_intervention_type.buckets.filter(
      (el) => el.doc_count > THRESHOLD,
    );
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
            yearMin,
            yearMax,
            intervention_type: intl.formatMessage({
              id: `app.studies.intervention-type.${el.key}`,
            }),
          })),
          color: getCSSValue('--g-400'),
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.studies.results-or-publications',
            }),
          ),
          data: data2.map((el) => ({
            y_abs:
              (el.by_has_result.buckets
                .find((ele) => ele.key === 1)
                ?.by_has_publications_result.buckets.find(
                  (ele) => ele.key === 1,
                )?.doc_count || 0)
              + (el.by_has_result.buckets
                .find((ele) => ele.key === 1)
                ?.by_has_publications_result.buckets.find(
                  (ele) => ele.key === 0,
                )?.doc_count || 0)
              + (el.by_has_result.buckets
                .find((ele) => ele.key === 0)
                ?.by_has_publications_result.buckets.find(
                  (ele) => ele.key === 1,
                )?.doc_count || 0),
            y:
              (100
                * ((el.by_has_result.buckets
                  .find((ele) => ele.key === 1)
                  ?.by_has_publications_result.buckets.find(
                    (ele) => ele.key === 1,
                  )?.doc_count || 0)
                  + (el.by_has_result.buckets
                    .find((ele) => ele.key === 1)
                    ?.by_has_publications_result.buckets.find(
                      (ele) => ele.key === 0,
                    )?.doc_count || 0)
                  + (el.by_has_result.buckets
                    .find((ele) => ele.key === 0)
                    ?.by_has_publications_result.buckets.find(
                      (ele) => ele.key === 1,
                    )?.doc_count || 0)))
              / el.doc_count,
            y_tot: el.doc_count,
            yearMin,
            yearMax,
            intervention_type: intl.formatMessage({
              id: `app.studies.intervention-type.${el.key}`,
            }),
          })),
          color: getCSSValue('--resultat-ou-publication'),
        },
        /*
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
            yearMin,
            yearMax,
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
            yearMin,
            yearMax,
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
            yearMin,
            yearMax,
            intervention_type: intl.formatMessage({
              id: `app.studies.intervention-type.${el.key}`,
            }),
          })),
          color: getCSSValue('--resultat-100'),
        }, */
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
