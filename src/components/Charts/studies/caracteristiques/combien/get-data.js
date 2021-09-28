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
    const queryGroupes = getFetchOptions(
      'studiesCaracteristiquesCombienChartGroupesPatients',
      '',
      studyType,
    );
    const resGroupes = await Axios.post(
      ES_STUDIES_API_URL,
      queryGroupes,
      HEADERS,
    ).catch((e) => console.log(e));
    const dataSortedByYearGroupes = resGroupes.data.aggregations.enrollment.buckets;

    const categoriesGroupes = dataSortedByYearGroupes.map((el) => intl.formatMessage({
      id: `app.health-${studyType.toLowerCase()}.studies.caracteristiques.combien.chart-groupes-patients.${
          el.key
        }`,
    }));

    const dataGraphGroupes = [
      {
        name: intl.formatMessage({
          id: `app.health-${studyType.toLowerCase()}.studies.caracteristiques.combien.chart-groupes-patients.legend`,
        }),
        color: getCSSValue('--patient-100'),
        data: dataSortedByYearGroupes.map((el) => el.doc_count),
      },
    ];

    return {
      categoriesGroupes,
      dataGraphGroupes,
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
