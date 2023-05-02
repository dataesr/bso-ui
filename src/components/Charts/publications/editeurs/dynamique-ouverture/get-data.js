import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue, getObservationLabel } from '../../../../../utils/helpers';

function useGetData(observationSnaps, needle = '*', domain) {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

  async function getDataByObservationSnaps(observationYears) {
    const queries = [];
    observationYears
      ?.sort((a, b) => b.substr(0, 4) - a.substr(0, 4))
      .forEach((oneDate) => {
        const allOaHostType = '*';
        const query = getFetchOptions({
          key: 'publicationRate',
          domain,
          parameters: [oneDate, needle, allOaHostType],
          objectType: ['publications'],
        });
        const queryFiltered = getFetchOptions({
          key: 'publicationRate',
          domain,
          parameters: [oneDate, needle, 'publisher'],
          objectType: ['publications'],
        });
        // on veut calculer le ratio (open access avec oaHostType=publisher) / (toutes les publications)
        // il faut donc lancer deux requêtes : queryFiltered pour le numérateur et query pour le denominateur
        queries.push(Axios.post(ES_API_URL, queryFiltered, HEADERS));
        // a second query with all publications to compute the oa rate
        queries.push(Axios.post(ES_API_URL, query, HEADERS));
      });

    const res = await Axios.all(queries);
    const allData = [];
    for (let i = 0; i < res.length; i += 1) {
      const newData = {};
      if (i % 2 === 1) {
        newData.observationSnap = observationYears[(i - 1) / 2];
        newData.data = {};
        newData.data.oaHostType = [];
        const oaHostType = res[
          i - 1
        ].data.aggregations.by_publication_year.buckets
          .sort((a, b) => a.key - b.key)
          .filter(
            (el) => el.key < parseInt(newData.observationSnap.substring(0, 4), 10)
              && el.by_is_oa.buckets.length > 0
              && el.doc_count
              && el.key > 2012,
          );
        const allHostType = res[i].data.aggregations.by_publication_year.buckets
          .sort((a, b) => a.key - b.key)
          .filter(
            (el) => el.key < parseInt(newData.observationSnap.substring(0, 4), 10)
              && el.by_is_oa.buckets.length > 0
              && el.doc_count
              && el.key > 2012,
          );
        for (let j = 0; j < allHostType.length; j += 1) {
          newData.data.oaHostType.push(
            oaHostType.find((x) => x.key === allHostType[j].key)?.doc_count
              || 0,
          );
        }
        newData.data.all = allHostType.map((el) => el.doc_count);
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
      getCSSValue('--yellow-medium-125'),
      getCSSValue('--yellow-medium-150'),
      getCSSValue('--yellow-medium-150'),
      getCSSValue('--yellow-medium-150'),
      getCSSValue('--yellow-medium-150'),
      getCSSValue('--yellow-medium-150'),
      getCSSValue('--yellow-medium-150'),
      getCSSValue('--yellow-medium-150'),
      getCSSValue('--yellow-medium-150'),
      getCSSValue('--yellow-medium-150'),
      getCSSValue('--yellow-medium-150'),
    ];
    const dashStyles = [
      'Solid',
      'ShortDot',
      'ShortDashDot',
      'Dash',
      'ShortDash',
      'Dot',
      'ShortDashDotDot',
      'LongDash',
      'DashDot',
      'LongDashDot',
      'LongDashDotDot',
    ];
    const dataGraph2 = [];
    allData.forEach((observationSnapData, i) => {
      const serie = {};
      serie.name = getObservationLabel(
        observationSnapData.observationSnap,
        intl,
      );
      serie.color = colors[i];
      serie.dashStyle = dashStyles[i];
      if (i === 0) {
        serie.marker = {
          fillColor: 'white',
          lineColor: colors[i],
          symbol: 'circle',
          lineWidth: 2,
          radius: 5,
        };
      }
      serie.data = observationSnapData.data.oaHostType.map((value, index) => ({
        y: (value * 100) / observationSnapData.data.all[index],
        y_tot: observationSnapData.data.all[index],
        y_abs: value,
        bsoDomain,
        publisher:
          needle === '*'
            ? intl.formatMessage({ id: 'app.all-publishers' })
            : needle,
        name: getObservationLabel(observationSnapData.observationSnap, intl),
        publicationDate: observationSnapData.data.publicationDates[index],
      }));
      serie.ratios = observationSnapData.data.oaHostType.map(
        (value, index) => `(${value} / ${observationSnapData.data.all[index]})`,
      );
      serie.publicationDate = observationSnapData.data.publicationDates[
        observationSnapData.data.publicationDates.length - 1
      ];
      dataGraph2.push(serie);
    });
    const dataGraph1 = dataGraph2
      .map((el) => ({
        name: el.name,
        bsoDomain,
        y: el.data.length ? el.data[el.data.length - 1].y : 0,
        publisher:
          needle === '*'
            ? intl.formatMessage({ id: 'app.all-publishers' })
            : needle,
        ratio: el.ratios[el.data.length - 1],
        publicationDate: el.publicationDate,
      }))
      .filter((el) => el.y > 0);

    const categories = dataGraph2?.[0]?.data.map(
      (item) => item.publicationDate,
    );

    let beforePublicationYear = '';
    let firstObservationYear = '';
    let observationYear = '';
    let publicationYear = '';
    let rate = '';
    let rate1 = '';
    let rate2 = '';
    let year1 = '';
    let year2 = '';
    let year3 = '';
    if (
      dataGraph1
      && dataGraph1[0]
      && dataGraph1[1]
      && dataGraph1[2]
      && dataGraph2
      && dataGraph2[1]
      && dataGraph2[2]
    ) {
      observationYear = dataGraph1?.[0].name;
      publicationYear = dataGraph1?.[1].name;
      beforePublicationYear = dataGraph1?.[2].name;
      rate = dataGraph1?.[0]?.y.toFixed(0);
      year1 = dataGraph2?.[3]?.name;
      year2 = dataGraph2?.[0]?.name;
      year3 = 2017;
      rate1 = dataGraph2
        .find((item) => item.name === year1)
        ?.data?.find((item) => item.publicationDate === year3)
        ?.y.toFixed(0);
      rate2 = dataGraph2
        .find((item) => item.name === year2)
        ?.data?.find((item) => item.publicationDate === year3)
        ?.y.toFixed(0);
      firstObservationYear = getObservationLabel(
        observationYears[observationYears.length - 1],
        intl,
      );
    }

    const comments = {
      beforePublicationYear,
      firstObservationYear,
      observationYear,
      publicationYear,
      rate,
      rate1,
      rate2,
      year1,
      year2,
      year3,
    };

    return {
      categories,
      comments,
      dataGraph1,
      dataGraph2,
    };
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataByObservationSnaps(observationSnaps);
        setData(dataGraph);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needle, observationSnaps]);

  return { data, isLoading, isError };
}
export default useGetData;
