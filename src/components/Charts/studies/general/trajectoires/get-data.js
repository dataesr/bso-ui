import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType) {
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();

  async function getDataAxios() {
    const query = getFetchOptions('studiesTrajectoires', '', studyType);

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
      // 'Completed-has_result-no_publications_result-closed',
      // 'Completed-has_result-no_publications_result-is_oa',
      'Recruiting',
      'Recruiting-has_result',
      'Recruiting-no_result',
      'Recruiting-has_result-has_publications_result',
      'Recruiting-has_result-has_publications_result-closed',
      'Recruiting-has_result-has_publications_result-is_oa',
      'Recruiting-has_result-no_publications_result',
      // 'Recruiting-has_result-no_publications_result-closed',
      // 'Recruiting-has_result-no_publications_result-is_oa',
      // 'Unknown status',
      // 'Unknown status-has_result',
      // 'Unknown status-no_result',
      // 'Unknown status-has_result-has_publications_result',
      // 'Unknown status-has_result-has_publications_result-closed',
      // 'Unknown status-has_result-has_publications_result-is_oa',
      // 'Unknown status-has_result-no_publications_result',
      // 'Unknown status-has_result-no_publications_result-closed',
      // 'Unknown status-has_result-no_publications_result-is_oa',
      'Not yet recruiting',
      'Not yet recruiting-has_result',
      'Not yet recruiting-no_result',
      'Not yet recruiting-has_result-has_publications_result',
      'Not yet recruiting-has_result-has_publications_result-closed',
      'Not yet recruiting-has_result-has_publications_result-is_oa',
      'Not yet recruiting-has_result-no_publications_result',
      // 'Not yet recruiting-has_result-no_publications_result-closed',
      // 'Not yet recruiting-has_result-no_publications_result-is_oa',
      'Active, not recruiting',
      'Active, not recruiting-has_result',
      'Active, not recruiting-no_result',
      'Active, not recruiting-has_result-has_publications_result',
      'Active, not recruiting-has_result-has_publications_result-closed',
      'Active, not recruiting-has_result-has_publications_result-is_oa',
      'Active, not recruiting-has_result-no_publications_result',
      // 'Active, not recruiting-has_result-no_publications_result-closed',
      // 'Active, not recruiting-has_result-no_publications_result-is_oa',
      'Terminated',
      'Terminated-has_result',
      'Terminated-no_result',
      'Terminated-has_result-has_publications_result',
      'Terminated-has_result-has_publications_result-closed',
      'Terminated-has_result-has_publications_result-is_oa',
      'Terminated-has_result-no_publications_result',
      // 'Terminated-has_result-no_publications_result-closed',
      // 'Terminated-has_result-no_publications_result-is_oa',
      'Enrolling by invitation',
      'Enrolling by invitation-has_result',
      'Enrolling by invitation-no_result',
      'Enrolling by invitation-has_result-has_publications_result',
      'Enrolling by invitation-has_result-has_publications_result-closed',
      'Enrolling by invitation-has_result-has_publications_result-is_oa',
      'Enrolling by invitation-has_result-no_publications_result',
      // 'Enrolling by invitation-has_result-no_publications_result-closed',
      // 'Enrolling by invitation-has_result-no_publications_result-is_oa',
      'Withdrawn',
      'Withdrawn-has_result',
      'Withdrawn-no_result',
      'Withdrawn-has_result-has_publications_result',
      'Withdrawn-has_result-has_publications_result-closed',
      'Withdrawn-has_result-has_publications_result-is_oa',
      'Withdrawn-has_result-no_publications_result',
      // 'Withdrawn-has_result-no_publications_result-closed',
      // 'Withdrawn-has_result-no_publications_result-is_oa',
      'Suspended',
      'Suspended-has_result',
      'Suspended-no_result',
      'Suspended-has_result-has_publications_result',
      'Suspended-has_result-has_publications_result-closed',
      'Suspended-has_result-has_publications_result-is_oa',
      'Suspended-has_result-no_publications_result',
      // 'Suspended-has_result-no_publications_result-closed',
      // 'Suspended-has_result-no_publications_result-is_oa',
    ];

    const intlKey = `app.health-${studyType.toLowerCase()}.studies.general.sankey`;
    const color = {
      linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
      stops: [
        [0, 'rgba(98, 185, 58, 0.5)'],
        [1, getCSSValue('--g-500')],
      ],
    };

    data.forEach((el) => {
      if (toShow.includes(el.key)) {
        // 1er niveau
        dataGraph.push({
          from: intl.formatMessage({ id: `${intlKey}.start.label` }),
          to: el.key,
          weight: el.doc_count,
          color,
        });

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
              color,
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
                  color,
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
                      color,
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
