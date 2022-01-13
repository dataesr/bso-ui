import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';

function useGetData(lastObservationSnap, domain = '') {
  const disciplineField = domain === 'health' ? 'bsso_classification.field' : 'bso_classification';
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
  const { search } = useLocation();

  async function GetData() {
    const query = getFetchOptions({
      key: 'disciplinesVoiesEvolutions',
      domain,
      search,
      parameters: [lastObservationSnap, disciplineField],
    });
    const res = await Axios.post(ES_API_URL, query, HEADERS);
    const dataBubbles = res.data.aggregations.by_discipline.buckets;
    const bubbles = [];
    dataBubbles
      .filter((elem) => elem.key !== 'unknown')
      .forEach((elem) => {
        bubbles.push({
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          discipline: capitalize(
            intl.formatMessage({
              id: `app.discipline.${elem.key
                .replace(/\n/g, '')
                .replace('  ', ' ')}`,
            }),
          ),
          bsoDomain,
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
              .doc_count
              / elem.doc_count),
          y_abs: elem.by_oa_colors.buckets.find((el) => el.key === 'green')
            .doc_count,
          z: elem.doc_count,
        });
      });

    const bubbleGraph = [
      {
        name: intl.formatMessage({ id: 'app.discipline' }),
        data: bubbles,
        showInLegend: false,
        marker: {
          fillColor: getCSSValue('--orange-soft-25'),
          lineWidth: 3,
          lineColor: getCSSValue('--orange-soft-100'),
        },
        color: getCSSValue('--orange-soft-100'),
      },
      {
        type: 'line',
        color: getCSSValue('--g-600'),
        dashStyle: 'ShortDot',
        enableMouseTracking: false,
        showInLegend: false,
        marker: { enabled: false },
        data: [{
          x: 0,
          y: 0,
        }, {
          x: 100,
          y: 100,
        },
        ],
      },
    ];

    return { bubbleGraph };
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await GetData();
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
  }, [lastObservationSnap]);

  return { data, isLoading, isError };
}
export default useGetData;
