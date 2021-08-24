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
      '__observationDates__',
      '__updateDate__',
      'storedTimer',
    ]);
  }
  const storedObservationDates = localStorage.getItem('__observationDates__');
  const [observationDates, setObservationDates] = useState(
    JSON.parse(storedObservationDates),
  );
  const storedLastObservationDate = localStorage.getItem('__lastObservationYear__') || '';
  const [lastObservationYear, setlastObservationYear] = useState(
    storedLastObservationDate,
  );

  const storedUpdateDate = localStorage.getItem('__updateDate__');
  const [updateDate, setUpdateDate] = useState(storedUpdateDate);

  async function getObservationDates() {
    const query = getFetchOptions('observationDates');
    const res = await Axios.post(ES_API_URL, query, HEADERS);
    const newObservationDates = res?.data?.aggregations?.observation_dates?.buckets
      .map((el) => el.key)
      .sort()
      .reverse();
    return newObservationDates.filter(
      (el) => el <= 2020 || el === newObservationDates[0] || el.includes('Q4'),
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
      const responseObsDates = await getObservationDates();
      if (responseObsDates && responseObsDates.length > 0) {
        setObservationDates(responseObsDates);
        localStorage.setItem(
          '__observationDates__',
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
    if (!observationDates) {
      getData();
    }
  }, [lang, observationDates]);

  return (
    <GlobalsContext.Provider
      value={{ observationDates, updateDate, lastObservationYear }}
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
