/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  diamond,
  goldapc,
  hybrid,
} from '../../../../../style/colours.module.scss';
import getFetchOptions from '../../../../../utils/chartFetchOptions';

function useGetData(observationSnap, domain) {
  const [allData, setAllData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const intl = useIntl();

  async function getDataGraph() {
    const query = getFetchOptions(
      'publishersTypesHisto',
      domain,
      observationSnap,
    );

    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));
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
        name: intl.formatMessage({ id: 'app.publishers.gold' }),
        data: goldData,
        color: goldapc,
      },
      {
        name: intl.formatMessage({ id: 'app.publishers.hybrid' }),
        data: hybridData,
        color: hybrid,
      },
      {
        name: intl.formatMessage({ id: 'app.publishers.diamond' }),
        data: diamondData,
        color: diamond,
      },
    ];

    const dataGraphTreemap = [
      {
        name: intl.formatMessage({ id: 'app.publishers.gold' }),
        publicationDate: goldData[goldData.length - 1].publicationDate,
        y_tot: goldData[goldData.length - 1].y_tot,
        y_abs: goldData[goldData.length - 1].y_abs,
        value: goldData[goldData.length - 1].y,
        color: goldapc,
      },
      {
        name: intl.formatMessage({ id: 'app.publishers.hybrid' }),
        publicationDate: hybridData[hybridData.length - 1].publicationDate,
        y_tot: hybridData[hybridData.length - 1].y_tot,
        y_abs: hybridData[hybridData.length - 1].y_abs,
        value: hybridData[hybridData.length - 1].y,
        color: hybrid,
      },
      {
        name: intl.formatMessage({ id: 'app.publishers.diamond' }),
        publicationDate: diamondData[diamondData.length - 1].publicationDate,
        y_tot: diamondData[diamondData.length - 1].y_tot,
        y_abs: diamondData[diamondData.length - 1].y_abs,
        value: diamondData[diamondData.length - 1].y,
        color: diamond,
      },
    ];

    return { categories, dataGraph, dataGraphTreemap };
  }

  useEffect(() => {
    async function getData() {
      try {
        const obj = await getDataGraph();
        setAllData(obj);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationSnap]);

  return { allData, isLoading };
}
export default useGetData;
