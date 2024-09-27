import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, getCSSValue } from '../../../../../utils/helpers';

function useGetData(observationSnap, domain) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions({
        key: 'codeWithAtLeastOneExplicitMention',
        domain,
        parameters: [lastObservationSnap],
        objectType: ['publications'],
      });
      const res = await Axios.post(ES_API_URL, query, HEADERS);
      const data = res.data.aggregations.by_publication_year.buckets.sort(
        (a, b) => a.key - b.key,
      );
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const years = [];
      const publications = [];
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      data
        .filter(
          (el) => el.key > 2012
            && lastObservationSnap.length
            && parseInt(el.key, 10)
              < parseInt(lastObservationSnap?.substring(0, 4), 10),
        )
        .forEach((el) => {
          years.push(el.key);
          const numberOfSoftwareWithImplicitMentionsOnly = el.is_implicit.buckets.find((item) => item.key === 1)?.doc_count
            || 0;
          const numberOfSoftwareWithAtLeastOneExplicitMention = el.is_implicit.buckets.find((item) => item.key === 0)?.doc_count
            || 0;
          const numberOfSoftware = numberOfSoftwareWithImplicitMentionsOnly
            + numberOfSoftwareWithAtLeastOneExplicitMention;
          publications.push({
            y:
              (numberOfSoftwareWithAtLeastOneExplicitMention
                / numberOfSoftware)
              * 100,
            y_abs: numberOfSoftwareWithAtLeastOneExplicitMention,
            y_tot: numberOfSoftware,
            x: el.key,
            bsoDomain,
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
          color: getCSSValue('--publication-100'),
          dataLabels: noOutline,
        },
      ];

      return {
        categories: years,
        dataGraph,
      };
    },
    [domain, intl],
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
