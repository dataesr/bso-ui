import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  discipline100,
  discipline125,
  discipline150,
} from '../../../../../style/colours.module.scss';
import getFetchOptions from '../../../../../utils/chartFetchOptions';

function useGetData(observationSnaps, domain = '') {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const getDataByObservationSnaps = useCallback(
    async (datesObservation) => {
      // Pour chaque date d'observation, récupération des données associées
      const queries = [];
      datesObservation
        ?.sort((a, b) => b.substr(0, 4) - a.substr(0, 4))
        .forEach((oneDate) => {
          const query = getFetchOptions('publicationRate', domain, oneDate);
          queries.push(Axios.post(ES_API_URL, query, HEADERS));
        });

      const res = await Axios.all(queries).catch(() => {
        setError(true);
        setLoading(false);
      });
      const allData = res.map((d, i) => ({
        observationSnap: datesObservation[i],
        data: d.data.aggregations.by_publication_year.buckets,
      }));

      const colors = [
        discipline100,
        discipline125,
        discipline125,
        discipline125,
        discipline150,
        discipline150,
        discipline150,
      ];
      const lineStyle = ['solid', 'ShortDot', 'ShortDashDot', 'Dash'];
      const dataGraph2 = [];
      allData.forEach((observationSnapData, i) => {
        const serie = {};
        const filtered = observationSnapData.data
          .sort((a, b) => a.key - b.key)
          .filter(
            (el) => el.key
                < parseInt(
                  observationSnapData.observationSnap.substring(0, 4),
                  10,
                )
              && el.by_is_oa.buckets.length > 0
              && el.doc_count
              && el.key > 2012,
          );
        serie.name = observationSnapData.observationSnap;
        serie.color = colors[i];
        serie.dashStyle = lineStyle[i];
        if (i === 0) {
          serie.marker = { fillColor: 'white', lineColor: colors[i], symbol: 'circle', lineWidth: 2, radius: 5 };
        }
        serie.data = filtered.map(
          (el) => ({
            y_tot: 7,
            y_abs: 1,
            publicationDate: el.key,
            y: (el.by_is_oa.buckets.find((b) => b.key === 1).doc_count * 100)
            / (el.by_is_oa.buckets[0].doc_count
              + el.by_is_oa.buckets[1].doc_count),
          }),
        );
        serie.ratios = filtered.map(
          (el) => `(${el.by_is_oa.buckets[0].doc_count}/${el.doc_count})`,
        );
        serie.lastPublicationDate = filtered[filtered.length - 1].key;
        dataGraph2.push(serie);
      });
      dataGraph2.comments = {
        observationDate: dataGraph2[0]?.name,
        previousObservationDate: dataGraph2[1]?.name,
        minPublicationDate: dataGraph2[0]?.data[0].publicationDate,
        previousMaxPublicationDate: dataGraph2[1]?.lastPublicationDate,
        oaYMinusOnePrevious: dataGraph2[1].data.slice(-1)[0].y.toFixed(2),
        oaYMinusOne: dataGraph2[0].data.slice(-2)[0].y.toFixed(2),
        oaEvolution: (dataGraph2[0].data.slice(-2)[0].y - dataGraph2[1].data.slice(-1)[0].y).toFixed(2),
        maxPublicationDate: dataGraph2[0]?.lastPublicationDate,
      };
      const dataGraph1 = dataGraph2.map((el) => ({
        name: el.name, // observation date
        y: el.data[el.data.length - 1].y,
        ratio: el.ratios[el.data.length - 1],
        publicationDate: el.lastPublicationDate,
      }));
      dataGraph1.comments = {};

      return { dataGraph1, dataGraph2 };
    },
    [domain],
  );

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataByObservationSnaps(observationSnaps);
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
  }, [observationSnaps, getDataByObservationSnaps]);

  return { data, isLoading, isError };
}
export default useGetData;
