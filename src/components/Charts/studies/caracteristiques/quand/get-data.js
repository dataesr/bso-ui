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
    const steps = ['before_start', 'during_study', 'after_completion'];
    const dataGraph1 = steps.map((step) => {
      const data = dataSortedByYear.map((el) => {
        const x = el.key;
        const yValue = el.by_submission_temporality.buckets.find(
          (ele) => ele.key === step,
        ).doc_count;
        const y = (yValue / el.doc_count) * 100;
        const yLabel = Number(y).toFixed(0);
        const yTotal = el.doc_count;
        return { x, yValue, y, yLabel, yTotal };
      });
      const name = intl.formatMessage({
        id: `app.health-interventional.studies.caracteristiques.quand.chart-evolution-temporalites.${step}`,
      });
      const color = colors[step];
      return { name, data, color };
    });
    dataGraph1.reverse();

    const query2 = getFetchOptions(
      'studiesCharacteristicWhenRepartition',
      '',
      studyType,
    );
    const res2 = await Axios.post(ES_STUDIES_API_URL, query2, HEADERS).catch(
      (e) => console.log(e),
    );
    const dataSortedByYear2 = res2.data.aggregations.delay_submission_start.buckets;
    const data = {
      before_start: [],
      during_study: [],
      after_completion: [],
    };
    dataSortedByYear2.forEach((el) => {
      if (el.key < 0) {
        data.before_start.push(el.doc_count);
        data.during_study.push(0);
        data.after_completion.push(0);
      } else if (el.key === 0) {
        data.before_start.push(0);
        data.during_study.push(el.doc_count);
        data.after_completion.push(0);
      } else {
        data.before_start.push(0);
        data.during_study.push(0);
        data.after_completion.push(el.doc_count);
      }
    });
    const dataGraph2 = steps.map((step) => ({
      data: data[step],
      name: intl.formatMessage({
        id: `app.health-interventional.studies.caracteristiques.quand.chart-evolution-temporalites.${step}`,
      }),
      color: colors[step],
    }));

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
