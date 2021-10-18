import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, getCSSValue } from '../../../../../utils/helpers';

function useGetData(observationSnap, domain) {
  const [allData, setAllData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

  async function getDataGraph() {
    const query = getFetchOptions(
      'publishersTypesHisto',
      domain,
      observationSnap,
    );

    const res = await Axios.post(ES_API_URL, query, HEADERS);
    const data = res.data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key >= 2013
          && parseInt(el.key, 10) < parseInt(observationSnap.substring(0, 4), 10),
      );

    const categories = data.map((dataYear) => dataYear.key);
    const goldData = [];
    const hybridData = [];
    const diamondData = [];
    data.forEach((dataYear) => {
      goldData.push({
        publicationDate: dataYear.key,
        bsoDomain,
        y_abs: dataYear.by_oa_colors.buckets.find((el) => el.key === 'gold')
          .doc_count,
        y_tot: dataYear.doc_count,
        y:
          (100
            * dataYear.by_oa_colors.buckets.find((el) => el.key === 'gold')
              .doc_count)
          / dataYear.doc_count,
      });
      hybridData.push({
        bsoDomain,
        publicationDate: dataYear.key,
        y_abs: dataYear.by_oa_colors.buckets.find((el) => el.key === 'hybrid')
          .doc_count,
        y_tot: dataYear.doc_count,
        y:
          (100
            * dataYear.by_oa_colors.buckets.find((el) => el.key === 'hybrid')
              .doc_count)
          / dataYear.doc_count,
      });
      diamondData.push({
        bsoDomain,
        publicationDate: dataYear.key,
        y_abs: dataYear.by_oa_colors.buckets.find((el) => el.key === 'diamond')
          .doc_count,
        y_tot: dataYear.doc_count,
        y:
          (100
            * dataYear.by_oa_colors.buckets.find((el) => el.key === 'diamond')
              .doc_count)
          / dataYear.doc_count,
      });
    });
    const dataGraph = [
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

    return { categories, dataGraph, dataGraphTreemap };
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

  return { allData, isLoading, isError };
}
export default useGetData;
