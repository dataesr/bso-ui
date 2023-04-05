import Axios from 'axios';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ES_API_URL, HEADERS } from '../../config/config';
import getFetchOptions from '../chartFetchOptions';
import { clearSessionStorage, getURLSearchParams } from '../helpers';

export const GlobalsContext = createContext();

export const GlobalsContextProvider = ({ children }) => {
  const hours = 0.1;
  const storedTimer = sessionStorage.getItem('storedTimer');
  const hasNoStoredTimer = storedTimer == null;

  if (
    (storedTimer
      && new Date().getTime() - storedTimer > hours * 60 * 60 * 1000)
    || hasNoStoredTimer
  ) {
    clearSessionStorage([
      '__beforeLastObservationSnap__',
      '__lastObservationSnap__',
      '__lastObservationSnapThesis__',
      '__observationSnaps__',
      '__updateDate__',
      'storedTimer',
    ]);
  }
  if (hasNoStoredTimer) {
    sessionStorage.setItem('storedTimer', JSON.stringify(new Date().getTime()));
  }

  const storedBeforeLastObservationSnap = sessionStorage.getItem('__beforeLastObservationSnap__') || '';
  const [beforeLastObservationSnap, setBeforeLastObservationSnap] = useState(
    storedBeforeLastObservationSnap,
  );

  const storedLastObservationSnap = sessionStorage.getItem('__lastObservationSnap__') || '';
  const [lastObservationSnap, setLastObservationSnap] = useState(
    storedLastObservationSnap,
  );

  const storedLastObservationSnapThesis = sessionStorage.getItem('__lastObservationSnapThesis__') || '';
  const [lastObservationSnapThesis, setLastObservationSnapThesis] = useState(
    storedLastObservationSnapThesis,
  );

  const storedObservationSnaps = sessionStorage.getItem('__observationSnaps__');
  const [observationSnaps, setObservationSnaps] = useState(
    JSON.parse(storedObservationSnaps),
  );

  const storedUpdateDate = sessionStorage.getItem('__updateDate__');
  const [updateDate, setUpdateDate] = useState(storedUpdateDate);

  const navigate = useNavigate();

  async function getObservationSnaps() {
    const query = getFetchOptions({ key: 'observationSnaps' });
    const res = await Axios.post(ES_API_URL, query, HEADERS);
    const { firstObservationYear, lastObservationYear } = getURLSearchParams();
    const newObservationSnaps = res?.data?.aggregations?.observation_dates?.buckets
      .map((el) => el.key)
      .sort((a, b) => b.substr(0, 4) - a.substr(0, 4))
      .filter(
        (el) => parseInt(el.substr(0, 4), 10)
            <= parseInt(lastObservationYear.substr(0, 4), 10),
      )
      .filter(
        (el) => parseInt(el.substr(0, 4), 10)
            >= parseInt(firstObservationYear.substr(0, 4), 10),
      );
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

        const lastObs = responseObservationSnaps.sort().reverse()[0];
        setLastObservationSnap(lastObs);
        sessionStorage.setItem('__lastObservationSnap__', lastObs);

        let beforeLast = '';
        if (responseObservationSnaps.length > 1) {
          // eslint-disable-next-line
          beforeLast = responseObservationSnaps.sort().reverse()[1];
          // eslint-disable-next-line
        } else {
          beforeLast = (parseInt(lastObs.substr(0, 4), 10) - 1).toString();
        }
        setBeforeLastObservationSnap(beforeLast);
        sessionStorage.setItem('__beforeLastObservationSnap__', beforeLast);

        const responseUpdateDate = await getUpdateDate(lastObs);
        setUpdateDate(responseUpdateDate);
        sessionStorage.setItem('__updateDate__', responseUpdateDate);

        const lastObservationYearThesis = process.env.REACT_APP_LAST_OBSERVATION_THESIS;
        setLastObservationSnapThesis(lastObservationYearThesis);
        sessionStorage.setItem(
          '__lastObservationSnapThesis__',
          lastObservationYearThesis,
        );

        sessionStorage.setItem('storedTimer', new Date().getTime());
      }
    }
    getData();
  }, [navigate]);

  return (
    <GlobalsContext.Provider
      value={{
        beforeLastObservationSnap,
        lastObservationSnap,
        lastObservationSnapThesis,
        observationSnaps,
        updateDate,
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
