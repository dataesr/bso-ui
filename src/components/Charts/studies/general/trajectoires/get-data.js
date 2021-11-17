import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType) {
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const location = useLocation();

  async function getDataAxios() {
    const query = getFetchOptions(
      'studiesTrajectoires',
      '',
      location,
      studyType,
    );
    const res = await Axios.post(ES_STUDIES_API_URL, query, HEADERS);
    const dataGraph = [];
    const data = res.data.aggregations.by_status.buckets;
    const toShow = [
      'Completed',
      'Completed-has_result',
      'Completed-no_result',
      'Completed-has_result-has_publications_result',
      'Completed-has_result-has_publications_result-closed',
      'Completed-has_result-has_publications_result-is_oa',
      'Completed-has_result-no_publications_result',
    ];
    //  'Ongoing',
    //  'Ongoing-has_result',
    //  'Ongoing-no_result',
    //  'Ongoing-has_result-has_publications_result',
    //  'Ongoing-has_result-has_publications_result-closed',
    //  'Ongoing-has_result-has_publications_result-is_oa',
    //  'Ongoing-has_result-no_publications_result',
    //  'Unknown',
    //  'Unknown-has_result',
    //  'Unknowns-no_result',
    //  'Unknown-has_result-has_publications_result',
    //  'Unknown-has_result-has_publications_result-closed',
    //  'Unknown-has_result-has_publications_result-is_oa',
    //  'Unknown-has_result-no_publications_result',

    const intlKey = `app.health-${studyType.toLowerCase()}.general.sankey`;
    const nodeColor = {
      Completed: getCSSValue('--patient-125'),
      Unknown: getCSSValue('--patient-75'),
      Ongoing: getCSSValue('--patient-100'),
      closed: getCSSValue('--acces-ferme'),
      is_oa: getCSSValue('--acces-ouvert'),
      has_result: getCSSValue('--acces-ouvert'),
      no_result: getCSSValue('--negatif'),
      has_publications_result: getCSSValue('--publication-100'),
      no_publications_result: getCSSValue('--g-600'),
      start: getCSSValue('--patient-50'),
    };
    const fstLevel = false;
    data.forEach((el) => {
      if (toShow.includes(el.key)) {
        // 1er niveau
        if (fstLevel) {
          dataGraph.push({
            from: intl.formatMessage({ id: `${intlKey}.start.label` }),
            to: el.key,
            weight: el.doc_count,
            color: {
              linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
              stops: [
                [0, nodeColor.start],
                [1, nodeColor[el.key]],
              ],
            },
          });
        }

        // by_has_results;
        el.by_has_results.buckets.forEach((elA) => {
          const elAName = elA.key
            ? `${el.key}-has_result`
            : `${el.key}-no_result`;

          // by_has_publications_result
          if (toShow.includes(elAName)) {
            dataGraph.push({
              from: el.key,
              to: elAName,
              weight: elA.doc_count,
              color: {
                linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
                stops: [
                  [0, nodeColor[el.key]],
                  [1, nodeColor[elA.key ? 'has_result' : 'no_result']],
                ],
              },
            });

            elA.by_has_publications_result.buckets.forEach((elB) => {
              const elBName = elB.key
                ? `${elAName}-has_publications_result`
                : `${elAName}-no_publications_result`;

              if (toShow.includes(elBName)) {
                dataGraph.push({
                  from: elAName,
                  to: elBName,
                  weight: elB.doc_count,
                  color: {
                    linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
                    stops: [
                      [0, nodeColor[elA.key ? 'has_result' : 'no_result']],
                      [
                        1,
                        nodeColor[
                          elB.key
                            ? 'has_publications_result'
                            : 'no_publications_result'
                        ],
                      ],
                    ],
                  },
                });

                // by_has_publication_oa
                elB.by_has_publication_oa.buckets.forEach((elC) => {
                  const elCName = elC.key
                    ? `${elBName}-is_oa`
                    : `${elBName}-closed`;
                  if (toShow.includes(elCName)) {
                    dataGraph.push({
                      from: elBName,
                      to: elCName,
                      weight: elC.doc_count,
                      color: {
                        linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
                        stops: [
                          [
                            0,
                            nodeColor[
                              elB.key
                                ? 'has_publications_result'
                                : 'no_publications_result'
                            ],
                          ],
                          [1, nodeColor[elC.key ? 'is_oa' : 'closed']],
                        ],
                      },
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
    return dataGraph;
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

  return { allData, isLoading, isError };
}
export default useGetData;
