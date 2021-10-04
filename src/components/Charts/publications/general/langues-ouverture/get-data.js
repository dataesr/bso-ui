import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(observationSnap, isOa, domain) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  async function getDataForLastObservationSnap(lastObservationSnap) {
    const publicationDate = Number(lastObservationSnap.slice(0, 4)) - 1;
    const field = isOa ? 'oa_host_type.keyword' : 'is_oa';
    const query = getFetchOptions(
      'openingType',
      domain,
      lastObservationSnap,
      field,
      'lang.keyword',
    );
    const res = await Axios.post(ES_API_URL, query, HEADERS);
    const data = res.data.aggregations.by_is_oa.buckets;
    const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

    let dataGraph = [];
    const totalPublications = data.reduce((a, b) => a + b.doc_count, 0);
    const noOutline = {
      style: {
        textOutline: 'none',
      },
    };
    if (!isOa) {
      dataGraph = [
        {
          id: 'closed',
          name: intl.formatMessage({ id: 'app.type-hebergement.closed' }),
          color: getCSSValue('--blue-soft-175'),
          dataLabels: noOutline,
          bsoDomain,
        },
        {
          id: 'open',
          name: intl.formatMessage({ id: 'app.type-hebergement.open' }),
          color: getCSSValue('--acces-ouvert'),
          dataLabels: noOutline,
          bsoDomain,
        },
      ];

      // Ajout des "fermés"
      data
        .find((el) => el.key === 0)
        .by_publication_split.buckets.forEach((el) => {
          dataGraph.push({
            name: intl.formatMessage({
              id: `app.lang.${el.key.toLowerCase()}`,
            }),
            oaType: intl.formatMessage({ id: 'app.type-hebergement.closed' }),
            key: el.key,
            parent: 'closed',
            value: el.doc_count,
            total: totalPublications,
            publicationDate,
            percentage: (100 * el.doc_count) / totalPublications,
            bsoDomain,
            dataLabels: noOutline,
          });
        });

      // Ajout des "ouverts"
      data
        .find((el) => el.key === 1)
        .by_publication_split.buckets.forEach((el) => {
          dataGraph.push({
            name: intl.formatMessage({
              id: `app.lang.${el.key.toLowerCase()}`,
            }),
            oaType: intl.formatMessage({ id: 'app.type-hebergement.open' }),
            key: el.key,
            parent: 'open',
            value: el.doc_count,
            total: totalPublications,
            publicationDate,
            bsoDomain,
            percentage: (100 * el.doc_count) / totalPublications,
            dataLabels: noOutline,
          });
        });
    } else {
      data.forEach((el) => {
        let color = getCSSValue('--blue-soft-175');
        if (el.key === 'repository') {
          color = getCSSValue('--green-medium-125');
        }
        if (el.key === 'publisher') {
          color = getCSSValue('--yellow-medium-125');
        }
        if (el.key === 'publisher;repository') {
          color = getCSSValue('--green-light-100');
        }
        dataGraph.push({
          id: el.key,
          name: intl.formatMessage({ id: `app.type-hebergement.${el.key}` }),
          oaType: intl.formatMessage({ id: 'app.type-hebergement.open' }),
          color,
          bsoDomain,
        });
        el.by_publication_split.buckets.forEach((item) => {
          dataGraph.push({
            name: intl.formatMessage({
              id: `app.lang.${item.key}`,
            }),
            oaType: intl.formatMessage({ id: 'app.type-hebergement.open' }),
            key: item.key,
            parent: el.key,
            value: item.doc_count,
            total: totalPublications,
            publicationDate,
            percentage: (100 * el.doc_count) / totalPublications,
            bsoDomain,
          });
        });
      });
    }
    return { dataGraph };
  }

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
  }, [observationSnap, isOa]);

  return { allData, isLoading, isError };
}
export default useGetData;
