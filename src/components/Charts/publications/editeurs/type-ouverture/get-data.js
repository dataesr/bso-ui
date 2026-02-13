import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  cleanNumber,
  getCSSValue,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';

function useGetData(observationSnap, domain) {
  const [allData, setAllData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

  async function getDataGraph() {
    if (!observationSnap) {
      return {};
    }
    const queries = [];
    const queryPublishersTypes = getFetchOptions({
      key: 'publishersTypesHisto',
      domain,
      parameters: [observationSnap],
      objectType: ['publications'],
    });
    queries.push(Axios.post(ES_API_URL, queryPublishersTypes, HEADERS));
    const queryByClassifications = getFetchOptions({
      key: 'publishersByClassifications',
      domain,
      parameters: [observationSnap],
      objectType: ['publications'],
    });
    queries.push(Axios.post(ES_API_URL, queryByClassifications, HEADERS));
    const queryByClassificationsByPublishers = getFetchOptions({
      key: 'publishersByClassificationsByPublishers',
      domain,
      parameters: [observationSnap],
      objectType: ['publications'],
    });
    queries.push(
      Axios.post(ES_API_URL, queryByClassificationsByPublishers, HEADERS),
    );
    const res = await Axios.all(queries);

    const data = res[0].data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key >= 2013
          && parseInt(el.key, 10)
            < parseInt(String(observationSnap).substring(0, 4), 10),
      );

    const categories = data.map((dataYear) => dataYear.key);
    const goldData = [];
    const hybridData = [];
    const diamondData = [];
    const otherData = [];
    data.forEach((dataYear) => {
      const goldPublicationsCount = parseInt(
        dataYear.by_oa_colors.buckets.find((item) => item.key === 'gold')
          ?.doc_count || 0,
        10,
      );
      const hybridPublicationsCount = parseInt(
        dataYear.by_oa_colors.buckets.find((el) => el.key === 'hybrid')
          ?.doc_count || 0,
        10,
      );
      const diamondPublicationsCount = parseInt(
        dataYear.by_oa_colors.buckets.find((el) => el.key === 'diamond')
          ?.doc_count || 0,
        10,
      );
      const otherPublicationsCount = parseInt(
        dataYear.by_oa_colors.buckets.find((el) => el.key === 'other')
          ?.doc_count || 0,
        10,
      );
      goldData.push({
        publicationDate: dataYear.key,
        bsoDomain,
        y_abs: goldPublicationsCount,
        y_tot: dataYear?.doc_count || 0,
        y: (goldPublicationsCount / dataYear?.doc_count || 0) * 100,
      });
      hybridData.push({
        bsoDomain,
        publicationDate: dataYear.key,
        y_abs: hybridPublicationsCount,
        y_tot: dataYear?.doc_count || 0,
        y: (hybridPublicationsCount / dataYear?.doc_count || 0) * 100,
      });
      diamondData.push({
        bsoDomain,
        publicationDate: dataYear.key,
        y_abs: diamondPublicationsCount,
        y_tot: dataYear?.doc_count || 0,
        y: (diamondPublicationsCount / dataYear?.doc_count || 0) * 100,
      });
      otherData.push({
        bsoDomain,
        publicationDate: dataYear.key,
        y_abs: otherPublicationsCount,
        y_tot: dataYear?.doc_count || 0,
        y: (otherPublicationsCount / dataYear?.doc_count || 0) * 100,
      });
    });
    const dataGraph = [
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.other',
          }),
        ),
        data: otherData,
        color: getCSSValue('--orange-soft-100'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.hybrid',
          }),
        ),
        data: hybridData,
        color: getCSSValue('--hybrid'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.gold',
          }),
        ),
        data: goldData,
        color: getCSSValue('--yellow-medium-100'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.diamond',
          }),
        ),
        data: diamondData,
        color: getCSSValue('--diamond'),
      },
    ];

    const dataGraphTreemap = [
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.gold',
          }),
        ),
        publicationDate: goldData[goldData.length - 1].publicationDate,
        bsoDomain,
        y_tot: goldData[goldData.length - 1].y_tot,
        y_abs: goldData[goldData.length - 1].y_abs,
        value: goldData[goldData.length - 1].y,
        color: getCSSValue('--yellow-medium-100'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.other',
          }),
        ),
        bsoDomain,
        publicationDate: otherData[otherData.length - 1].publicationDate,
        y_tot: otherData[otherData.length - 1].y_tot,
        y_abs: otherData[otherData.length - 1].y_abs,
        value: otherData[otherData.length - 1].y,
        color: getCSSValue('--orange-soft-100'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.hybrid',
          }),
        ),
        bsoDomain,
        publicationDate: hybridData[hybridData.length - 1].publicationDate,
        y_tot: hybridData[hybridData.length - 1].y_tot,
        y_abs: hybridData[hybridData.length - 1].y_abs,
        value: hybridData[hybridData.length - 1].y,
        color: getCSSValue('--hybrid'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.diamond',
          }),
        ),
        bsoDomain,
        publicationDate: diamondData[diamondData.length - 1].publicationDate,
        y_tot: diamondData[diamondData.length - 1].y_tot,
        y_abs: diamondData[diamondData.length - 1].y_abs,
        value: diamondData[diamondData.length - 1].y,
        color: getCSSValue('--diamond'),
      },
    ];

    const publicationYear = getPublicationYearFromObservationSnap(observationSnap);
    const dataByClassifications = res[1].data.aggregations.by_classifications.buckets.filter(
      (bucket) => bucket.key !== 'unknown',
    );
    const goldAndHybridDataByClassifications = [];
    const diamondDataByClassifications = [];
    const otherDataByClassifications = [];
    const greenOnlyDataByClassifications = [];
    dataByClassifications.forEach((bucket) => {
      const goldAndHybridPublicationsCountByClassifications = parseInt(
        bucket.by_oa_colors.buckets.find((el) => el.key === 'gold' || el.key === 'hybrid')
          ?.doc_count || 0,
        10,
      );
      goldAndHybridDataByClassifications.push({
        classification: capitalize(
          intl.formatMessage({
            id: `app.discipline.${bucket.key}`,
            defaultMessage: bucket.key,
          }),
        ),
        publicationYear,
        y_abs: goldAndHybridPublicationsCountByClassifications,
        y_tot: bucket?.doc_count || 0,
        y:
          (goldAndHybridPublicationsCountByClassifications / bucket?.doc_count || 0)
          * 100,
      });
      const diamondPublicationsCountByClassifications = parseInt(
        bucket.by_oa_colors.buckets.find((el) => el.key === 'diamond')
          ?.doc_count || 0,
        10,
      );
      diamondDataByClassifications.push({
        classification: capitalize(
          intl.formatMessage({
            id: `app.discipline.${bucket.key}`,
            defaultMessage: bucket.key,
          }),
        ),
        publicationYear,
        y_abs: diamondPublicationsCountByClassifications,
        y_tot: bucket?.doc_count || 0,
        y:
          (diamondPublicationsCountByClassifications / bucket?.doc_count || 0)
          * 100,
      });
      const otherPublicationsCountByClassifications = parseInt(
        bucket.by_oa_colors.buckets.find((el) => el.key === 'other')
          ?.doc_count || 0,
        10,
      );
      otherDataByClassifications.push({
        classification: capitalize(
          intl.formatMessage({
            id: `app.discipline.${bucket.key}`,
            defaultMessage: bucket.key,
          }),
        ),
        publicationYear,
        y_abs: otherPublicationsCountByClassifications,
        y_tot: bucket?.doc_count || 0,
        y:
          (otherPublicationsCountByClassifications / bucket?.doc_count || 0)
          * 100,
      });
      const greenOnlyPublicationsCountByClassifications = parseInt(
        bucket.by_oa_colors.buckets.find((el) => el.key === 'green_only')
          ?.doc_count || 0,
        10,
      );
      greenOnlyDataByClassifications.push({
        classification: capitalize(
          intl.formatMessage({
            id: `app.discipline.${bucket.key}`,
            defaultMessage: bucket.key,
          }),
        ),
        publicationYear,
        y_abs: greenOnlyPublicationsCountByClassifications,
        y_tot: bucket?.doc_count || 0,
        y:
          (greenOnlyPublicationsCountByClassifications / bucket?.doc_count
            || 0) * 100,
      });
    });
    const dataGraphByClassifications = [
      {
        color: getCSSValue('--green-medium-125'),
        data: greenOnlyDataByClassifications,
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.green-only',
          }),
        ),
      },
      {
        color: getCSSValue('--orange-soft-100'),
        data: otherDataByClassifications,
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.other',
          }),
        ),
      },
      {
        color: getCSSValue('--yellow-medium-150'),
        data: goldAndHybridDataByClassifications,
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.gold-hybrid',
          }),
        ),
      },
      {
        color: getCSSValue('--diamond'),
        data: diamondDataByClassifications,
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.diamond',
          }),
        ),
      },
    ];

    const dataByClassificationsByPublishers = res[2].data.aggregations.by_classifications.buckets.filter(
      (bucket) => bucket.key !== 'unknown',
    );
    const goldAndHybridDataByClassificationsByPublishers = [];
    const diamondDataByClassificationsByPublishers = [];
    const otherDataByClassificationsByPublishers = [];
    dataByClassificationsByPublishers.forEach((bucket) => {
      const goldAndHybridPublicationsCountByClassificationsByPublishers = parseInt(
        bucket.by_oa_colors.buckets
          .filter((item) => item.key === 'gold' || item === 'hybrid')
          .reduce((acc, cur) => acc + (cur?.doc_count ?? 0), 0),
        10,
      );
      goldAndHybridDataByClassificationsByPublishers.push({
        classification: capitalize(
          intl.formatMessage({
            id: `app.discipline.${bucket.key}`,
            defaultMessage: bucket.key,
          }),
        ),
        publicationYear,
        y_abs: goldAndHybridPublicationsCountByClassificationsByPublishers,
        y_tot: bucket?.doc_count || 0,
        y:
          (goldAndHybridPublicationsCountByClassificationsByPublishers
            / bucket?.doc_count || 0) * 100,
      });
      const diamondPublicationsCountByClassificationsByPublishers = parseInt(
        bucket.by_oa_colors.buckets.find((el) => el.key === 'diamond')
          ?.doc_count || 0,
        10,
      );
      diamondDataByClassificationsByPublishers.push({
        classification: capitalize(
          intl.formatMessage({
            id: `app.discipline.${bucket.key}`,
            defaultMessage: bucket.key,
          }),
        ),
        publicationYear,
        y_abs: diamondPublicationsCountByClassificationsByPublishers,
        y_tot: bucket?.doc_count || 0,
        y:
          (diamondPublicationsCountByClassificationsByPublishers
            / bucket?.doc_count || 0) * 100,
      });
      const otherPublicationsCountByClassificationsByPublishers = parseInt(
        bucket.by_oa_colors.buckets.find((el) => el.key === 'other')
          ?.doc_count || 0,
        10,
      );
      otherDataByClassificationsByPublishers.push({
        classification: capitalize(
          intl.formatMessage({
            id: `app.discipline.${bucket.key}`,
            defaultMessage: bucket.key,
          }),
        ),
        publicationYear,
        y_abs: otherPublicationsCountByClassificationsByPublishers,
        y_tot: bucket?.doc_count || 0,
        y:
          (otherPublicationsCountByClassificationsByPublishers
            / bucket?.doc_count || 0) * 100,
      });
    });
    const dataGraphByClassificationsByPublishers = [
      {
        color: getCSSValue('--orange-soft-100'),
        data: otherDataByClassificationsByPublishers,
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.other',
          }),
        ),
      },
      {
        color: getCSSValue('--yellow-medium-150'),
        data: goldAndHybridDataByClassificationsByPublishers,
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.gold-hybrid',
          }),
        ),
      },
      {
        color: getCSSValue('--diamond'),
        data: diamondDataByClassificationsByPublishers,
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.diamond',
          }),
        ),
      },
    ];

    const year1 = diamondData[diamondData.length - 3].publicationDate;
    const diamond1 = diamondData[diamondData.length - 3]?.y.toFixed(0);
    const year2 = diamondData[diamondData.length - 2].publicationDate;
    const diamond2 = diamondData[diamondData.length - 2]?.y.toFixed(0);
    const year3 = diamondData[diamondData.length - 1].publicationDate;
    const diamond3 = diamondData[diamondData.length - 1]?.y.toFixed(0);
    const comments = {
      diamond1,
      diamond2,
      diamond3,
      year1,
      year2,
      year3,
    };

    return {
      categories,
      comments,
      dataGraph,
      dataGraphByClassifications,
      dataGraphByClassificationsByPublishers,
      dataGraphTreemap,
    };
  }

  useEffect(() => {
    async function getData() {
      try {
        const obj = await getDataGraph();
        setAllData(obj);
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
