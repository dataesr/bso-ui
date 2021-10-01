import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType, sponsorType = '*') {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  async function getDataAxios() {
    const queryGroupes = getFetchOptions(
      'studiesCaracteristiquesCombienChartGroupesPatients',
      '',
      studyType,
      sponsorType,
    );
    const resGroupes = await Axios.post(
      ES_STUDIES_API_URL,
      queryGroupes,
      HEADERS,
    );
    const dataSortedByYearGroupes = resGroupes.data.aggregations.enrollment.buckets.sort(
      (a, b) => a.key - b.key,
    );

    const categoriesGroupes = dataSortedByYearGroupes.map((el) => intl.formatMessage({
      id: `app.health-${studyType.toLowerCase()}.studies.caracteristiques.combien.chart-groupes-patients.${
          el.key
        }`,
    }));

    const dataGraphGroupes = [
      {
        name: intl.formatMessage({
          id: `app.health-${studyType.toLowerCase()}.studies.caracteristiques.combien.chart-groupes-patients.legend`,
        }),
        color: getCSSValue('--patient-100'),
        data: dataSortedByYearGroupes.map((el) => el.doc_count),
      },
    ];

    const queryRepartition = getFetchOptions(
      'studiesCaracteristiquesCombienChartProportionModesRepartition',
      '',
      studyType,
      sponsorType,
    );

    const resRepartition = await Axios.post(
      ES_STUDIES_API_URL,
      queryRepartition,
      HEADERS,
    );
    const dataSortedByYearRepartition = resRepartition.data.aggregations.by_year.buckets.sort(
      (a, b) => a.key - b.key,
    );

    const categoriesRepartition = dataSortedByYearRepartition.map(
      (el) => el.key,
    );

    const randomized = [];
    const na = [];
    const nonRandomized = [];
    dataSortedByYearRepartition.forEach((year) => {
      const randomizedPoint = year.by_design_allocation.buckets.find(
        (el) => el.key === 'Randomized',
      )?.doc_count;
      randomized.push(randomizedPoint);
      const naPoint = year.by_design_allocation.buckets.find(
        (el) => el.key === 'N/A',
      )?.doc_count;
      na.push(naPoint);
      const nonRandomizedPoint = year.by_design_allocation.buckets.find(
        (el) => el.key === 'Non-Randomized',
      )?.doc_count;
      nonRandomized.push(nonRandomizedPoint);
    });

    const dataGraphRepartition = [
      {
        name: intl.formatMessage({
          id: `app.health-${studyType.toLowerCase()}.studies.caracteristiques.combien.chart-proportion-modes-repartition.na`,
        }),
        data: na,
        color: getCSSValue('--g-400'),
      },
      {
        name: intl.formatMessage({
          id: `app.health-${studyType.toLowerCase()}.studies.caracteristiques.combien.chart-proportion-modes-repartition.non-randomized`,
        }),
        data: nonRandomized,
        color: getCSSValue('--patient-125'),
      },
      {
        name: intl.formatMessage({
          id: `app.health-${studyType.toLowerCase()}.studies.caracteristiques.combien.chart-proportion-modes-repartition.randomized`,
        }),
        data: randomized,
        color: getCSSValue('--patient-100'),
      },
    ];

    return {
      categoriesGroupes,
      dataGraphGroupes,
      categoriesRepartition,
      dataGraphRepartition,
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
