import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  cleanNumber,
  getCSSValue,
  getObservationLabel,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';

function useGetData(beforeLastObservationSnap, lastObservationSnap, domain) {
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
    const query = getFetchOptions({
      key: 'publishersPolitiqueHisto',
      domain,
      parameters: [lastObservationSnap],
      objectType: ['publications'],
    });
    queries.push(Axios.post(ES_API_URL, query, HEADERS));
    const queryBulle = getFetchOptions({
      key: 'publishersPolitiqueBulle',
      domain,
      parameters: [lastObservationSnap],
      objectType: ['publications'],
    });
    queries.push(Axios.post(ES_API_URL, queryBulle, HEADERS));
    const res = await Axios.all(queries);

    // 1er graphe (bar)
    const data = res[0].data.aggregations.by_publisher.buckets;
    const openByPublishers = [];
    const greenOnly = [];
    const categories = [];
    data.forEach((item) => {
      const greenPublicationsCount = parseInt(
        item.by_oa_colors.buckets.find((el) => el.key === 'green_only')
          ?.doc_count || 0,
        10,
      );
      const oaPublicationsCount = parseInt(
        item.by_oa_colors.buckets
          .filter((el) => ['gold', 'hybrid', 'diamond', 'other'].includes(el.key))
          .reduce((a, b) => a + b.doc_count, 0),
        10,
      );
      openByPublishers.push({
        bsoDomain,
        publicationDate:
          getPublicationYearFromObservationSnap(lastObservationSnap),
        publisher: item.key,
        y_abs: oaPublicationsCount,
        y_tot: item.doc_count,
        y: (oaPublicationsCount / item.doc_count) * 100,
      });
      greenOnly.push({
        bsoDomain,
        publicationDate:
          getPublicationYearFromObservationSnap(lastObservationSnap),
        publisher: item.key,
        y_abs: greenPublicationsCount,
        y_tot: item.doc_count,
        y: (greenPublicationsCount / item.doc_count) * 100,
      });
      const totalCurrent = item.doc_count;
      const nameClean = item.key;
      categories.push(
        nameClean
          .concat('</br>(')
          .concat(intl.formatMessage({ id: 'app.effectif' }))
          .concat(' = ')
          .concat(cleanNumber(totalCurrent))
          .concat(')'),
      );
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
    dataBubbles.forEach((item) => {
      const greenPublicationsCount = parseInt(
        item.by_oa_colors.buckets.find((el) => el.key === 'green')?.doc_count
          || 0,
        10,
      );
      const oaPublicationsCount = parseInt(
        item.by_oa_colors.buckets
          .filter((el) => ['gold', 'hybrid', 'diamond', 'other'].includes(el.key))
          .reduce((a, b) => a + b.doc_count, 0),
        10,
      );
      bubbles.push({
        bsoDomain,
        publicationDate:
          getPublicationYearFromObservationSnap(lastObservationSnap),
        publisher: item.key,
        x: (oaPublicationsCount / item.doc_count) * 100,
        x_abs: oaPublicationsCount,
        y: (greenPublicationsCount / item.doc_count) * 100,
        y_abs: greenPublicationsCount,
        z: item.doc_count,
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
        type: 'line',
        color: getCSSValue('--g-600'),
        dashStyle: 'ShortDot',
        enableMouseTracking: false,
        showInLegend: false,
        marker: { enabled: false },
        data: [
          {
            x: 0,
            y: 0,
          },
          {
            x: 100,
            y: 100,
          },
        ],
      },
    ];

    const publisher = 'Wiley';
    const wiley = bubbleGraph
      .find((item) => item.name === 'éditeurs et plateformes')
      ?.data?.find((item) => item.publisher === publisher);
    let x = '';
    let y = '';
    if (wiley) {
      x = wiley.x.toFixed(0);
      y = wiley.y.toFixed(0);
    }

    const comments = {
      publicationYear: getObservationLabel(beforeLastObservationSnap, intl),
      publisher,
      x,
      y,
    };

    return {
      bubbleGraph,
      categories,
      comments,
      dataGraph,
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
  }, [lastObservationSnap]);

  return { allData, isError, isLoading };
}
export default useGetData;
