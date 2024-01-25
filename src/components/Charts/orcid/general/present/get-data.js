import Axios from 'axios';
import Highcharts from 'highcharts';
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
  const queries = [];
  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const queryAll = getFetchOptions({
        key: 'orcidNumber',
        domain,
        parameters: ['year', ['address', 'employment', 'education']],
        objectType: ['orcid'],
      });
      queries.push(Axios.post(ES_ORCID_API_URL, queryAll, HEADERS));
      const queryEmployment = getFetchOptions({
        key: 'orcidNumber',
        domain,
        parameters: ['year', ['employment']],
        objectType: ['orcid'],
      });
      queries.push(Axios.post(ES_ORCID_API_URL, queryEmployment, HEADERS));
      const res = await Axios.all(queries);
      const data = res[0].data.aggregations.orcid_per_year.buckets;
      const dataGraph2 = [
        {
          data: data.map((item) => ({
            y: item.doc_count,
            name: Highcharts.dateFormat(
              '%Y',
              new Date(item.key_as_string).getTime(),
            ),
          })),
        },
      ];
      const dataEmployment = res[1].data.aggregations.orcid_per_year.buckets;
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const categories = [];
      const total = [];
      const employment = [];
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      data.forEach((el) => {
        const currentDate = Highcharts.dateFormat(
          '%Y',
          new Date(el.key_as_string).getTime(),
        );
        categories.push(currentDate);
        total.push({
          x: total.length,
          y: el.total_orcid.value,
          y_current: el.distinct_orcid.value,
          creation_date: currentDate,
          bsoDomain,
        });
      });
      dataEmployment.forEach((el) => {
        const currentDate = Highcharts.dateFormat(
          '%Y',
          new Date(el.key_as_string).getTime(),
        );
        employment.push({
          bsoDomain,
          creation_date: currentDate,
          x: employment.length,
          y: el.total_orcid.value,
          y_current: el.distinct_orcid.value,
        });
      });

      const comments = {
        beforeLastObservationSnap: getObservationLabel(
          beforeLastObservationSnap,
          intl,
        ),
        lastObservationSnap: getObservationLabel(lastObservationSnap, intl),
      };

      const dataGraph = [
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.orcid.count',
            }),
          ),
          data: total,
          turboThreshold: 0,
          color: getCSSValue('--green-light-125'),
          dataLabels: noOutline,
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.orcid.employment-count',
            }),
          ),
          data: employment,
          turboThreshold: 0,
          color: getCSSValue('--affiliations-etablissements-125'),
          dataLabels: noOutline,
        },
      ];

      return {
        categories,
        comments,
        dataGraph,
        dataGraph2,
      };
    },
    [beforeLastObservationSnap, domain, intl, queries],
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
  }, [getDataForLastObservationSnap, observationSnap]);

  return { allData, isError, isLoading };
}
export default useGetData;
