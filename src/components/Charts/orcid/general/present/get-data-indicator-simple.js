import Axios from 'axios';
// import Highcharts from 'highcharts';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_ORCID_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, getObservationLabel } from '../../../../../utils/helpers';

// const indicators = ['active', 'has_id_hal_abes', 'has_id_hal_aurehal', 'has_idref_abes', 'has_idref_aurehal', 'has_work', 'has_work_from_hal', 'same_id_hal', 'same_idref', 'current_employment_fr_has_id'];
function useGetData(
  beforeLastObservationSnap,
  observationSnap,
  domain,
  indicator1,
  indicator2,
  size,
  missing,
  color,
) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const queries = [];
      const queryCurrent = getFetchOptions({
        key: 'orcidIndicator',
        domain,
        parameters: [indicator1, indicator2, size, missing],
        objectType: ['orcid'],
      });
      queries.push(Axios.post(ES_ORCID_API_URL, queryCurrent, HEADERS));
      const res = await Axios.all(queries);
      const data = res[0].data.aggregations.my_indicator1.buckets.filter(
        (el) => el.doc_count > 0,
      )[0];
      const total = data.doc_count;
      const other = data.my_indicator2.sum_other_doc_count;
      // const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const categories = [];
      const myData = [];
      const myColor = color;
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      data.my_indicator2.buckets.forEach((el) => {
        categories.push(el.key);
        myData.push({
          y: (el.doc_count * 100) / total,
          y_abs: el.doc_count,
          y_tot: total,
          source: el.key,
        });
      });
      categories.push('other');
      myData.push({
        y: (other * 100) / total,
        y_abs: other,
        y_tot: total,
        source: 'other',
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
      indicator1,
      indicator2,
      intl,
      missing,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationSnap]);

  return { allData, isError, isLoading };
}
export default useGetData;
