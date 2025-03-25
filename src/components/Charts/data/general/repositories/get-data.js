import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_DATACITE_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
// import { capitalize, getCSSValue } from '../../../../../utils/helpers';

function useGetData(observationSnap, domain, type, nbElementsToDisplay) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const getDataForLastObservationSnap = useCallback(
    async (lastObservationSnap) => {
      const query = getFetchOptions({
        key: 'datasetsByCategory',
        domain,
        parameters: [lastObservationSnap, 2013, type],
        objectType: ['datasets'],
      });
      const res = await Axios.post(ES_DATACITE_API_URL, query, HEADERS);
      const data = res.data.aggregations.by_year.buckets.sort(
        (a, b) => a.key - b.key,
      );
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const years = [];
      const types = {};
      const totalByYear = {};
      data.forEach((el) => {
        const year = el.key;
        years.push(el.key);
        const numberOfDatasets = el.by_type.buckets.reduce(
          (acc, curr) => acc + curr.doc_count,
          0,
        );
        totalByYear[year] = numberOfDatasets;
        el.by_type.buckets.forEach((k) => {
          let currentType = k.key;
          if (k.key === '') {
            currentType = 'N/A';
          }
          const numberInRepo = k.doc_count;
          if (types[currentType] === undefined) {
            types[currentType] = { data: {}, total: 0 };
          }
          types[currentType].data[year] = {
            y_rel: (numberInRepo / numberOfDatasets) * 100,
            y: numberInRepo,
            y_abs: numberInRepo,
            y_tot: numberOfDatasets,
            year: el.key,
            type: currentType.toUpperCase(),
            bsoDomain,
          };
          types[currentType].total += numberInRepo;
        });
      });
      const entries = Object.entries(types);
      entries.sort((a, b) => a[1].total - b[1].total);
      const dataGraph = [];
      const currentCountByYear = {};
      years.forEach((y) => {
        currentCountByYear[y] = 0;
      });
      const colors = [
        '#5DA5DA',
        '#FAA43A',
        '#60BD68',
        '#F17CB0',
        '#B2912F',
        '#B276B2',
        '#DECF3F',
        '#F15854',
        '#265DAB',
        '#DF5C24',
        '#059748',
        '#E5126F',
        '#9D722A',
        '#7B3A96',
        '#C7B42E',
        '#CB2027',
      ];
      entries.slice(-nbElementsToDisplay).forEach((e) => {
        const currentData = [];
        years.forEach((y) => {
          currentData.push(e[1].data[y] || null);
          currentCountByYear[y] += e[1].data[y]?.y_abs || 0;
        });
        let color = colors[dataGraph.length];
        if (e[0] === 'N/A') {
          color = '#dedede';
        }
        dataGraph.push({
          name: e[0].toUpperCase(),
          data: currentData,
          color,
        });
      });
      const otherData = [];
      let totalOther = 0;
      years.forEach((y) => {
        otherData.push({
          y: totalByYear[y] - currentCountByYear[y],
          y_abs: totalByYear[y] - currentCountByYear[y],
          y_tot: totalByYear[y],
          y_rel:
            ((totalByYear[y] - currentCountByYear[y]) / totalByYear[y]) * 100,
          year: y,
          type: 'Other',
        });
        totalOther += totalByYear[y] - currentCountByYear[y];
      });
      if (type !== 'format' && totalOther > 0) {
        dataGraph.unshift({
          // Add at the beginning of the array
          name: 'Other',
          data: otherData,
          color: 'grey',
        });
      }
      return {
        categories: years,
        dataGraph,
      };
    },
    [domain, intl, type, nbElementsToDisplay],
  );

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataForLastObservationSnap(observationSnap);
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
  }, [observationSnap]);

  return { allData, isError, isLoading };
}

export default useGetData;
