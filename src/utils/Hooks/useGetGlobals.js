import Axios from 'axios';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ES_API_URL } from '../../config/config';
import { clearSessionStorage } from '../helpers';

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
    const res = await Axios.post(ES_API_URL, {
      size: 0,
      aggs: {
        unique_calc_dates: {
          terms: {
            field: 'calc_date',
            size: 10000,
          },
        },
      },
    });
    const observationBuckets = res?.data?.aggregations?.unique_calc_dates?.buckets;
    const newObservationSnaps = [...new Set(observationBuckets.map((item) => item.key_as_string.slice(0, 4)))]
      .sort((a, b) => b - a);
    return newObservationSnaps;
  }

  async function getUpdateDate() {
    // 最新のcalc_dateを取得
    const latestDateRes = await Axios.post(ES_API_URL, {
      size: 1,
      _source: ['calc_date'],
      sort: [
        {
          calc_date: {
            order: 'desc',
          },
        },
      ],
    });

    // calc_dateをdateに代入
    /* eslint-disable no-underscore-dangle */
    const date = latestDateRes.data.hits.hits[0]._source.calc_date;
    return date;
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
          beforeLast = (parseInt(lastObs.substring(0, 4), 10) - 1).toString();
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
