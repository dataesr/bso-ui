import Axios from 'axios';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../config/config';

export const GlobalsContext = createContext();

export const GlobalsContextProvider = ({ children }) => {
  const storedObservationDates = localStorage.getItem(
    '__observationDates__',
  ) || ['2021'];
  const [observationDates, setObservationDates] = useState(
    storedObservationDates,
  );

  const storedUpdateDate = localStorage.getItem('__updateDate__') || null;
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
    const newObservationDates = res?.data?.aggregations?.observation_dates?.buckets
      .map((el) => el.key)
      .sort()
      .reverse();

    const toReturn = [];
    newObservationDates.forEach((date, i) => {
      if ((i > 0 && date.indexOf('Q') === -1) || i === 0) {
        toReturn.push(date);
      }
    });
    return toReturn;
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
      const obDates = await getObservationDates();
      setObservationDates(obDates);
      setUpdateDate(await getUpdateDate(obDates[0]));
    }
    getData();
  }, []);

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
