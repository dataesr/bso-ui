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
  legendTrue,
  colorTrue,
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
      queries.push(Axios.post(ES_ORCID_API_URL, queryCurrent, HEADERS));
      const res = await Axios.all(queries);
      let data = [];
      if (indicator1 === 'first_these_year') {
        data = res[0].data.aggregations.my_indicator1.buckets
          .sort((a, b) => a.key - b.key)
          .filter((a) => a.key >= 1990);
      } else {
        data = res[0].data.aggregations.my_indicator1.buckets;
      }
      const categories = [];
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      const indicTrue = [];
      const indicFalse = [];

      data.forEach((el) => {
        const nbTrue = el.my_indicator2.buckets.find((b) => b.key_as_string === 'true')
          ?.doc_count || 0;
        const nbFalse = el.my_indicator2.buckets.find((b) => b.key_as_string === 'false')
          ?.doc_count || 0;
        const nbTot = nbTrue + nbFalse || 0;
        if (nbTrue > 0) {
          indicTrue.push({
            y_abs: nbTrue,
            y_tot: nbTot,
            y: (nbTrue * 100) / nbTot,
            indicator: el.key,
            name: el.key,
          });
          indicFalse.push({
            y_abs: nbFalse,
            y_tot: nbTot,
            y: (nbFalse * 100) / nbTot,
            fr_reason: intl.formatMessage({ id: 'app.orcid.'.concat(el.key) }),
          });
        }
      });
      let dataToUse = indicTrue;
      if (indicator1 === 'first_these_discipline.discipline.keyword') {
        dataToUse = indicTrue.sort((a, b) => b.y - a.y);
      }

      const dataGraph = [
        {
          name: capitalize(
            intl.formatMessage({
              id: legendTrue,
            }),
          ),
          data: dataToUse,
          color: colorTrue,
          dataLabels: noOutline,
        },
      ];
      dataToUse.forEach((el) => {
        categories.push(el.name);
      });

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
