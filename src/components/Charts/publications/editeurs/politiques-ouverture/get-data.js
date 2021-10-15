import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';
import target from '../../../../Images/asset-target.png';

function useGetData(lastObservationSnap, domain) {
  const [allData, setAllData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
  const yellowMedium125 = getCSSValue('--yellow-medium-125');
  const yellowMedium100 = getCSSValue('--yellow-medium-100');
  const yellowMedium25 = getCSSValue('--yellow-medium-25');

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
    const res = await Axios.all(queries);

    // 1er graphe (bar)
    const data = res[0].data.aggregations.by_publisher.buckets;
    const categories = data.map((el) => el.key);
    const openByPublishers = [];
    const greenOnly = [];
    data.forEach((elem) => {
      openByPublishers.push({
        bsoDomain,
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
        bsoDomain,
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
        name: capitalize(
          intl.formatMessage({ id: 'app.publishers.open-by-publisher' }),
        ),
        data: openByPublishers,
        color: yellowMedium125,
      },
      {
        name: capitalize(
          intl.formatMessage({ id: 'app.publishers.green-only' }),
        ),
        data: greenOnly,
        color: getCSSValue('--green-medium-125'),
      },
    ];
    // 2e graph (graphe à bulles)
    const dataBubbles = res[1].data.aggregations.by_publisher.buckets;
    const bubbles = [];
    dataBubbles.forEach((elem) => {
      bubbles.push({
        bsoDomain,
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
        color: yellowMedium100,
        marker: {
          fillColor: yellowMedium25,
          lineWidth: 3,
          lineColor: yellowMedium100,
        },
        showInLegend: false,
      },
      {
        data: [{ y: 100, x: 100 }],
        type: 'scatter',
        enableMouseTracking: false,
        marker: {
          symbol: `url(${target})`,
        },
        showInLegend: false,
      },
    ];

    return { categories, dataGraph, bubbleGraph };
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
  }, [lastObservationSnap]);

  return { allData, isLoading, isError };
}
export default useGetData;
