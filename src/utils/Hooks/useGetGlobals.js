import Axios from 'axios';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../config/config';
import { clearLocalStorage } from '../helpers';
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

  const storedUpdateDate = localStorage.getItem('__updateDate__');
  const [updateDate, setUpdateDate] = useState(storedUpdateDate);

  async function getObservationDates() {
    // TODO move options to helpers
    // Récupération de toutes les dates d'observation
    const query = {
      size: 0,
      query: {
        bool: {
          filter: [{ term: { 'domains.keyword': 'health' } }],
        },
      },
      aggs: {
        observation_dates: {
          terms: { field: 'observation_dates.keyword', size: 100 },
        },
      },
    };
    const res = await Axios.post(ES_API_URL, query, HEADERS);
    return res?.data?.aggregations?.observation_dates?.buckets
      .map((el) => el.key)
      .sort()
      .reverse();
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
      if (responseObsDates) {
        setObservationDates(responseObsDates);
        localStorage.setItem(
          '__observationDates__',
          JSON.stringify(responseObsDates),
        );

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
    <GlobalsContext.Provider value={{ observationDates, updateDate }}>
      {children}
    </GlobalsContext.Provider>
  );
};

GlobalsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useGlobals = () => useContext(GlobalsContext);
export default useGlobals;
