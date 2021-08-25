import Axios from 'axios';
import { useEffect, useState } from 'react';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  affiliationsetablissements50,
  affiliationsetablissements75,
  affiliationsetablissements100,
  affiliationsetablissements125,
} from '../../../../../style/colours.module.scss';
import { getFetchOptions } from '../../../../../utils/helpers';

function useGetData(observationDates) {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  async function getDataByObservationDates(datesObservation) {
    // Pour chaque date d'observation, récupération des données associées
    const queries = [];
    datesObservation?.forEach((oneDate) => {
      const query = getFetchOptions('publicationRate', 'health', oneDate);
      queries.push(Axios.post(ES_API_URL, query, HEADERS));
    });

    const res = await Axios.all(queries).catch(() => {
      setError(true);
      setLoading(false);
    });

    const allData = res.map((d, i) => ({
      observationDate: datesObservation[i],
      data: d.data.aggregations.by_publication_year.buckets,
    }));

    const colors = [
      affiliationsetablissements100,
      affiliationsetablissements125,
      affiliationsetablissements50,
      affiliationsetablissements75,
    ];
    const lineStyle = ['solid', 'ShortDot', 'ShortDashDot', 'Dash'];
    const dataGraph2 = [];
    allData.forEach((observationDateData, i) => {
      const serie = {};
      const filtered = observationDateData.data
        .sort((a, b) => a.key - b.key)
        .filter(
          (el) => el.key
              < parseInt(
                observationDateData.observationDate.substring(0, 4),
                10,
              )
            && el.by_is_oa.buckets.length > 0
            && el.doc_count
            && el.key > 2012,
        );
      serie.name = observationDateData.observationDate;
      serie.color = colors[i];
      serie.dashStyle = lineStyle[i];
      serie.data = filtered.map((el) => Math.trunc((el.by_is_oa.buckets[0].doc_count * 100) / el.doc_count));
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
      color: affiliationsetablissements100,
    }));

    return { dataGraph1, dataGraph2 };
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataByObservationDates(observationDates);
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
  }, [observationDates]);

  return { data, isLoading, isError };
}
export default useGetData;
