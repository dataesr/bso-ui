import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  archiveouverte100,
  editeurplateforme100,
} from '../../../../../style/colours.module.scss';
import { getFetchOptions } from '../../../../../utils/chartOptions';
import { getPublicationYearFromObservationSnap } from '../../../../../utils/helpers';
import target from '../../../../Images/asset-target.png';

function useGetData(lastObservationSnap, domain) {
  const [allData, setAllData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const intl = useIntl();

  async function getDataGraph() {
    const queries = [];
    const query = getFetchOptions(
      'publishersPolitiqueHisto',
      domain,
      lastObservationSnap,
    );
    queries.push(Axios.post(ES_API_URL, query, HEADERS));
    const queryBulle = getFetchOptions(
      'publishersPolitiqueBulle',
      domain,
      lastObservationSnap,
    );
    queries.push(Axios.post(ES_API_URL, queryBulle, HEADERS));
    const res = await Axios.all(queries).catch(() => {
      setLoading(false);
    });

    // 1er graphe (bar)
    const data = res[0].data.aggregations.by_publisher.buckets;
    const categories = data.map((el) => el.key);
    const openByPublishers = [];
    const greenOnly = [];
    data.forEach((elem) => {
      openByPublishers.push({
        publicationDate:
          getPublicationYearFromObservationSnap(lastObservationSnap),
        publisher: elem.key,
        y_abs: elem.by_oa_colors.buckets
          .filter((el) => ['gold', 'hybrid', 'diamond'].includes(el.key))
          .reduce((a, b) => a + b.doc_count, 0),
        y_tot: elem.doc_count,
        y:
          (100
            * elem.by_oa_colors.buckets
              .filter((el) => ['gold', 'hybrid', 'diamond'].includes(el.key))
              .reduce((a, b) => a + b.doc_count, 0))
          / elem.doc_count,
      });
      greenOnly.push({
        publicationDate:
          getPublicationYearFromObservationSnap(lastObservationSnap),
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
    // 2e graph (graphe à bulles)
    const dataBubbles = res[1].data.aggregations.by_publisher.buckets;
    const bubbles = [];
    dataBubbles.forEach((elem) => {
      bubbles.push({
        publicationDate:
          getPublicationYearFromObservationSnap(lastObservationSnap),
        publisher: elem.key,
        x:
          (100
            * elem.by_oa_colors.buckets
              .filter((el) => ['gold', 'hybrid', 'diamond'].includes(el.key))
              .reduce((a, b) => a + b.doc_count, 0))
          / elem.doc_count,
        x_abs: elem.by_oa_colors.buckets
          .filter((el) => ['gold', 'hybrid', 'diamond'].includes(el.key))
          .reduce((a, b) => a + b.doc_count, 0),
        y:
          100
          * (elem.by_oa_colors.buckets.find((el) => el.key === 'green')
            .doc_count
            / elem.doc_count),
        y_abs: elem.by_oa_colors.buckets.find((el) => el.key === 'green')
          .doc_count,
        z: elem.doc_count,
      });
    });
    const bubbleGraph = [
      {
        name: intl.formatMessage({ id: 'app.publishers' }),
        data: bubbles,
        color: editeurplateforme100,
      },
      {
        data: [{ y: 100, x: 100 }],
        type: 'scatter',
        enableMouseTracking: false,
        marker: {
          symbol: `url(${target})`,
        },
      },
    ];

    return { categories, dataGraph, bubbleGraph };
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
  }, [lastObservationSnap]);

  return { allData, isLoading };
}
export default useGetData;
