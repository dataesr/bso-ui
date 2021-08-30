/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  archiveouverte100,
  editeurplateforme100,
} from '../../../../../style/colours.module.scss';
import { getFetchOptions, getPublicationYearFromObservationSnap } from '../../../../../utils/helpers';

function useGetData(observationSnap) {
  const [allData, setAllData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const intl = useIntl();

  async function getDataGraph() {
    const query = getFetchOptions(
      'publishersPolitiqueHisto',
      'health',
      observationSnap[0],
    );
    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));
    const data = res.data.aggregations.by_publisher.buckets;
    const categories = data.map((el) => el.key);
    const openByPublishers = [];
    const greenOnly = [];
    data.forEach((elem) => {
      openByPublishers.push({
        publicationDate: getPublicationYearFromObservationSnap(observationSnap[0]),
        publisher: elem.key,
        y_abs: elem.by_oa_colors.buckets.find((el) => ['gold', 'hybrid', 'diamond'].includes(el.key))
          .doc_count,
        y_tot: elem.doc_count,
        y:
          (100
            * elem.by_oa_colors.buckets.find((el) => ['gold', 'hybrid', 'diamond'].includes(el.key))
              .doc_count)
          / elem.doc_count,
      });
      greenOnly.push({
        publicationDate: getPublicationYearFromObservationSnap(observationSnap[0]),
        publisher: elem.key,
        y_abs: elem.by_oa_colors.buckets.find((el) => el.key === 'green_only')
          .doc_count,
        y_tot: elem.doc_count,
        y:
          (100
            * elem.by_oa_colors.buckets.find((el) => el.key === 'green_only')
              .doc_count)
          / elem.doc_count,
      });
    });
    const dataGraph = [
      {
        name: intl.formatMessage({ id: 'app.publishers.green-only' }),
        data: greenOnly,
        color: archiveouverte100,
      },
      {
        name: intl.formatMessage({ id: 'app.publishers.open-by-publisher' }),
        data: openByPublishers,
        color: editeurplateforme100,
      },
    ];
    return { categories, dataGraph };
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
