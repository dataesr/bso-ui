import Axios from 'axios';
// import Highcharts from 'highcharts';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_ORCID_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getObservationLabel,
} from '../../../../../utils/helpers';

// const indicators = ['active', 'has_id_hal_abes', 'has_id_hal_aurehal', 'has_idref_abes', 'has_idref_aurehal', 'has_work', 'has_work_from_hal', 'same_id_hal', 'same_idref', 'current_employment_fr_has_id'];
function useGetData(
  beforeLastObservationSnap,
  observationSnap,
  domain,
  indicator,
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
        parameters: [indicator],
        objectType: ['orcid'],
      });
      queries.push(Axios.post(ES_ORCID_API_URL, queryCurrent, HEADERS));
      const res = await Axios.all(queries);
      const data = res[0].data.aggregations.fr_reason.buckets;
      // const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const categories = [];
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      const indicTrue = [];
      const indicFalse = [];
      data.forEach((el) => {
        categories.push(el.key);
        const nbTrue = el.my_indicator.buckets.find(
          (b) => b.key_as_string === 'true',
        ).doc_count;
        const nbFalse = el.my_indicator.buckets.find(
          (b) => b.key_as_string === 'false',
        ).doc_count;
        const nbTot = nbTrue + nbFalse;
        indicTrue.push({
          y_tot: nbTrue,
          y: (nbTrue * 100) / nbTot,
          fr_reason: el.key,
        });
        indicFalse.push({
          y_tot: nbFalse,
          y: (nbFalse * 100) / nbTot,
          fr_reason: el.key,
        });
      });
      const dataGraph = [
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.orcid-count',
            }),
          ),
          data: indicTrue,
          color: getCSSValue('--green-medium-125'),
          dataLabels: noOutline,
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.orcid-inactive',
            }),
          ),
          data: indicFalse,
          color: getCSSValue('--yellow-medium-125'),
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
    [beforeLastObservationSnap, domain, intl, indicator],
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
