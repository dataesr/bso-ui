import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import {
  editeurplateforme100,
  editeurplateforme125,
  editeurplateforme150,
} from '../../../../../style/colours.module.scss';
import getFetchOptions from '../../../../../utils/chartFetchOptions';

function useGetData(observationSnaps, needle = '*', domain) {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();

  async function getDataByObservationSnaps(datesObservation) {
    // Pour chaque date d'observation, récupération des données associées
    const queries = [];
    datesObservation?.forEach((oneDate) => {
      const allOaHostType = '*';
      const query = getFetchOptions(
        'publicationRate',
        domain,
        oneDate,
        needle,
        allOaHostType,
      );
      const queryFiltered = getFetchOptions(
        'publicationRate',
        domain,
        oneDate,
        needle,
        'publisher',
      );
      // on veut calculer le ratio (open access avec oaHostType=publisher) / (toutes les publications)
      // il faut donc lancer deux requêtes : queryFiltered pour le numérateur et query pour le denominateur
      queries.push(Axios.post(ES_API_URL, queryFiltered, HEADERS));
      // a second query with all publications to compute the oa rate
      queries.push(Axios.post(ES_API_URL, query, HEADERS));
    });

    const res = await Axios.all(queries).catch(() => {
      setError(true);
      setLoading(false);
    });
    const allData = [];
    for (let i = 0; i < res.length; i += 1) {
      const newData = {};
      if (i % 2 === 1) {
        newData.observationSnap = datesObservation[(i - 1) / 2];
        newData.data = {};
        newData.data.oaHostType = res[
          i - 1
        ].data.aggregations.by_publication_year.buckets
          .sort((a, b) => a.key - b.key)
          .filter(
            (el) => el.key < parseInt(newData.observationSnap.substring(0, 4), 10)
              && el.by_is_oa.buckets.length > 0
              && el.doc_count
              && el.key > 2012,
          )
          .map((el) => el.doc_count);
        newData.data.all = res[i].data.aggregations.by_publication_year.buckets
          .sort((a, b) => a.key - b.key)
          .filter(
            (el) => el.key < parseInt(newData.observationSnap.substring(0, 4), 10)
              && el.by_is_oa.buckets.length > 0
              && el.doc_count
              && el.key > 2012,
          )
          .map((el) => el.doc_count);
        newData.data.publicationDates = res[
          i
        ].data.aggregations.by_publication_year.buckets
          .sort((a, b) => a.key - b.key)
          .filter(
            (el) => el.key < parseInt(newData.observationSnap.substring(0, 4), 10)
              && el.by_is_oa.buckets.length > 0
              && el.doc_count
              && el.key > 2012,
          )
          .map((el) => el.key);
        allData.push(newData);
      }
    }

    const colors = [
      editeurplateforme100,
      editeurplateforme125,
      editeurplateforme125,
      editeurplateforme125,
      editeurplateforme150,
      editeurplateforme150,
      editeurplateforme150,
    ];
    const lineStyle = ['solid', 'ShortDot', 'ShortDashDot', 'Dash'];
    const dataGraph2 = [];
    allData.forEach((observationSnapData, i) => {
      const serie = {};
      serie.name = observationSnapData.observationSnap;
      serie.color = colors[i];
      serie.dashStyle = lineStyle[i];
      serie.data = observationSnapData.data.oaHostType.map((value, index) => ({
        y: (value * 100) / observationSnapData.data.all[index],
        publisher:
          needle === '*'
            ? intl.formatMessage({ id: 'app.all-publishers' })
            : needle,
        name: observationSnapData.observationSnap, // observation date
        publicationDate: observationSnapData.data.publicationDates[index],
      }));
      serie.ratios = observationSnapData.data.oaHostType.map(
        (value, index) => `(${value}/${observationSnapData.data.all[index]})`,
      );
      serie.publicationDate = observationSnapData.data.publicationDates[
        observationSnapData.data.publicationDates.length - 1
      ];
      dataGraph2.push(serie);
    });
    const dataGraph1 = dataGraph2.map((el) => ({
      name: el.name, // observation date
      y: el.data[el.data.length - 1].y,
      publisher:
        needle === '*'
          ? intl.formatMessage({ id: 'app.all-publishers' })
          : needle,
      ratio: el.ratios[el.data.length - 1],
      publicationDate: el.publicationDate,
    }));

    return { dataGraph1, dataGraph2 };
  }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationSnaps, needle]);

  return { data, isLoading, isError };
}
export default useGetData;