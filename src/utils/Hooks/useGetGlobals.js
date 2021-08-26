import Axios from 'axios';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../config/config';
import { clearLocalStorage, getFetchOptions } from '../helpers';
import useLang from './useLang';

export const GlobalsContext = createContext();

export const GlobalsContextProvider = ({ children }) => {
  const { lang } = useLang();
  const hours = 2;
  const storedTimer = localStorage.getItem('storedTimer');

  if (
    storedTimer
    && new Date().getTime() - storedTimer > hours * 60 * 60 * 1000
  ) {
    clearLocalStorage([
      '__observationSnaps__',
      '__updateDate__',
      'storedTimer',
    ]);
  }
  const storedObservationSnaps = localStorage.getItem('__observationSnaps__');
  const [observationSnaps, setObservationSnaps] = useState(
    JSON.parse(storedObservationSnaps),
  );
  const storedLastObservationSnap = localStorage.getItem('__lastObservationYear__') || '';
  const [lastObservationYear, setlastObservationYear] = useState(
    storedLastObservationSnap,
  );

  const storedUpdateDate = localStorage.getItem('__updateDate__');
  const [updateDate, setUpdateDate] = useState(storedUpdateDate);

  async function getObservationSnaps() {
    const query = getFetchOptions('observationSnaps', false);
    const res = await Axios.post(ES_API_URL, query, HEADERS);
    const newObservationSnaps = res?.data?.aggregations?.observation_dates?.buckets
      .map((el) => el.key)
      .sort()
      .reverse();
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
      const responseObsDates = await getObservationSnaps();
      if (responseObsDates && responseObsDates.length > 0) {
        setObservationSnaps(responseObsDates);
        localStorage.setItem(
          '__observationSnaps__',
          JSON.stringify(responseObsDates),
        );

        setlastObservationYear(responseObsDates[0]);
        localStorage.setItem('__lastObservationYear__', responseObsDates[0]);

        const responseUpdateDate = await getUpdateDate(responseObsDates[0]);
        setUpdateDate(responseUpdateDate);
        localStorage.setItem('__updateDate__', responseUpdateDate);

        localStorage.setItem('storedTimer', new Date().getTime());
      }
    }
    if (!observationSnaps) {
      getData();
    }
  }, [lang, observationSnaps]);

  return (
    <GlobalsContext.Provider
      value={{ observationSnaps, updateDate, lastObservationYear }}
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
