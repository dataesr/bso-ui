/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function getDataAxios() {
    const query = getFetchOptions(
      'studiesCaracteristiquesDureeChartNombre',
      '',
      studyType,
    );
    const res = await Axios.post(ES_STUDIES_API_URL, query, HEADERS).catch(
      (e) => console.log(e),
    );
    const dataSortedByYear = res.data.aggregations.delay_start_completion.buckets.sort(
      (a, b) => a.key - b.key,
    );

    const categories = dataSortedByYear.map((el) => el.key / 365);
    const data = dataSortedByYear.map((el) => el.doc_count);
    const dataGraph = [
      {
        name: intl.formatMessage({
          id: `app.health-${studyType.toLowerCase()}.studies.caracteristiques.duree.chart-nombre.legend`,
        }),
        color: getCSSValue('--duree'),
        data,
      },
    ];

    return {
      categories,
      dataGraph,
    };
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataAxios();
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyType]);

  return { allData, isLoading };
}
export default useGetData;
