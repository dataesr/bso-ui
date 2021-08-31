import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  accesouvert,
  nonconnu,
} from '../../../../../style/colours.module.scss';
import { getFetchOptions, getPublicationYearFromObservationSnap } from '../../../../../utils/helpers';

function useGetData(observationSnaps, isDetailed, needle = '*') {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();

  async function getDataByObservationSnaps(datesObservation) {
    // Pour chaque date d'observation, récupération des données associées
    const queries = [];
    const query = getFetchOptions('publishersLicence', 'health', datesObservation[0]);
    const term = {};
    term[`oa_details.${datesObservation[0]}.oa_host_type`] = 'publisher';
    query.query.bool.filter.push({ term });
    query.query.bool.filter.push({
      wildcard: { 'publisher.keyword': needle },
    });
    queries.push(Axios.post(ES_API_URL, query, HEADERS));

    const res = await Axios.all(queries).catch(() => {
      setError(true);
      setLoading(false);
    });
    const nbTotal = res[0].data.aggregations.by_is_oa.buckets[0].doc_count;
    const dataGraphTreemap = [];
    if (isDetailed) {
      res[0].data.aggregations.by_is_oa.buckets[0].by_licence.buckets.forEach((el) => {
        dataGraphTreemap.push({
          name: intl.formatMessage({ id: `app.licenses.${el.key}` }),
          publisher: (needle === '*') ? intl.formatMessage({ id: 'app.all-publishers' }) : needle,
          value: el.doc_count,
          y_tot: nbTotal,
          y_perc: (100 * el.doc_count) / nbTotal,
          publicationDate: getPublicationYearFromObservationSnap(datesObservation[0]),
          color: (el.key === 'no license') ? nonconnu : accesouvert,
        });
      });
    } else {
      const nbLicenceOpen = res[0].data.aggregations.by_is_oa.buckets[0].by_licence.buckets
        .filter((el) => el.key !== 'no license')
        .reduce((a, b) => a + b.doc_count, 0);
      dataGraphTreemap.push({
        name: intl.formatMessage({ id: 'app.licenses.open-license' }),
        publisher: (needle === '*') ? intl.formatMessage({ id: 'app.all-publishers' }) : needle,
        color: accesouvert,
        value: nbLicenceOpen,
        y_tot: nbTotal,
        y_perc: (100 * nbLicenceOpen) / nbTotal,
        publicationDate: getPublicationYearFromObservationSnap(datesObservation[0]),
      });
      const nbNoLicence = res[0].data.aggregations.by_is_oa.buckets[0].by_licence.buckets
        .find((el) => el.key === 'no license').doc_count;
      dataGraphTreemap.push({
        name: intl.formatMessage({ id: 'app.licenses.no license' }),
        publisher: (needle === '*') ? intl.formatMessage({ id: 'app.all-publishers' }) : needle,
        color: nonconnu,
        value: nbNoLicence,
        y_tot: nbTotal,
        y_perc: (100 * nbNoLicence) / nbTotal,
        publicationDate: getPublicationYearFromObservationSnap(datesObservation[0]),
      });
    }
    return { dataGraphTreemap };
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
  }, [observationSnaps, isDetailed, needle]);

  return { data, isLoading, isError };
}
export default useGetData;
