import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  getCSSProperty,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';

function useGetData(observationSnaps, isDetailed, needle = '*', domain) {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();

  async function getDataByObservationSnaps(datesObservation) {
    // Pour chaque date d'observation, récupération des données associées
    const queries = [];
    const query = getFetchOptions(
      'publishersLicence',
      domain,
      datesObservation[0],
      needle,
    );
    queries.push(Axios.post(ES_API_URL, query, HEADERS));

    const res = await Axios.all(queries).catch(() => {
      setError(true);
      setLoading(false);
    });
    const nbTotal = res[0].data.aggregations.by_is_oa.buckets[0].doc_count;
    const dataGraphTreemap = [];
    if (isDetailed) {
      res[0].data.aggregations.by_is_oa.buckets[0].by_licence.buckets.forEach(
        (el) => {
          dataGraphTreemap.push({
            name: intl.formatMessage({ id: `app.licenses.${el.key}` }),
            publisher:
              needle === '*'
                ? intl.formatMessage({ id: 'app.all-publishers' })
                : needle,
            value: el.doc_count,
            y_tot: nbTotal,
            y_perc: (100 * el.doc_count) / nbTotal,
            publicationDate: getPublicationYearFromObservationSnap(
              datesObservation[0],
            ),
            color:
              el.key === 'no license'
                ? getCSSProperty('--g-400')
                : getCSSProperty('--acces-ouvert'),
          });
        },
      );
    } else {
      const nbLicenceOpen = res[0].data.aggregations.by_is_oa.buckets[0].by_licence.buckets
        .filter((el) => el.key !== 'no license')
        .reduce((a, b) => a + b.doc_count, 0);
      dataGraphTreemap.push({
        name: intl.formatMessage({ id: 'app.licenses.open-license' }),
        publisher:
          needle === '*'
            ? intl.formatMessage({ id: 'app.all-publishers' })
            : needle,
        color: getCSSProperty('--acces-ouvert'),
        value: nbLicenceOpen,
        y_tot: nbTotal,
        y_perc: (100 * nbLicenceOpen) / nbTotal,
        publicationDate: getPublicationYearFromObservationSnap(
          datesObservation[0],
        ),
      });
      const noLicenceElem = res[0].data.aggregations.by_is_oa.buckets[0].by_licence.buckets.find(
        (el) => el.key === 'no license',
      );
      const nbNoLicence = noLicenceElem ? noLicenceElem.doc_count : 0;
      dataGraphTreemap.push({
        name: intl.formatMessage({ id: 'app.licenses.no license' }),
        publisher:
          needle === '*'
            ? intl.formatMessage({ id: 'app.all-publishers' })
            : needle,
        color: getCSSProperty('--g-400'),
        value: nbNoLicence,
        y_tot: nbTotal,
        y_perc: (100 * nbNoLicence) / nbTotal,
        publicationDate: getPublicationYearFromObservationSnap(
          datesObservation[0],
        ),
      });
    }

    const openLicence = [];
    const noLicence = [];
    const categories = [];
    res[0].data.aggregations.by_publisher.buckets.forEach((elem) => {
      categories.push(elem.key);
      const noLicenceElem = elem.by_licence.buckets.find(
        (el) => el.key === 'no license',
      );
      noLicence.push({
        publisher: elem.key,
        y_tot: elem.doc_count,
        y_abs: noLicenceElem ? noLicenceElem.doc_count : 0,
        y:
          (100 * (noLicenceElem ? noLicenceElem.doc_count : 0))
          / elem.doc_count,
        publicationDate: getPublicationYearFromObservationSnap(
          datesObservation[0],
        ),
      });
      openLicence.push({
        publisher: elem.key,
        y_tot: elem.doc_count,
        y_abs: elem.by_licence.buckets
          .filter((el) => el.key !== 'no license')
          .reduce((a, b) => a + b.doc_count, 0),
        y:
          (100
            * elem.by_licence.buckets
              .filter((el) => el.key !== 'no license')
              .reduce((a, b) => a + b.doc_count, 0))
          / elem.doc_count,
        publicationDate: getPublicationYearFromObservationSnap(
          datesObservation[0],
        ),
      });
    });
    const dataGraphBar = [
      {
        name: intl.formatMessage({ id: 'app.licenses.no license' }),
        data: noLicence,
        color: getCSSProperty('--g-400'),
      },
      {
        name: intl.formatMessage({ id: 'app.licenses.open-license' }),
        data: openLicence,
        color: getCSSProperty('--acces-ouvert'),
      },
    ];
    return { dataGraphTreemap, dataGraphBar, categories };
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
