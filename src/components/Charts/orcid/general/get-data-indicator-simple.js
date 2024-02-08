import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_ORCID_API_URL, HEADERS } from '../../../../config/config';
import getFetchOptions from '../../../../utils/chartFetchOptions';
import { capitalize, getObservationLabel } from '../../../../utils/helpers';

function useGetData(
  beforeLastObservationSnap,
  observationSnap,
  domain,
  filter1,
  indicator1,
  indicator2,
  size,
  color,
) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions({
        key: 'orcidIndicator',
        domain,
        parameters: [filter1, indicator1, indicator2, 10, size],
        objectType: ['orcid'],
      });
      const res = await Axios.post(ES_ORCID_API_URL, query, HEADERS);
      const data = res.data.aggregations.my_indicator1.buckets.filter(
        (el) => el.doc_count > 0,
      )[0];
      const total = data.doc_count;
      const other = data.my_indicator2.sum_other_doc_count;
      const categories = [];
      const myData = [];
      const myColor = color;
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      data.my_indicator2.buckets.forEach((el) => {
        categories.push(
          intl.formatMessage({
            id: `app.commons.${el.key}`,
            defaultMessage: el.key,
          }),
        );
        myData.push({
          y: (el.doc_count * 100) / total,
          y_abs: el.doc_count,
          y_tot: total,
          source: intl.formatMessage({
            id: `app.commons.${el.key}`,
            defaultMessage: el.key,
          }),
        });
      });
      categories.push(
        intl.formatMessage({
          id: 'app.commons.other',
          defaultMessage: 'Autre',
        }),
      );
      myData.push({
        y: (other * 100) / total,
        y_abs: other,
        y_tot: total,
        source: intl.formatMessage({
          id: 'app.commons.other',
          defaultMessage: 'Autre',
        }),
      });
      const dataGraph = [
        {
          name: capitalize(
            intl.formatMessage({
              id: 'myid',
            }),
          ),
          data: myData,
          color: myColor,
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
    [
      beforeLastObservationSnap,
      color,
      domain,
      filter1,
      indicator1,
      indicator2,
      intl,
      size,
    ],
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
