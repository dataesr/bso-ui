import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_ORCID_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, getObservationLabel } from '../../../../../utils/helpers';

function useGetData(
  beforeLastObservationSnap,
  observationSnap,
  domain,
  filter1,
  indicator1,
  indicator2,
  legendTrue,
  legendFalse,
  colorTrue,
  colorFalse,
  size1,
  size2,
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
        parameters: [filter1, indicator1, indicator2, size1, size2],
        objectType: ['orcid'],
      });
      if (indicator2 === 'same_idref') {
        queryCurrent.query.bool.filter.push({ term: { has_idref_abes: true } });
        queryCurrent.query.bool.filter.push({
          term: { has_idref_aurehal: true },
        });
      }
      if (indicator2 === 'same_id_hal') {
        queryCurrent.query.bool.filter.push({
          term: { has_id_hal_abes: true },
        });
        queryCurrent.query.bool.filter.push({
          term: { has_id_hal_aurehal: true },
        });
      }
      queries.push(Axios.post(ES_ORCID_API_URL, queryCurrent, HEADERS));
      const res = await Axios.all(queries);
      const data = res[0].data.aggregations.my_indicator1.buckets;
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
      domain,
      filter1,
      indicator1,
      indicator2,
      size1,
      size2,
      intl,
      legendTrue,
      colorTrue,
      legendFalse,
      colorFalse,
      beforeLastObservationSnap,
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
