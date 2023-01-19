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
  legendTrue,
  legendFalse,
  colorTrue,
  colorFalse,
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
        parameters: [indicator1, indicator2, 10],
        objectType: ['orcid'],
      });
      queries.push(Axios.post(ES_ORCID_API_URL, queryCurrent, HEADERS));
      const res = await Axios.all(queries);
      const data = res[0].data.aggregations.my_indicator1.buckets;
      // const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const categories = [];
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      const indicTrue = [];
      const indicFalse = [];
      let nbTrueAll = 0;
      let nbFalseAll = 0;
      let nbTotAll = 0;
      data.forEach((el) => {
        categories.push(
          intl.formatMessage({ id: 'app.orcid.'.concat(el.key) }),
        );
        const nbTrue = el.my_indicator2.buckets.find((b) => b.key_as_string === 'true')
          ?.doc_count || 0;
        const nbFalse = el.my_indicator2.buckets.find((b) => b.key_as_string === 'false')
          ?.doc_count || 0;
        const nbTot = nbTrue + nbFalse || 0;
        nbTrueAll += nbTrue;
        nbFalseAll += nbFalse;
        if (nbTrue > 0) {
          indicTrue.push({
            y_abs: nbTrue,
            y_tot: nbTot,
            y: (nbTrue * 100) / nbTot,
            fr_reason: intl.formatMessage({ id: 'app.orcid.'.concat(el.key) }),
          });
          indicFalse.push({
            y_abs: nbFalse,
            y_tot: nbTot,
            y: (nbFalse * 100) / nbTot,
            fr_reason: intl.formatMessage({ id: 'app.orcid.'.concat(el.key) }),
          });
        }
      });
      nbTotAll = nbTrueAll + nbFalseAll;
      if (indicTrue.length > 1) {
        indicTrue.push({
          y_abs: nbTrueAll,
          y_tot: nbTotAll,
          y: (nbTrueAll * 100) / nbTotAll,
          fr_reason: intl.formatMessage({ id: 'app.orcid.fr-all' }),
        });
        indicFalse.push({
          y_abs: nbFalseAll,
          y_tot: nbTotAll,
          y: (nbFalseAll * 100) / nbTotAll,
          fr_reason: intl.formatMessage({ id: 'app.orcid.fr-all' }),
        });
        categories.push(intl.formatMessage({ id: 'app.orcid.fr-all' }));
      }
      const dataGraph = [
        {
          name: capitalize(
            intl.formatMessage({
              id: legendTrue,
            }),
          ),
          data: indicTrue,
          color: colorTrue,
          dataLabels: noOutline,
        },
        {
          name: capitalize(
            intl.formatMessage({
              id: legendFalse,
            }),
          ),
          data: indicFalse,
          color: colorFalse,
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
      domain,
      intl,
      indicator1,
      indicator2,
      colorFalse,
      colorTrue,
      legendFalse,
      legendTrue,
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
