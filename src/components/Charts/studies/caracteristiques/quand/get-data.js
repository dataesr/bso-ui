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

    const query3 = getFetchOptions(
      'studiesCharacteristicWhenDistribution',
      '',
      studyType,
    );
    const res3 = await Axios.post(ES_STUDIES_API_URL, query3, HEADERS).catch(
      (e) => console.log(e),
    );
    const dataSortedByYear3 = res3.data.aggregations.by_year.buckets.sort(
      (a, b) => a.key - b.key,
    );
    const categories3 = dataSortedByYear3.map((el) => el.key);

    const dataGraph3 = [];
    dataSortedByYear3.forEach((year, index) => {
      const violinData = {
        before_start: [],
        after_completion: [],
      };
      let total = 0;
      Object.keys(year.delay_submission_start_perc.values).forEach((key) => {
        const value = year.delay_submission_start_perc.values[key];
        const percentageKey = parseInt(key, 10) / 100;
        if (value < 0) {
          violinData.before_start.push([
            value,
            index - (percentageKey - total),
            index + (percentageKey - total),
          ]);
        } else {
          violinData.after_completion.push([
            value,
            index - (percentageKey - total),
            index + (percentageKey - total),
          ]);
        }
        total = percentageKey;
      });
      // Extrapolate the limit between negative and positive data
      const middleValue1 = (violinData.before_start[violinData.before_start.length - 1][1]
          + violinData.after_completion[0][1])
        / 2;
      const middleValue2 = (violinData.before_start[violinData.before_start.length - 1][2]
          + violinData.after_completion[0][2])
        / 2;
      violinData.before_start.push([0, middleValue1, middleValue2]);
      violinData.after_completion.unshift([0, middleValue1, middleValue2]);
      dataGraph3.push({
        name: intl.formatMessage({
          id: 'app.health-interventional.studies.caracteristiques.quand.chart-evolution-temporalites.before_start',
        }),
        color: colors.before_start,
        data: violinData.before_start,
        showInLegend: index === 0,
      });
      dataGraph3.push({
        name: intl.formatMessage({
          id: 'app.health-interventional.studies.caracteristiques.quand.chart-evolution-temporalites.after_completion',
        }),
        color: colors.after_completion,
        data: violinData.after_completion,
        showInLegend: index === 0,
      });
    });

    return {
      categories1: dataSortedByYear.map((el) => el.key),
      dataGraph1,
      categories2,
      dataGraph2,
      categories3,
      dataGraph3,
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
