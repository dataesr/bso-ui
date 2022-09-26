import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  cleanNumber,
  getCSSValue,
} from '../../../../../utils/helpers';

function useGetData(observationSnap, domain) {
  const queries = [];
  const noOutline = {
    style: {
      textOutline: 'none',
    },
  };
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

  async function getDataForLastObservationSnap(lastObservationSnap) {
    const query = getFetchOptions({
      key: 'oaHostType',
      domain,
      parameters: [lastObservationSnap, 'grants.funding_year'],
      objectType: ['publications'],
    });
    queries.push(Axios.post(ES_API_URL, query, HEADERS));
    const res = await Axios.all(queries);

    // dataGrap - stacked bar chart about the opening rate according to the funding year
    const data = res[0].data.aggregations.by_publication_year.buckets.sort(
      (a, b) => a.key - b.key,
    );
    const categories = [];
    const publisher = [];
    const publisherRepository = [];
    const repository = [];
    data
      .filter((item) => item.key > 2015)
      .forEach((item) => {
        const closedCurrent = item.by_oa_host_type.buckets.find(
          (subItem) => subItem.key === 'closed',
        )?.doc_count || 0;
        const publisherCurrent = item.by_oa_host_type.buckets.find(
          (subItem) => subItem.key === 'publisher',
        )?.doc_count || 0;
        const publisherRepositoryCurrent = item.by_oa_host_type.buckets.find(
          (subItem) => subItem.key === 'publisher;repository',
        )?.doc_count || 0;
        const repositoryCurrent = item.by_oa_host_type.buckets.find(
          (subItem) => subItem.key === 'repository',
        )?.doc_count || 0;
        const oaCurrent = publisherCurrent + publisherRepositoryCurrent + repositoryCurrent;
        const totalCurrent = closedCurrent + oaCurrent;
        categories.push(
          `${item.key} <br />(${intl.formatMessage({
            id: 'app.effectif',
          })} = ${cleanNumber(totalCurrent)})`,
        );
        publisher.push({
          y: (100 * publisherCurrent) / totalCurrent,
          y_oa: oaCurrent,
          y_abs: publisherCurrent,
          y_tot: totalCurrent,
          x_val: item.key,
          bsoDomain,
        });
        publisherRepository.push({
          y: (100 * publisherRepositoryCurrent) / totalCurrent,
          y_oa: oaCurrent,
          y_abs: publisherRepositoryCurrent,
          y_tot: totalCurrent,
          x_val: item.key,
          bsoDomain,
        });
        repository.push({
          y: (100 * repositoryCurrent) / totalCurrent,
          y_abs: repositoryCurrent,
          y_oa: oaCurrent,
          y_tot: totalCurrent,
          x_val: item.key,
          bsoDomain,
        });
      });
    const dataGraph = [
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.type-hebergement.publisher',
          }),
        ),
        data: publisher,
        color: getCSSValue('--yellow-medium-125'),
        dataLabels: noOutline,
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.type-hebergement.publisher-repository',
          }),
        ),
        data: publisherRepository,
        color: getCSSValue('--green-light-100'),
        dataLabels: noOutline,
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.type-hebergement.repository',
          }),
        ),
        data: repository,
        color: getCSSValue('--green-medium-125'),
        dataLabels: noOutline,
      },
    ];

    return {
      categories,
      dataGraph,
    };
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
  }, [observationSnap]);
  return { allData, isError, isLoading };
}

export default useGetData;
