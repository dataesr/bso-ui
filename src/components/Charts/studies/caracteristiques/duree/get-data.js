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

    const query = getFetchOptions({
      key: 'studiesCaracteristiquesDureeChartNombre',
      parameters: [studyType, sponsorType],
    });
    const res = await Axios.post(ES_STUDIES_API_URL, query, HEADERS);
    const dataSortedByYear = res.data.aggregations.delay_start_completion.buckets.sort(
      (a, b) => a.key - b.key,
    );

    const categories = dataSortedByYear.map((el) => el.key / 365).slice(0, 11);
    const data = dataSortedByYear.map((el) => el.doc_count).slice(0, 11);
    const dataGraph = [
      {
        name: intl.formatMessage({
          id: `app.health-${studyType.toLowerCase()}.caracteristiques.duree.chart-nombre.legend`,
        }),
        color: getCSSValue('--duree'),
        data,
      },
    ];

    return {
      sponsorTypes,
      categories,
      dataGraph,
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
