/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  archiveouverte100,
  archiveouverte125,
} from '../../../../../style/colours.module.scss';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getPublicationYearFromObservationSnap } from '../../../../../utils/helpers';

function useGetData(observationSnap, domain) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  async function GetData() {
    const query = getFetchOptions('repositoriesHisto', domain, observationSnap);

    const res = await Axios.post(ES_API_URL, query, HEADERS).catch((e) => console.log(e));
    const tab = [];
    const nbHisto = 4;
    const lastPublicationYear = getPublicationYearFromObservationSnap(observationSnap);
    res.data.aggregations.by_repository.buckets.forEach((archive) => {
      if (archive.key !== 'N/A') {
        const obj = {
          name: archive.key,
          color: archiveouverte125,
          data: archive.by_year.buckets
            .filter(
              (el) => el.key > lastPublicationYear - nbHisto
                && el.key <= lastPublicationYear,
            )
            .sort((a, b) => a.key - b.key)
            .map((el, index) => ({
              name: el.key,
              year: el.key,
              y: el.doc_count,
              color:
                index === nbHisto - 1 ? archiveouverte100 : archiveouverte125,
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
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationSnap]);

  return { data, isLoading };
}
export default useGetData;