import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  withContext,
} from '../../../../../utils/helpers';

function useGetData(studyType, sponsorType = '*', id, domain = 'health') {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  async function getDataAxios() {
    const querySponsorTypes = getFetchOptions({
      key: 'sponsorsTypesList',
      parameters: [studyType],
      objectType: ['clinicalTrials'],
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

    const colors = {
      before_completion: getCSSValue('--orange-medium-75'),
      after_completion: getCSSValue('--apres'),
    };

    const query2 = getFetchOptions({
      key: 'studiesCaracteristiquesQuandRepartition',
      parameters: ['delay_first_results_completion', studyType, sponsorType],
      objectType: ['clinicalTrials'],
    });
    query2.query.bool.filter.push({
      term: {
        'status.keyword': 'Completed',
      },
    });
    const res2 = await Axios.post(ES_STUDIES_API_URL, query2, HEADERS);
    const dataSortedByYear2 = res2.data.aggregations.delay_submission_start.buckets;
    const data = {
      before_completion: [],
      after_completion: [],
    };
    const minBoundary = -720;
    const maxBoundary = 1800;

    const categories2 = dataSortedByYear2
      .filter((ele) => ele.key >= minBoundary && ele.key <= maxBoundary)
      .map((el) => (Math.abs(el.key) / 30)
        .toString()
        .concat(` ${intl.formatMessage({ id: 'app.studies.months' })}`));
    categories2[0] += ` ${intl.formatMessage({
      id: 'app.studies.month_before',
    })}`;
    categories2[categories2.length - 1] += ` ${intl.formatMessage({
      id: 'app.studies.month_after',
    })}`;
    const firstValue = dataSortedByYear2
      .filter((el) => el.key <= minBoundary)
      .reduce((a, b) => a + b.doc_count, 0);
    const lastValue = dataSortedByYear2
      .filter((el) => el.key >= maxBoundary)
      .reduce((a, b) => a + b.doc_count, 0);
    data.before_completion.push({
      y: firstValue,
      name: categories2[0],
    });
    data.after_completion.push(0);
    dataSortedByYear2
      .filter((ele) => ele.key > minBoundary && ele.key < maxBoundary)
      .forEach((el, ix) => {
        if (el.key <= 0) {
          data.before_completion.push({
            y: el.doc_count,
            name: categories2[ix + 1],
          });
          data.after_completion.push(0);
        } else {
          data.before_completion.push(0);
          data.after_completion.push({
            y: el.doc_count,
            name: categories2[ix + 1],
          });
        }
      });
    data.before_completion.push(0);
    data.after_completion.push({
      y: lastValue,
      name: categories2[categories2.length - 1],
    });
    const steps2 = ['before_completion', 'after_completion'];
    const dataGraph2 = steps2.map((step) => ({
      data: data[step],
      name: capitalize(
        intl.formatMessage({
          id: `app.${studyType.toLowerCase()}.${step}`,
        }),
      ),
      color: colors[step],
    }));

    const query3 = getFetchOptions({
      key: 'studiesCaracteristiquesQuandDistribution',
      parameters: ['delay_first_results_completion', studyType, sponsorType],
      objectType: ['clinicalTrials'],
    });
    query3.query.bool.filter.push({
      term: {
        'status.keyword': 'Completed',
      },
    });
    const res3 = await Axios.post(ES_STUDIES_API_URL, query3, HEADERS);
    const currentYear = parseInt(
      process.env.REACT_APP_LAST_OBSERVATION.substr(0, 4),
      10,
    );
    const dataSortedByYear3 = res3.data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2010 && y.key <= currentYear);
    const categories3 = dataSortedByYear3.map((el) => el.key);

    const dataGraph3 = [];
    const median = [];
    dataSortedByYear3.forEach((year, index) => {
      const violinData = {
        before_completion: [],
        after_completion: [],
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
          violinData.before_completion.push([
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
      // Extrapolate the limit between negative and positive data, linear regression
      const [x1, y1, y1b] = violinData.before_completion[
        violinData.before_completion.length - 1
      ] || [null, null, null];
      const [x3, y3, y3b] = violinData.after_completion[0] || [
        null,
        null,
        null,
      ];
      let a = (y3 - y1) / (x3 - x1);
      let b = y1 - a * x1;
      const middleValue1 = b || y1;
      a = (y3b - y1b) / (x3 - x1);
      b = y1b - a * x1;
      const middleValue2 = b || y1b;
      violinData.before_completion.push([0, middleValue1, middleValue2]);
      violinData.after_completion.unshift([0, middleValue1, middleValue2]);

      dataGraph3.push({
        name: intl.formatMessage({
          id: `app.${studyType.toLowerCase()}.before_completion`,
        }),
        color: colors.before_completion,
        data: violinData.before_completion,
        showInLegend: index === 0,
        enableMouseTracking: false,
      });

      dataGraph3.push({
        name: intl.formatMessage({
          id: `app.${studyType.toLowerCase()}.after_completion`,
        }),
        color: colors.after_completion,
        data: violinData.after_completion,
        showInLegend: index === 0,
        enableMouseTracking: false,
      });
    });
    // Add vertical line on x 0
    dataGraph3.push({
      type: 'line',
      data: [
        [0, -1],
        [0, 10],
      ],
      color: getCSSValue('--g-800'),
      lineWidth: 1,
      showInLegend: false,
    });
    // Add median line
    dataGraph3.push({
      type: 'scatter',
      lineWidth: 2,
      data: median,
      name: intl.formatMessage({
        id: `${withContext(id, domain, studyType)}`,
      }),
      color: '#000',
      marker: {
        enabled: true,
        symbol: 'circle',
        lineWidth: 2,
        lineColor: '#000',
        fillColor: getCSSValue('--white'),
      },
    });

    return {
      sponsorTypes,
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
