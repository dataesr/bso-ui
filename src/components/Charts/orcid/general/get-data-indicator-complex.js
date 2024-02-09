import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_ORCID_API_URL, HEADERS } from '../../../../config/config';
import getFetchOptions from '../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getObservationLabel,
} from '../../../../utils/helpers';

function useGetData(
  beforeLastObservationSnap,
  observationSnap,
  domain,
  filter1,
  indicator1,
  indicator2,
  indicator3,
  size1,
  size2,
  size3,
) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions({
        key: 'orcidComplexIndicator',
        domain,
        parameters: [
          filter1,
          indicator1,
          indicator2,
          indicator3,
          size1,
          size2,
          size3,
        ],
        objectType: ['orcid'],
      });
      const res = await Axios.post(ES_ORCID_API_URL, query, HEADERS);
      const data = res.data.aggregations.my_indicator1.buckets;
      const activeAndWork = [];
      const categories = [];
      const others = [];
      let nbActiveAndWorkCount = 0;
      let nbOthersCount = 0;
      let nbTotalCount = 0;
      data.forEach((el) => {
        // categories.push(
        //   intl.formatMessage({ id: 'app.orcid.'.concat(el.key) }),
        // );
        const nbTotal = el.doc_count;
        const nbActiveAndWork = el.my_indicator2.buckets
          .find((item) => item.key === 1)
          .my_indicator3.buckets.find((item) => item.key === 1).doc_count;
        const nbOthers = nbTotal - nbActiveAndWork;
        // activeAndWork.push({
        //   y_abs: nbActiveAndWork,
        //   y_tot: nbTotal,
        //   y: (nbActiveAndWork / nbTotal) * 100,
        // });
        nbActiveAndWorkCount += nbActiveAndWork;
        // others.push({
        //   y_abs: nbOthers,
        //   y_tot: nbTotal,
        //   y: (nbOthers / nbTotal) * 100,
        // });
        nbOthersCount += nbOthers;
        nbTotalCount += nbTotal;
      });
      categories.push(intl.formatMessage({ id: 'app.orcid.fr-all' }));
      activeAndWork.push({
        y_abs: nbActiveAndWorkCount,
        y_tot: nbTotalCount,
        y: (nbActiveAndWorkCount / nbTotalCount) * 100,
      });
      others.push({
        y_abs: nbOthersCount,
        y_tot: nbTotalCount,
        y: (nbOthersCount / nbTotalCount) * 100,
      });
      const dataGraph = [
        {
          color: getCSSValue('--orange-soft-100'),
          data: activeAndWork,
          dataLabels: { style: { textOutline: 'none' } },
          name: capitalize(
            intl.formatMessage({
              id: 'app.orcid.active',
              defaultMessage: 'actif',
            }),
          ),
        },
        {
          color: getCSSValue('--g-400'),
          data: others,
          dataLabels: { style: { textOutline: 'none' } },
          name: capitalize(
            intl.formatMessage({
              id: 'app.orcid.inactive',
              defaultMessage: 'inactif',
            }),
          ),
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
      filter1,
      indicator1,
      indicator2,
      indicator3,
      intl,
      size1,
      size2,
      size3,
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
