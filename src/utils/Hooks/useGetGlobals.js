import Axios from 'axios';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../config/config';
import getFetchOptions from '../chartFetchOptions';
import { clearSessionStorage } from '../helpers';
import useLang from './useLang';

export const GlobalsContext = createContext();

export const GlobalsContextProvider = ({ children }) => {
  const { lang } = useLang();
  const hours = 2;
  const storedTimer = sessionStorage.getItem('storedTimer');

  if (
    storedTimer
    && new Date().getTime() - storedTimer > hours * 60 * 60 * 1000
  ) {
    clearSessionStorage([
      '__observationSnaps__',
      '__updateDate__',
      'storedTimer',
    ]);
  }
  const storedObservationSnaps = sessionStorage.getItem('__observationSnaps__');
  const [observationSnaps, setObservationSnaps] = useState(
    JSON.parse(storedObservationSnaps),
  );
  const storedLastObservationSnap = sessionStorage.getItem('__lastObservationSnap__') || '';
  const [lastObservationSnap, setLastObservationSnap] = useState(
    storedLastObservationSnap,
  );
  const storedBeforeLastObservationSnap = sessionStorage.getItem('__beforeLastObservationSnap__') || '';
  const [beforeLastObservationSnap, setBeforeLastObservationSnap] = useState(
    storedBeforeLastObservationSnap,
  );

  const storedUpdateDate = sessionStorage.getItem('__updateDate__');
  const [updateDate, setUpdateDate] = useState(storedUpdateDate);

  async function getObservationSnaps() {
    const query = getFetchOptions({ key: 'observationSnaps' });
    const res = await Axios.post(ES_API_URL, query, HEADERS);
    const newObservationSnaps = res?.data?.aggregations?.observation_dates?.buckets
      .map((el) => el.key)
      .sort((a, b) => b.substr(0, 4) - a.substr(0, 4)); // ordre DECROISSANT !
    return newObservationSnaps.filter(
      (el) => el <= 2020 || el === newObservationSnaps[0] || el.includes('Q4'),
    );
  }

  async function getUpdateDate(lastDate) {
    // Récupération de la date de modification
    const query = {
      size: 0,
      aggs: {
        snapshot_date: {
          terms: { field: `oa_details.${lastDate}.snapshot_date.keyword` },
        },
      },
    };
    const res = await Axios.post(ES_API_URL, query, HEADERS);
    const date = res?.data?.aggregations?.snapshot_date?.buckets[0]?.key;
    return [date.slice(0, 4), '-', date.slice(4, 6), '-', date.slice(6)].join(
      '',
    );
  }

  useEffect(() => {
    async function getData() {
      const responseObservationSnaps = await getObservationSnaps();
      if (responseObservationSnaps && responseObservationSnaps.length > 0) {
        setObservationSnaps(responseObservationSnaps);
        sessionStorage.setItem(
          '__observationSnaps__',
          JSON.stringify(responseObservationSnaps),
        );
        setLastObservationSnap(responseObservationSnaps.sort().reverse()[0]);
        sessionStorage.setItem(
          '__lastObservationSnap__',
          responseObservationSnaps.sort().reverse()[0],
        );

        setBeforeLastObservationSnap(
          responseObservationSnaps.sort().reverse()[1],
        );
        sessionStorage.setItem(
          '__beforeLastObservationSnap__',
          responseObservationSnaps.sort().reverse()[1],
        );

        const responseUpdateDate = await getUpdateDate(
          responseObservationSnaps.sort().reverse()[0],
        );
        setUpdateDate(responseUpdateDate);
        sessionStorage.setItem('__updateDate__', responseUpdateDate);

        sessionStorage.setItem('storedTimer', new Date().getTime());
      }
    }
    if (!observationSnaps) {
      getData();
    }
  }, [lang, observationSnaps]);

  return (
    <GlobalsContext.Provider
      value={{
        observationSnaps,
        updateDate,
        lastObservationSnap,
        beforeLastObservationSnap,
      }}
    >
      {children}
    </GlobalsContext.Provider>
  );
};

GlobalsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useGlobals = () => useContext(GlobalsContext);
export default useGlobals;
