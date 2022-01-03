import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType, sponsorType = '*') {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  async function getDataAxios() {
    const querySponsorTypes = getFetchOptions({
      key: 'sponsorsTypesList',
      parameters: [studyType],
    });
    const responseSponsorTypes = await Axios.post(
      ES_STUDIES_API_URL,
      querySponsorTypes,
      HEADERS,
    );
    let sponsorTypes = responseSponsorTypes.data.aggregations.by_sponsor_type.buckets.map(
      (item) => item.key,
    );
    sponsorTypes = sponsorTypes.map((st) => ({
      value: st,
      label: intl.formatMessage({ id: `app.sponsor.${st}` }),
    }));

    const queryEvolution = getFetchOptions({
      key: 'studiesCaracteristiquesQuandEvolution',
      parameters: [studyType, sponsorType],
    });
    const resEvolution = await Axios.post(
      ES_STUDIES_API_URL,
      queryEvolution,
      HEADERS,
    );
    const currentYear = new Date().getFullYear() - 1;
    const dataSortedByYearEvolution = resEvolution.data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2010 && y.key <= currentYear);

    const colors = {
      before_start: getCSSValue('--orange-medium-75'),
      during_study: getCSSValue('--orange-medium-100'),
      after_start: getCSSValue('--apres'),
      after_completion: getCSSValue('--apres'),
    };
    const stepsEvolution = ['before_start', 'during_study', 'after_completion'];
    const dataGraphEvolution = stepsEvolution.map((step) => {
      const data = dataSortedByYearEvolution.map((el) => {
        const x = el.key;
        const yValue = el.by_submission_temporality.buckets.find(
          (ele) => ele.key === step,
        )?.doc_count;
        const y = (yValue / el.doc_count) * 100;
        const yLabel = Number(y).toFixed(0);
        const yTotal = el.doc_count;
        return { x, yValue, y, yLabel, yTotal };
      });
      const name = capitalize(
        intl.formatMessage({
          id: `app.${studyType.toLowerCase()}.${step}`,
        }),
      );
      const color = colors[step];
      return { name, data, color };
    });
    dataGraphEvolution.reverse();

    const queryRepartition = getFetchOptions({
      key: 'studiesCaracteristiquesQuandRepartition',
      parameters: ['delay_submission_start', studyType, sponsorType],
    });
    const resRepartition = await Axios.post(
      ES_STUDIES_API_URL,
      queryRepartition,
      HEADERS,
    );
    const dataSortedByYearRepartition = resRepartition.data.aggregations.delay_submission_start.buckets;
    const data = {
      before_start: [],
      after_start: [],
    };
    const minBoundary = -360;
    const maxBoundary = 360;
    const firstValue = dataSortedByYearRepartition
      .filter((el) => el.key <= minBoundary)
      .reduce((a, b) => a + b.doc_count, 0);
    const lastValue = dataSortedByYearRepartition
      .filter((el) => el.key >= maxBoundary)
      .reduce((a, b) => a + b.doc_count, 0);
    data.before_start.push(firstValue);
    data.after_start.push(0);
    dataSortedByYearRepartition
      .filter((ele) => ele.key > minBoundary && ele.key < maxBoundary)
      .forEach((el) => {
        if (el.key <= 0) {
          data.before_start.push(el.doc_count);
          data.after_start.push(0);
        } else {
          data.before_start.push(0);
          data.after_start.push(el.doc_count);
        }
      });
    data.before_start.push(0);
    data.after_start.push(lastValue);
    const stepsRepartition = ['before_start', 'after_start'];
    const dataGraphRepartition = stepsRepartition.map((step) => ({
      data: data[step],
      name: capitalize(
        intl.formatMessage({
          id: `app.${studyType.toLowerCase()}.${step}`,
        }),
      ),
      color: colors[step],
    }));

    const categoriesRepartition = dataSortedByYearRepartition
      .filter((ele) => ele.key >= minBoundary && ele.key <= maxBoundary)
      .map((el) => Math.abs(el.key) / 30);
    categoriesRepartition[0] += ` ${intl.formatMessage({
      id: 'app.studies.month_before',
    })}`;
    categoriesRepartition[
      categoriesRepartition.length - 1
    ] += ` ${intl.formatMessage({ id: 'app.studies.month_after' })}`;

    const queryDistribution = getFetchOptions({
      key: 'studiesCaracteristiquesQuandDistribution',
      parameters: ['delay_submission_start', studyType, sponsorType],
    });
    const resDistribution = await Axios.post(
      ES_STUDIES_API_URL,
      queryDistribution,
      HEADERS,
    );
    const dataSortedByYearDistribution = resDistribution.data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2010 && y.key <= currentYear);
    const categoriesDistribution = dataSortedByYearDistribution.map(
      (el) => el.key,
    );

    const dataGraphDistribution = [];
    const median = [];
    dataSortedByYearDistribution.forEach((year, index) => {
      const violinData = {
        before_start: [],
        after_start: [],
      };
      median.push([
        year.delay_submission_start_perc.values['50.0'] / 30,
        index,
      ]);
      let total = 0;
      Object.keys(year.delay_submission_start_perc.values).forEach((key) => {
        const value = year.delay_submission_start_perc.values[key] / 30;
        const percentageKey = parseInt(key, 10) / 100;
        if (value < 0) {
          violinData.before_start.push([
            value,
            index - (percentageKey - total),
            index + (percentageKey - total),
          ]);
        } else {
          violinData.after_start.push([
            value,
            index - (percentageKey - total),
            index + (percentageKey - total),
          ]);
        }
        total = percentageKey;
      });
      // Extrapolate the limit between negative and positive data, linear regression
      const [x1, y1, y1b] = violinData.before_start[violinData.before_start.length - 1];
      const [x3, y3, y3b] = violinData.after_start[0];
      let a = (y3 - y1) / (x3 - x1);
      let b = y1 - a * x1;
      const middleValue1 = b;
      a = (y3b - y1b) / (x3 - x1);
      b = y1b - a * x1;
      const middleValue2 = b;
      violinData.before_start.push([0, middleValue1, middleValue2]);
      violinData.after_start.unshift([0, middleValue1, middleValue2]);
      dataGraphDistribution.push({
        name: capitalize(
          intl.formatMessage({
            id: `app.${studyType.toLowerCase()}.before_start`,
          }),
        ),
        color: colors.before_start,
        data: violinData.before_start,
        showInLegend: index === 0,
        enableMouseTracking: false,
      });
      dataGraphDistribution.push({
        name: intl.formatMessage({
          id: `app.${studyType.toLowerCase()}.after_start`,
        }),
        color: colors.after_start,
        data: violinData.after_start,
        showInLegend: index === 0,
        enableMouseTracking: false,
      });
    });
    // Add vertical line on x 0
    dataGraphDistribution.push({
      type: 'line',
      data: [
        [0, -1],
        [0, 12],
      ],
      color: getCSSValue('--g-800'),
      lineWidth: 1,
      showInLegend: false,
    });
    // Add median line
    dataGraphDistribution.push({
      type: 'scatter',
      lineWidth: 2,
      data: median,
      name: intl.formatMessage({
        id: `app.health-${studyType.toLowerCase()}.caracteristiques.quand.chart-evolution-temporalites.median`,
      }),
      color: getCSSValue('--black'),
      marker: {
        enabled: true,
        symbol: 'circle',
        lineWidth: 2,
        lineColor: getCSSValue('--black'),
        fillColor: getCSSValue('--white'),
      },
    });

    return {
      sponsorTypes,
      categoriesEvolution: dataSortedByYearEvolution.map((el) => el.key),
      dataGraphEvolution,
      categoriesRepartition,
      dataGraphRepartition,
      categoriesDistribution,
      dataGraphDistribution,
    };
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataAxios();
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
  }, [studyType, sponsorType]);

  return { allData, isLoading, isError };
}
export default useGetData;
