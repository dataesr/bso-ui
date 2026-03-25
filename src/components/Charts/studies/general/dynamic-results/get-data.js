import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType, sponsorType = '*') {
  const intl = useIntl();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const getDataByObservationSnaps = useCallback(
    async () => {
      // Create sponsors types list
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

      const observationYears = ['2022Q4', '2023Q4', '2024Q4', '2025Q4'];
      const years = [2019, 2020, 2021, 2022];
      const colors = {
        '*': ['--blue-soft-50', '--blue-soft-75', '--blue-soft-125', '--blue-soft-175'],
        industriel: ['--purple-medium-50', '--purple-medium-75', '--purple-medium-125', '--purple-medium-175'],
        academique: ['--patient-50', '--patient-75', '--patient-125', '--patient-175'],
      };
      const dataGraph = [];
      observationYears
        ?.sort((a, b) => a.substring(0, 4) - b.substring(0, 4))
        ?.forEach((observationYear, index) => {
          let fillColor = getCSSValue(colors[sponsorType][index]);
          let lineColor = 'white';
          let lowColor = getCSSValue(colors[sponsorType][index]);
          let radius = 7;
          let showInLegend = true;
          if (index === observationYears.length - 1) {
            fillColor = 'white';
            lineColor = getCSSValue(colors[sponsorType][index]);
            lowColor = getCSSValue(colors[sponsorType][index]);
            radius = 8;
            showInLegend = false;
          }
          dataGraph.push({
            color: lowColor,
            dashStyle: 'ShortDot',
            data: [],
            dataLabels: [{ enabled: true, formatter() { return this.point?.label ?? ''; }, padding: 12 }, { enabled: false }],
            lowColor,
            name: observationYear.substring(0, 4),
            marker: { fillColor, lineColor, radius, symbol: 'circle' },
            showInLegend,
            year: Number(observationYear.substring(0, 4)),
          });
        });
      dataGraph.push({
        marker: {
          fillColor: 'white',
          lineColor: getCSSValue(colors[sponsorType][colors[sponsorType].length - 1]),
          radius: 8,
          symbol: 'circle',
        },
        name: observationYears[observationYears.length - 1].substring(0, 4),
        type: 'scatter',
      });

      await Promise.all(years.map(async (year) => {
        // Pour chaque date d'observation, récupération des données associées
        const queries = [];
        observationYears
          ?.sort((a, b) => a.substring(0, 4) - b.substring(0, 4))
          ?.forEach((observationYear) => {
            const query = getFetchOptions({
              key: 'studiesDynamiqueOuvertureSponsor',
              parameters: [studyType, '*', sponsorType, year, year, observationYear],
              objectType: ['clinicalTrials'],
            });
            queries.push(Axios.post(ES_STUDIES_API_URL, query, HEADERS));
          });

        const responses = await Axios.all(queries);
        responses?.forEach((response, index) => {
          const total = response.data.aggregations.by_has_result.buckets.reduce((acc, cur) => acc + cur?.doc_count ?? 0, 0);
          const open = response.data.aggregations.by_has_result.buckets.find((bucket) => bucket.key === 1)?.doc_count ?? 0;
          dataGraph.find((item) => item.name === observationYears[index].substring(0, 4)).data.push(
            { low: (open / total) * 100, name: `Essais terminés en ${year}`, y_abs: open, y_tot: total, year },
          );
        });
      }));
      return { dataGraph, sponsorTypes };
    },
    [intl, sponsorType, studyType],
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
  }, [getDataByObservationSnaps, sponsorType, studyType]);

  return { data, isError, isLoading };
}
export default useGetData;
