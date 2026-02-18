import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const getDataByObservationSnaps = useCallback(
    async () => {
      // Pour chaque date d'observation, récupération des données associées
      const observationYears = ['2022Q4', '2023Q4', '2024Q4', '2025Q4'];
      const years = [2019, 2020, 2021, 2022];
      const colors = ['--orange-soft-75', '--orange-soft-100', '--orange-soft-125', '--orange-soft-150'];
      const dataGraph = [];
      observationYears
        ?.sort((a, b) => a.substring(0, 4) - b.substring(0, 4))
        .forEach((observationYear, index) => {
          dataGraph.push({
            color: getCSSValue(colors[index]),
            dashStyle: 'ShortDot',
            data: [],
            lowColor: getCSSValue(colors[index]),
            marker: { fillColor: getCSSValue(colors[index]), lineColor: 'white', radius: 7, symbol: 'circle' },
            name: observationYear.substring(0, 4),
            showInLegend: true,
          });
        });

      years.forEach(async (year) => {
        const queries = [];
        observationYears
          ?.sort((a, b) => a.substring(0, 4) - b.substring(0, 4))
          .forEach((observationYear) => {
            const query = getFetchOptions({
              key: 'studiesDynamiqueOuvertureSponsor',
              parameters: [studyType, '*', year, year, observationYear],
              objectType: ['clinicalTrials'],
            });
            queries.push(Axios.post(ES_STUDIES_API_URL, query, HEADERS));
          });

        const responses = await Axios.all(queries);
        responses.forEach((response, index) => {
          const total = response.data.aggregations.by_has_result.buckets.reduce((acc, cur) => acc + cur?.doc_count ?? 0, 0);
          const open = response.data.aggregations.by_has_result.buckets.find((bucket) => bucket.key === 1)?.doc_count ?? 0;
          dataGraph.find((item) => item.name === observationYears[index].substring(0, 4)).data.push(
            { low: (open / total) * 100, name: `Essais terminés en ${year}`, y_abs: total, y_tot: open },
          );
        });
      });
      return { dataGraph };
    },
    [studyType],
  );

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataByObservationSnaps();
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
  }, [studyType, getDataByObservationSnaps]);

  return { data, isError, isLoading };
}
export default useGetData;
