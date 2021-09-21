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
      'studiesCharacteristicWhenEvolution',
      '',
      studyType,
    );

    const res = await Axios.post(ES_STUDIES_API_URL, query, HEADERS).catch(
      (e) => console.log(e),
    );
    const dataSortedByYear = res.data.aggregations.by_year.buckets.sort(
      (a, b) => a.key - b.key,
    );

    const colors = {
      after_completion: '--apres',
      during_study: '--orange-medium-100',
      before_start: '--orange-medium-75',
    };
    const series = ['after_completion', 'during_study', 'before_start'].map(
      (temporality) => {
        const data = dataSortedByYear.map((el) => {
          const x = el.key;
          const yValue = el.by_submission_temporality.buckets.find(
            (ele) => ele.key === temporality,
          ).doc_count;
          const y = (yValue / el.doc_count) * 100;
          const yLabel = Number(y).toFixed(0);
          const yTotal = el.doc_count;
          return { x, yValue, y, yLabel, yTotal };
        });
        const name = intl.formatMessage({
          id: `app.health-observational.studies.caracteristiques.quand.chart-evolution-temporalites.${temporality}`,
        });
        const color = getCSSValue(colors[temporality]);
        return { name, data, color };
      },
    );

    const data = {
      categories: dataSortedByYear.map((el) => el.key),
      series,
    };

    return data;
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
