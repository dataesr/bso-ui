import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  discipline100,
  discipline125,
  discipline150,
} from '../../../../../style/colours.module.scss';
import { getFetchOptions } from '../../../../../utils/chartOptions';

function useGetData(observationSnaps, domain = '') {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const getDataByObservationSnaps = useCallback(
    async (datesObservation) => {
      // Pour chaque date d'observation, récupération des données associées
      const queries = [];
      datesObservation?.forEach((oneDate) => {
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
        serie.data = filtered.map(
          (el) => (el.by_is_oa.buckets.find((b) => b.key === 1).doc_count * 100)
            / (el.by_is_oa.buckets[0].doc_count
              + el.by_is_oa.buckets[1].doc_count),
        );
        serie.ratios = filtered.map(
          (el) => `(${el.by_is_oa.buckets[0].doc_count}/${el.doc_count})`,
        );
        serie.publicationDate = filtered[filtered.length - 1].key;
        dataGraph2.push(serie);
      });
      const dataGraph1 = dataGraph2.map((el) => ({
        name: el.name, // observation date
        y: el.data[el.data.length - 1],
        ratio: el.ratios[el.data.length - 1],
        publicationDate: el.publicationDate,
      }));

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
