import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(observationSnap, domain, isOa) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  async function getDataForLastObservationSnap(lastObservationSnap) {
    const query = getFetchOptions(
      'declarationRate',
      domain,
      lastObservationSnap,
    );
    const res = await Axios.post(ES_API_URL, query, HEADERS);
    const data = res.data.aggregations.by_is_oa.buckets;

    const dataGraph = [];

    data.forEach((el) => {
      if (el.key === 0) {
        // acces fermé
        dataGraph.push({
          id: 'closed',
          name: intl.formatMessage({ id: 'app.type-hebergement.closed' }),
        });
        el.by_oa_host_type.buckets[0].by_grant_agency.buckets.forEach(
          (agency) => {
            dataGraph.push({
              name: agency.key,
              key: agency.key,
              parent: 'closed',
              value: agency.doc_count,
              color: getCSSValue('--blue-soft-175'),
            });
          },
        );
      } else {
        // access ouvert
        dataGraph.push({
          id: 'opened',
          name: intl.formatMessage({ id: 'app.type-hebergement.open' }),
        });
        el.by_oa_host_type.buckets.forEach((hostType) => {
          dataGraph.push({
            name: intl.formatMessage({
              id: `app.type-hebergement.${hostType.key}`,
            }),
            id: hostType.key,
            parent: 'opened',
          });
          hostType.by_grant_agency.buckets.forEach((agency) => {
            let color = getCSSValue('--blue-soft-175');
            if (hostType.key === 'repository') {
              color = getCSSValue('--green-medium-125');
            }
            if (hostType.key === 'publisher') {
              color = getCSSValue('--yellow-medium-125');
            }
            if (hostType.key === 'publisher;repository') {
              color = getCSSValue('--green-light-100');
            }
            dataGraph.push({
              name: agency.key,
              key: agency.key,
              parent: hostType.key,
              value: agency.doc_count,
              color,
              dataLabels: {
                style: {
                  textOutline: 'none',
                },
              },
            });
          });
        });
      }
    });

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
