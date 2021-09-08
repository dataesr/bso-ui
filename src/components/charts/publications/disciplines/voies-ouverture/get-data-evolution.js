/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import { editeurplateforme100 } from '../../../../../style/colours.module.scss';
import { getFetchOptions } from '../../../../../utils/chartOptions';
import { getPublicationYearFromObservationSnap } from '../../../../../utils/helpers';
import target from '../../../../Images/asset-target.png';

function useGetData(lastObservationSnap, domain = '') {
  const disciplineField = domain === 'health' ? 'bsso_classification.field' : 'bso_classification';
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const intl = useIntl();

  async function GetData() {
    const query = getFetchOptions(
      'disciplinesVoiesEvolutions',
      domain,
      lastObservationSnap,
      disciplineField,
    );
    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));

    const dataBubbles = res.data.aggregations.by_discipline.buckets;

    const bubbles = [];
    dataBubbles.forEach((elem) => {
      bubbles.push({
        publicationDate:
          getPublicationYearFromObservationSnap(lastObservationSnap),
        discipline: intl.formatMessage({ id: `app.discipline.${elem.key}` }),
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
        name: intl.formatMessage({ id: 'app.discipline' }),
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

    return { bubbleGraph };
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await GetData();
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastObservationSnap]);

  return { data, isLoading };
}
export default useGetData;
