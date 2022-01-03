import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue, withContext } from '../../../../../utils/helpers';

function useGetData(studyType, sponsorType = '*', id, domain) {
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

    const queryGroupes = getFetchOptions({
      key: 'studiesCaracteristiquesCombienChartGroupesPatients',
      parameters: [studyType, sponsorType],
    });
    const currentYear = new Date().getFullYear() - 1;
    const resGroupes = await Axios.post(
      ES_STUDIES_API_URL,
      queryGroupes,
      HEADERS,
    );
    const dataSortedByYearGroupes = resGroupes.data.aggregations.enrollment.buckets.sort(
      (a, b) => a.key - b.key,
    );

    const categoriesGroupes = dataSortedByYearGroupes.map((el) => intl.formatMessage({
      id: `${id}.${el.key}`,
    }));

    const dataGraphGroupes = [
      {
        name: intl.formatMessage({
          id: `${withContext(id, domain, studyType)}.legend`,
        }),
        color: getCSSValue('--patient-100'),
        data: dataSortedByYearGroupes.map((el) => ({
          y: el.doc_count,
          name: intl.formatMessage({
            id: `${id}.${el.key}`,
          }),
        })),
      },
    ];

    const queryRepartition = getFetchOptions({
      key: 'studiesCaracteristiquesCombienChartProportionModesRepartition',
      parameters: [studyType, sponsorType],
    });
    const resRepartition = await Axios.post(
      ES_STUDIES_API_URL,
      queryRepartition,
      HEADERS,
    );
    const dataSortedByYearRepartition = resRepartition.data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2010 && y.key <= currentYear);
    const categoriesRepartition = dataSortedByYearRepartition.map(
      (el) => el.key,
    );

    const randomized = [];
    const na = [];
    const nonRandomized = [];
    dataSortedByYearRepartition.forEach((year) => {
      const randomizedPoint = {
        x: year.key,
        y: year.by_design_allocation.buckets.find(
          (el) => el.key === 'Randomized',
        )?.doc_count,
      };
      randomized.push(randomizedPoint);
      const naPoint = {
        x: year.key,
        y: year.by_design_allocation.buckets.find((el) => el.key === 'N/A')
          ?.doc_count,
      };
      na.push(naPoint);
      const nonRandomizedPoint = {
        x: year.key,
        y: year.by_design_allocation.buckets.find(
          (el) => el.key === 'Non-Randomized',
        )?.doc_count,
      };
      nonRandomized.push(nonRandomizedPoint);
    });

    const dataGraphRepartition = [
      {
        name: intl.formatMessage({
          id: `${withContext(id, domain, studyType)}.na`,
        }),
        data: na,
        color: getCSSValue('--g-400'),
      },
      {
        name: intl.formatMessage({
          id: `${withContext(id, domain, studyType)}.non-randomized`,
        }),
        data: nonRandomized,
        color: getCSSValue('--patient-125'),
      },
      {
        name: intl.formatMessage({
          id: `${withContext(id, domain, studyType)}.randomized`,
        }),
        data: randomized,
        color: getCSSValue('--patient-100'),
      },
    ];
    return {
      sponsorTypes,
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
