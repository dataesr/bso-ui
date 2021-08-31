import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  goldapc,
  hybrid,
} from '../../../../../style/colours.module.scss';
import { getFetchOptions } from '../../../../../utils/helpers';

function useGetData(observationSnaps, needle = '*') {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();

  async function getDataByObservationSnaps(datesObservation) {
    // Pour chaque date d'observation, récupération des données associées
    const queries = [];
    const query = getFetchOptions('apcYear', 'health', datesObservation[0]);
    query.query.bool.filter.push({
      wildcard: { 'publisher.keyword': needle },
    });
    queries.push(Axios.post(ES_API_URL, query, HEADERS));

    const res = await Axios.all(queries).catch(() => {
      setError(true);
      setLoading(false);
    });
    let dataTotal = res[0].data.aggregations.by_year.buckets;
    // Tri pour avoir les années dans l'ordre d'affichage du graphe
    dataTotal = dataTotal.sort((a, b) => a.key - b.key);
    const categoriesYear = [];
    const goldData = [];
    const hybridData = [];
    dataTotal
      .filter(
        (el) => el.key > 2012
            && parseInt(el.key, 10)
              < parseInt(datesObservation[0].substring(0, 4), 10),
      ).forEach((el) => {
        categoriesYear.push(el.key);
        const hybridElem = el.by_oa_colors.buckets.find((b) => b.key === 'hybrid');
        const hybridAPC = hybridElem?.apc?.value || 0;
        const hybridCount = hybridElem?.doc_count || 0;
        const goldElem = el.by_oa_colors.buckets.find((b) => b.key === 'gold');
        const goldAPC = goldElem?.apc?.value || 0;
        const goldCount = goldElem?.doc_count || 0;
        goldData.push({
          publisher: (needle === '*') ? intl.formatMessage({ id: 'app.all-publishers' }) : needle,
          y: goldAPC,
          count: goldCount,
          publicationDate: el.key,
        });
        hybridData.push({
          publisher: (needle === '*') ? intl.formatMessage({ id: 'app.all-publishers' }) : needle,
          y: hybridAPC,
          count: hybridCount,
          publicationDate: el.key,
        });
      });
    const dataGraphTotal = [
      {
        name: intl.formatMessage({ id: 'app.publishers.apc-hybrid' }),
        data: hybridData,
        color: hybrid,
      },
      {
        name: intl.formatMessage({ id: 'app.publishers.apc-gold' }),
        data: goldData,
        color: goldapc,
      },
    ];
    return { dataGraphTotal, categoriesYear };
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataByObservationSnaps(observationSnaps);
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationSnaps, needle]);

  return { data, isLoading, isError };
}
export default useGetData;
