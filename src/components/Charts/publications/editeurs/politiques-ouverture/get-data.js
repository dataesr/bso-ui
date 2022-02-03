import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  cleanNumber,
  getCSSValue,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';

function useGetData(lastObservationSnap, domain) {
  const [allData, setAllData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
  const yellowMedium125 = getCSSValue('--yellow-medium-125');
  const yellowMedium100 = getCSSValue('--yellow-medium-100');
  const yellowMedium25 = getCSSValue('--yellow-medium-25');
  const { search } = useLocation();

  async function getDataGraph() {
    const queries = [];
    const query = getFetchOptions({
      key: 'publishersPolitiqueHisto',
      domain,
      search,
      parameters: [lastObservationSnap],
    });
    queries.push(Axios.post(ES_API_URL, query, HEADERS));
    const queryBulle = getFetchOptions({
      key: 'publishersPolitiqueBulle',
      domain,
      search,
      parameters: [lastObservationSnap],
    });
    queries.push(Axios.post(ES_API_URL, queryBulle, HEADERS));
    const res = await Axios.all(queries);

    // 1er graphe (bar)
    const data = res[0].data.aggregations.by_publisher.buckets;
    const openByPublishers = [];
    const greenOnly = [];
    const categories = [];
    data.forEach((elem) => {
      const openByPublishersPublicationsCount = elem.by_oa_colors.buckets
        .filter((el) => ['gold', 'hybrid', 'diamond', 'other'].includes(el.key))
        .reduce((a, b) => a + b.doc_count, 0);
      openByPublishers.push({
        bsoDomain,
        publicationDate:
          getPublicationYearFromObservationSnap(lastObservationSnap),
        publisher: elem.key,
        y_abs: openByPublishersPublicationsCount,
        y_tot: elem.doc_count,
        y: (openByPublishersPublicationsCount / elem.doc_count) * 100,
      });
      const greenOnlyPublicationsCount = elem.by_oa_colors.buckets.find((el) => el.key === 'green_only')
        ?.doc_count || 0;
      greenOnly.push({
        bsoDomain,
        publicationDate:
          getPublicationYearFromObservationSnap(lastObservationSnap),
        publisher: elem.key,
        y_abs: greenOnlyPublicationsCount,
        y_tot: elem.doc_count,
        y: (greenOnlyPublicationsCount / elem.doc_count) * 100,
      });
      const totalCurrent = elem.doc_count;
      const nameClean = elem.key;
      categories.push(
        nameClean
          .concat('</br>(')
          .concat(intl.formatMessage({ id: 'app.effectif' }))
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
    dataBubbles.forEach((elem) => {
      bubbles.push({
        bsoDomain,
        publicationDate:
          getPublicationYearFromObservationSnap(lastObservationSnap),
        publisher: elem.key,
        x:
          (100
            * elem.by_oa_colors.buckets
              .filter((el) => ['gold', 'hybrid', 'diamond', 'other'].includes(el.key))
              .reduce((a, b) => a + b.doc_count, 0))
          / elem.doc_count,
        x_abs: elem.by_oa_colors.buckets
          .filter((el) => ['gold', 'hybrid', 'diamond', 'other'].includes(el.key))
          .reduce((a, b) => a + b.doc_count, 0),
        y:
          100
          * (elem.by_oa_colors.buckets.find((el) => el.key === 'green')
            ?.doc_count || 0 / elem.doc_count),
        y_abs:
          elem.by_oa_colors.buckets.find((el) => el.key === 'green')
            ?.doc_count || 0,
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
      publisher,
      x,
      y,
    };

    return { bubbleGraph, categories, comments, dataGraph };
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
