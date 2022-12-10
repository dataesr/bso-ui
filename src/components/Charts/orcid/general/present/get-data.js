import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_ORCID_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getObservationLabel,
} from '../../../../../utils/helpers';

function useGetData(beforeLastObservationSnap, observationSnap, domain) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions({
        key: 'orcid',
        domain,
        parameters: [
          lastObservationSnap,
          `oa_details.${lastObservationSnap}.repositories_concat.keyword`,
          'year',
          2010,
          50,
        ],
        objectType: ['orcid'],
      });
      const res = await Axios.post(ES_ORCID_API_URL, query, HEADERS);
      const data = res.data.aggregations.by_year.buckets.sort(
        (a, b) => a.key - b.key,
      );
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const categories = [];
      const address = [];
      const employment = [];
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      data.forEach((el) => {
        categories.push(el.key);
        const addressCurrent = el.by_reason.buckets.find((item) => item.key === 'address')
          ?.doc_count || 0;
        const employmentCurrent = el.by_reason.buckets.find((item) => item.key === 'employment')
          ?.doc_count || 0;
        const totalCurrent = addressCurrent + employmentCurrent;
        address.push({
          y_perc: (100 * addressCurrent) / totalCurrent,
          y: addressCurrent,
          y_tot: totalCurrent,
          year: el.key,
          bsoDomain,
        });
        employment.push({
          y_perc: (100 * employmentCurrent) / totalCurrent,
          y: employmentCurrent,
          y_tot: totalCurrent,
          year: el.key,
          bsoDomain,
        });
      });

      const dataGraph = [
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.hal-only',
            }),
          ),
          data: address,
          color: getCSSValue('--green-medium-125'),
          dataLabels: noOutline,
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.hal-these',
            }),
          ),
          data: employment,
          color: getCSSValue('--theseshal'),
          dataLabels: noOutline,
        },
      ];

      const comments = {
        beforeLastObservationSnap: getObservationLabel(
          beforeLastObservationSnap,
          intl,
        ),
        lastObservationSnap: getObservationLabel(lastObservationSnap, intl),
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
