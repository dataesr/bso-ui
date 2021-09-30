import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  getCSSValue,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';

function useGetData(observationSnap, domain) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const greenMedium150 = getCSSValue('--green-medium-150');
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

  async function GetData() {
    const query = getFetchOptions('repositoriesHisto', domain, observationSnap);

    const res = await Axios.post(ES_API_URL, query, HEADERS);
    const tab = [];
    const nbHisto = 4;
    const lastPublicationYear = getPublicationYearFromObservationSnap(observationSnap);
    res.data.aggregations.by_repository.buckets.forEach((archive) => {
      if (archive.key !== 'N/A') {
        const obj = {
          name: archive.key,
          color: greenMedium150,
          data: archive.by_year.buckets
            .filter(
              (el) => el.key > lastPublicationYear - nbHisto
                && el.key <= lastPublicationYear,
            )
            .sort((a, b) => a.key - b.key)
            .map((el, index) => ({
              name: el.key,
              bsoDomain,
              year: el.key,
              y: el.doc_count,
              color:
                index === nbHisto - 1
                  ? getCSSValue('--green-medium-125')
                  : greenMedium150,
            })),
        };
        tab.push(obj);
      }
    });

    return tab.slice(0, 12);
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await GetData();
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

  return { data, isLoading, isError };
}
export default useGetData;
