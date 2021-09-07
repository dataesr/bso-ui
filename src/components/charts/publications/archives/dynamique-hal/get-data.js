/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  accesouvert,
  archiveouverte125,
} from '../../../../../style/colours.module.scss';
import { getFetchOptions } from '../../../../../utils/chartOptions';

function useGetData(lastObservationSnap, domain) {
  const intl = useIntl();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  async function GetData() {
    const allRepositories = '*';
    const queries = [];
    const queryHAL = getFetchOptions(
      'couvertureHAL',
      domain,
      lastObservationSnap,
      'HAL',
    );
    const queryArchive = getFetchOptions(
      'couvertureHAL',
      domain,
      lastObservationSnap,
      allRepositories,
    );
    queries.push(Axios.post(ES_API_URL, queryHAL, HEADERS));
    queries.push(Axios.post(ES_API_URL, queryArchive, HEADERS));
    const res = await Axios.all(queries).catch(() => {
      setLoading(false);
    });
    let dataHAL = res[0].data.aggregations.by_publication_year.buckets;
    dataHAL = dataHAL
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key > 2012
          && parseInt(el.key, 10)
            < parseInt(lastObservationSnap.substring(0, 4), 10),
      );
    let dataArchive = res[1].data.aggregations.by_publication_year.buckets;
    dataArchive = dataArchive
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key > 2012
          && parseInt(el.key, 10)
            < parseInt(lastObservationSnap.substring(0, 4), 10),
      );
    const publicationYears = [];
    const hal = [];
    const notHal = [];
    dataHAL.forEach((el, index) => {
      publicationYears.push(el.key);
      hal.push({
        y: el.doc_count,
        y_percHAL: (100 * el.doc_count) / dataArchive[index].doc_count,
        y_tot: dataArchive[index].doc_count,
        x: el.key,
      });
      notHal.push({
        y: dataArchive[index].doc_count - el.doc_count,
        y_percHAL: (100 * el.doc_count) / dataArchive[index].doc_count,
        y_tot: dataArchive[index].doc_count,
        x: el.key,
      });
    });
    const dataGraph2 = [
      {
        name: intl.formatMessage({
          id: 'app.sante-publi.repositories.dynamique-hal.hal',
        }),
        data: hal,
        color: accesouvert,
      },
      {
        name: intl.formatMessage({
          id: 'app.sante-publi.repositories.dynamique-hal.notHal',
        }),
        data: notHal,
        color: archiveouverte125,
      },
    ];
    return { publicationYears, dataGraph2 };
  }

  useEffect(() => {
    async function getData() {
      try {
        const tempData = await GetData();
        setData(tempData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastObservationSnap]);

  return { data, isLoading };
}
export default useGetData;
