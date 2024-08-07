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
    // For each observation year, retrieve associated data
    const queries = [];
    observationYears
      ?.sort((a, b) => b.substring(0, 4) - a.substring(0, 4))
      .forEach((oneDate) => {
        const publisherNeedle = '*';
        const allOaHostType = '*';
        const query = getFetchOptions({
          key: 'publicationRate',
          domain,
          parameters: [oneDate, publisherNeedle, allOaHostType],
          objectType: ['publications'],
        });
        const queryFiltered = getFetchOptions({
          key: 'publicationRate',
          domain,
          parameters: [oneDate, publisherNeedle, 'repository'],
          objectType: ['publications'],
        });
        const wildcard = {};
        wildcard[`oa_details.${oneDate}.repositories.keyword`] = needle;
        queryFiltered.query.bool.filter.push({ wildcard });
        // on veut calculer le ratio (open access avec oaHostType=repository) / (toutes les publications)
        // il faut donc lancer deux requêtes : queryFiltered pour le numérateur et query pour le denominateur
        queries.push(Axios.post(ES_API_URL, queryFiltered, HEADERS));
        queries.push(Axios.post(ES_API_URL, query, HEADERS));
      });

    const responses = await Axios.all(queries);
    const allData = [];
    for (let i = 0; i < responses.length; i += 1) {
      const newData = {};
      if (i % 2 === 1) {
        newData.observationSnap = observationYears[(i - 1) / 2];
        newData.data = {};
        const responseFiltered = responses[
          i - 1
        ].data.aggregations.by_publication_year.buckets
          .sort((a, b) => a.key - b.key)
          .filter(
            (el) => el.key < parseInt(newData.observationSnap.substring(0, 4), 10)
              && el.by_is_oa.buckets.length > 0
              && el.doc_count
              && el.key > 2012,
          );
        const publicationDates = [];
        const all = [];
        const oaHostTypes = [];
        const tmpData = responses[
          i
        ].data.aggregations.by_publication_year.buckets
          .sort((a, b) => a.key - b.key)
          .filter(
            (el) => el.key < parseInt(newData.observationSnap.substring(0, 4), 10)
              && el.by_is_oa.buckets.length > 0
              && el.doc_count
              && el.key > 2012,
          );
        tmpData.forEach((el) => {
          publicationDates.push(el.key);
          all.push(el.doc_count);
          oaHostTypes.push(
            responseFiltered.filter((r) => r.key === el.key)[0]?.doc_count || 0,
          );
        });
        newData.data.publicationDates = publicationDates;
        newData.data.all = all;
        newData.data.oaHostType = oaHostTypes;
        allData.push(newData);
      }
    }

    const colors = [
      getCSSValue('--green-medium-125'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
      getCSSValue('--green-medium-150'),
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
        archive:
          needle === '*'
            ? intl.formatMessage({ id: 'app.all-repositories' })
            : needle,
        name: getObservationLabel(observationSnapData.observationSnap, intl), // observation date
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
        name: el.name, // observation date
        bsoDomain,
        y: el.data[el.data.length - 1]?.y || 0,
        archive:
          needle === '*'
            ? intl.formatMessage({ id: 'app.all-repositories' })
            : needle,
        ratio: el.ratios[el.data.length - 1],
        publicationDate: el.publicationDate,
      }))
      .filter((el) => el.y > 0);

    const categories = dataGraph2?.[0]?.data.map((item) => item.publicationDate) || [];
    let firstObservationYear = '';
    let percentage = '';
    let publicationDate = '';
    let value1 = '';
    let value2 = '';
    let y = '';
    let year = '';
    let year1 = '';
    let year2 = '';
    if (observationSnaps && dataGraph1 && dataGraph2) {
      year = getObservationLabel(observationSnaps[0], intl);
      y = dataGraph1.find((item) => item.name === year).y;
      publicationDate = dataGraph1.find(
        (item) => item.name === year,
      ).publicationDate;
      percentage = y?.toFixed(0);
      year1 = dataGraph2[dataGraph2.length - 1].name;
      value1 = dataGraph2[dataGraph2.length - 1].data
        .find((item) => item.publicationDate === 2017)
        ?.y.toFixed(0);
      year2 = dataGraph2[0].name;
      value2 = dataGraph2[0].data
        .find((item) => item.publicationDate === 2017)
        ?.y.toFixed(0);
      firstObservationYear = getObservationLabel(
        observationSnaps[observationSnaps.length - 1],
        intl,
      );
    }

    const comments = {
      firstObservationYear,
      percentage,
      publicationDate,
      value1,
      value2,
      year,
      year1,
      year2,
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
  }, [observationSnaps, needle]);

  return { data, isError, isLoading };
}
export default useGetData;
