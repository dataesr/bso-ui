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
      after_completion: getCSSValue('--apres'),
      during_study: getCSSValue('--orange-medium-100'),
      before_start: getCSSValue('--orange-medium-75'),
    };
    const dataGraph1 = ['after_completion', 'during_study', 'before_start'].map(
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
          id: `app.health-interventional.studies.caracteristiques.quand.chart-evolution-temporalites.${temporality}`,
        });
        const color = colors[temporality];
        return { name, data, color };
      },
    );

    const query2 = getFetchOptions(
      'studiesCharacteristicWhenRepartition',
      '',
      studyType,
    );
    const res2 = await Axios.post(ES_STUDIES_API_URL, query2, HEADERS).catch(
      (e) => console.log(e),
    );
    const dataSortedByYear2 = res2.data.aggregations.delay_submission_start.buckets;
    const dataNegative = [];
    const dataPositive = [];
    dataSortedByYear2.forEach((el) => {
      if (el.key < 0) {
        dataNegative.push(el.doc_count);
        dataPositive.push(0);
      } else {
        dataNegative.push(0);
        dataPositive.push(el.doc_count);
      }
    });
    const dataGraph2 = [
      {
        data: dataPositive,
        name: intl.formatMessage({
          id: 'app.health-interventional.studies.caracteristiques.quand.chart-evolution-temporalites.after_completion',
        }),
        color: colors.after_completion,
      },
      {
        data: dataNegative,
        name: intl.formatMessage({
          id: 'app.health-interventional.studies.caracteristiques.quand.chart-evolution-temporalites.before_start',
        }),
        color: colors.before_start,
      },
    ];

    const categories2 = dataSortedByYear2.map((el) => Math.abs(el.key) / 30);
    categories2[0] += ` ${intl.formatMessage({
      id: 'app.health-interventional.studies.caracteristiques.quand.chart-repartition-avant-apres.month_after',
    })}`;
    categories2[categories2.length - 1] += ` ${intl.formatMessage({
      id: 'app.health-interventional.studies.caracteristiques.quand.chart-repartition-avant-apres.month_after',
    })}`;

    return {
      categories1: dataSortedByYear.map((el) => el.key),
      dataGraph1,
      categories2,
      dataGraph2,
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
