import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getObservationLabel,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';

function useGetData(beforeLastObservationSnap, observationSnap, domain) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions({
        key: 'datasetsWithAtLeastOneExplicitMentionByDiscipline',
        domain,
        parameters: [lastObservationSnap],
        objectType: ['publications'],
      });
      const res = await Axios.post(ES_API_URL, query, HEADERS);
      const data = res.data.aggregations.by_discipline.buckets;
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const categories = [];
      const categoriesComments = [];
      const publications = [];
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      data
        .filter((item) => item.key !== 'unknown')
        .forEach((item, catIndex) => {
          const numberOfDatasetsWithImplicitMentionsOnly = item.is_implicit.buckets.find((item2) => item2.key === 1)
            ?.doc_count || 0;
          const numberOfDatasetsWithAtLeastOneExplicitMention = item.is_implicit.buckets.find((item2) => item2.key === 0)
            ?.doc_count || 0;
          const numberOfDatasets = numberOfDatasetsWithImplicitMentionsOnly
            + numberOfDatasetsWithAtLeastOneExplicitMention;
          const nameClean = item.key.replace(/\n/g, '').replace('  ', ' ');
          categories.push({
            key: nameClean,
            staff: numberOfDatasets,
            percent:
              (numberOfDatasetsWithAtLeastOneExplicitMention
                / numberOfDatasets)
              * 100,
          });
          categoriesComments.push(
            capitalize(
              intl.formatMessage({ id: `app.discipline.${nameClean}` }),
            ),
          );
          publications.push({
            bsoDomain,
            discipline: categoriesComments[catIndex],
            publicationDate:
              getPublicationYearFromObservationSnap(lastObservationSnap),
            x: catIndex,
            y_abs: numberOfDatasetsWithAtLeastOneExplicitMention,
            y_tot: numberOfDatasets,
            y:
              (numberOfDatasetsWithAtLeastOneExplicitMention
                / numberOfDatasets)
              * 100,
          });
        });

      const dataGraph = [
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.publication',
            }),
          ),
          data: publications,
          color: getCSSValue('--orange-soft-100'),
          dataLabels: noOutline,
        },
      ];

      const comments = {
        publicationYear: getObservationLabel(beforeLastObservationSnap, intl),
      };

      return {
        categories,
        comments,
        dataGraph,
      };
    },
    [beforeLastObservationSnap, domain, intl],
  );

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataForLastObservationSnap(observationSnap);
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
  }, [observationSnap]);

  return { allData, isError, isLoading };
}

export default useGetData;
