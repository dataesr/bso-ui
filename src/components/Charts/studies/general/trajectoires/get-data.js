/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';

function useGetData(studyType) {
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const intl = useIntl();

  async function getDataAxios() {
    const query = getFetchOptions('studiesTrajectoires', '', studyType);

    const res = await Axios.post(ES_STUDIES_API_URL, query, HEADERS).catch(
      (e) => console.log(e),
    );

    const dataGraph = [];
    const data = res.data.aggregations.by_status.buckets;
    const toShow = [
      'Completed',
      'Completed-has_result',
      'Completed-no_result',
      'Completed-has_result-has_publications_result',
      'Completed-has_result-no_publications_result',
      // 'Completed-has_result-no_publications_result-closed',
      'Recruiting',
      'Recruiting-has_result',
      'Recruiting-no_result',
      'Recruiting-has_result-has_publications_result',
      // 'Unknown status',
      // 'Unknown status-has_result',
      // 'Unknown status-no_result',
      // 'Unknown status-has_result-has_publications_result',
      'Not yet recruiting',
      'Not yet recruiting-has_result',
      'Not yet recruiting-no_result',
      'Not yet recruiting-has_result-has_publications_result',
      'Active, not recruiting',
      'Active, not recruiting-has_result',
      'Active, not recruiting-no_result',
      'Active, not recruiting-has_result-has_publications_result',
      'Terminated',
      'Terminated-has_result',
      'Terminated-no_result',
      'Terminated-has_result-has_publications_result',
      'Enrolling by invitation',
      'Enrolling by invitation-has_result',
      'Enrolling by invitation-no_result',
      'Enrolling by invitation-has_result-has_publications_result',
      'Withdrawn',
      'Withdrawn-has_result',
      'Withdrawn-no_result',
      'Withdrawn-has_result-has_publications_result',
      'Suspended',
      'Suspended-has_result',
      'Suspended-no_result',
      'Suspended-has_result-has_publications_result',
    ];

    const intlKey = `app.health-${studyType.toLowerCase()}.studies.general.sankey`;

    data.forEach((el) => {
      if (toShow.includes(el.key)) {
        // 1er niveau
        dataGraph.push([
          'start',
          el.key,
          el.doc_count,
          intl.formatMessage({ id: `${intlKey}.${el.key}.label` }),
        ]);

        // by_has_results;
        el.by_has_results.buckets.forEach((elA) => {
          const elAName = elA.key
            ? `${el.key}-has_result`
            : `${el.key}-no_result`;

          // by_has_publications_result
          if (toShow.includes(elAName)) {
            dataGraph.push([
              el.key,
              elAName,
              elA.doc_count,
              intl.formatMessage({ id: `${intlKey}.${elAName}.label` }),
            ]);

            elA.by_has_publications_result.buckets.forEach((elB) => {
              const elBName = elB.key
                ? `${elAName}-has_publications_result`
                : `${elAName}-no_publications_result`;

              if (toShow.includes(elBName)) {
                dataGraph.push([
                  elAName,
                  elBName,
                  elB.doc_count,
                  intl.formatMessage({ id: `${intlKey}.${elBName}.label` }),
                ]);

                // by_has_publication_oa
                elB.by_has_publication_oa.buckets.forEach((elC) => {
                  const elCName = elC.key
                    ? `${elBName}-is_oa`
                    : `${elBName}-closed`;
                  if (toShow.includes(elCName)) {
                    dataGraph.push([
                      elBName,
                      elCName,
                      elC.doc_count,
                      intl.formatMessage({ id: `${intlKey}.${elCName}.label` }),
                    ]);
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
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyType]);

  return { allData, isLoading };
}
export default useGetData;
