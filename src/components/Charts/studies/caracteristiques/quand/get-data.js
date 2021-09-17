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

    const dataGraph = {
      categories: dataSortedByYear.map((el) => el.key),
      series: [
        {
          name: intl.formatMessage({
            id: 'app.health-observational.studies.caracteristiques.quand.chart-evolution-temporalites.after_completion',
          }),
          data: dataSortedByYear.map(
            (el) => el.by_submission_temporality.buckets.find(
              (ele) => ele.key === 'after_completion',
            ).doc_count,
          ),
          color: getCSSValue('--apres'),
          year: 12,
        },
        {
          name: intl.formatMessage({
            id: 'app.health-observational.studies.caracteristiques.quand.chart-evolution-temporalites.during_study',
          }),
          data: dataSortedByYear.map(
            (el) => el.by_submission_temporality.buckets.find(
              (ele) => ele.key === 'during_study',
            ).doc_count,
          ),
          color: getCSSValue('--orange-medium-100'),
        },
        {
          name: intl.formatMessage({
            id: 'app.health-observational.studies.caracteristiques.quand.chart-evolution-temporalites.before_start',
          }),
          data: dataSortedByYear.map(
            (el) => el.by_submission_temporality.buckets.find(
              (ele) => ele.key === 'before_start',
            ).doc_count,
          ),
          color: getCSSValue('--orange-medium-75'),
        },
      ],
    };

    return dataGraph;
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
