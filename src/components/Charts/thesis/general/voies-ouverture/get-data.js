import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getObservationLabel,
} from '../../../../../utils/helpers';

function useGetData(beforeLastObservationSnap, observationSnap, domain) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const yellowMedium125 = getCSSValue('--yellow-medium-125');
  const greenLight100 = getCSSValue('--green-light-100');

  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions({
        key: 'oaYear',
        domain,
        parameters: [lastObservationSnap, 'year', 1990, 20],
        objectType: ['thesis'],
      });
      const res = await Axios.post(ES_API_URL, query, HEADERS);
      const data = res.data.aggregations.by_publication_year.buckets.sort(
        (a, b) => a.key - b.key,
      );
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const categories = [];
      const repository = [];
      const publisher = [];
      const publisherRepository = [];
      const oa = [];
      const closed = [];
      const noOutline = {
        style: {
          textOutline: 'none',
        },
      };
      data
        .filter(
          (el) => true
            && lastObservationSnap.length
            && parseInt(el.key, 10)
              < parseInt(lastObservationSnap?.substring(0, 4), 10),
        )
        .forEach((el) => {
          categories.push(el.key);

          const closedCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 0)
            ?.doc_count || 0;
          const oaCurrent = el.by_oa_host_type.buckets.find((item) => item.key === 1)
            ?.doc_count || 0;
          const totalCurrent = closedCurrent + oaCurrent;
          closed.push({
            y: (100 * closedCurrent) / totalCurrent,
            y_abs: closedCurrent,
            y_tot: totalCurrent,
            y_oa: oaCurrent,
            x: el.key,
            bsoDomain,
          });
          oa.push({
            y: (100 * oaCurrent) / totalCurrent,
            y_abs: oaCurrent,
            y_oa: oaCurrent,
            y_tot: totalCurrent,
            x: el.key,
            bsoDomain,
          });
        });

      const dataGraph = [
        {
          name: capitalize(
            intl.formatMessage({
              id: 'app.type-hebergement.repository',
            }),
          ),
          data: oa,
          color: getCSSValue('--green-medium-125'),
          dataLabels: noOutline,
        },
      ];

      const dataGraph3 = [
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.open' }),
          id: 'oa',
          value: oa[oa.length - 1]?.y_abs,
          percentage: oa[oa.length - 1]?.y,
          publicationDate: categories[categories.length - 1],
          color: yellowMedium125,
          dataLabels: noOutline,
          bsoDomain,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.publisher' }),
          value: publisher[publisher.length - 1]?.y_abs,
          parent: 'oa',
          percentage: publisher[publisher.length - 1]?.y,
          publicationDate: categories[categories.length - 1],
          color: yellowMedium125,
          dataLabels: noOutline,
          bsoDomain,
        },
        {
          name: intl.formatMessage({
            id: 'app.type-hebergement.publisher-repository',
          }),
          value: publisherRepository[publisherRepository.length - 1]?.y_abs,
          parent: 'oa',
          percentage: publisherRepository[publisherRepository.length - 1]?.y,
          publicationDate: categories[categories.length - 1],
          color: greenLight100,
          dataLabels: noOutline,
          bsoDomain,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.repository' }),
          parent: 'oa',
          value: repository[repository.length - 1]?.y_abs,
          percentage: repository[repository.length - 1]?.y,
          publicationDate: categories[categories.length - 1],
          color: getCSSValue('--green-medium-125'),
          dataLabels: noOutline,
          bsoDomain,
        },
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.closed' }),
          id: 'closed',
          value: closed[closed.length - 1]?.y_abs,
          percentage: closed[closed.length - 1]?.y,
          publicationDate: categories[categories.length - 1],
          color: getCSSValue('--blue-soft-175'),
          dataLabels: noOutline,
          bsoDomain,
        },
      ];

      const comments = {
        beforeLastObservationSnap: getObservationLabel(
          beforeLastObservationSnap,
          intl,
        ),
        closed: closed[closed.length - 1]?.y.toFixed(0),
        lastObservationSnap: getObservationLabel(lastObservationSnap, intl),
        oa: oa[oa.length - 1]?.y.toFixed(0),
        publisher: publisher[publisher.length - 1]?.y.toFixed(0),
        publisherRepository:
          publisherRepository[publisherRepository.length - 1]?.y.toFixed(0),
        repository: repository[repository.length - 1]?.y.toFixed(0),
      };

      return {
        categories,
        comments,
        dataGraph,
        dataGraph3,
      };
    },
    [beforeLastObservationSnap, domain, greenLight100, intl, yellowMedium125],
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
