import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue, getObservationLabel } from '../../../../../utils/helpers';

function useGetData(
  observationSnaps,
  lastObservationSnap,
  needle = '*',
  domain,
) {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });

  async function getDataByObservationSnaps(datesObservation) {
    const queryAffiliations = getFetchOptions({
      key: 'affiliationsList',
      domain,
      parameters: [lastObservationSnap],
    });
    const response = await Axios.post(ES_API_URL, queryAffiliations, HEADERS);
    let affiliations = response.data.aggregations.by_affiliation.buckets
      .map((item) => item.key)
      .sort();
    affiliations = affiliations.map((affiliation) => ({
      label: intl.formatMessage({ id: `app.affiliations.${affiliation}` }),
      value: affiliation,
    }));

    // Pour chaque date d'observation, récupération des données associées
    const queries = [];
    datesObservation
      ?.sort((a, b) => b.substr(0, 4) - a.substr(0, 4))
      .forEach((oneDate) => {
        const needlePublisher = '*';
        const allOaHostType = '*';
        const query = getFetchOptions({
          key: 'publicationRate',
          domain,
          parameters: [oneDate, needlePublisher, allOaHostType],
        });
        query.query.bool.filter.push({
          wildcard: { 'french_affiliations_types.keyword': needle },
        });
        queries.push(Axios.post(ES_API_URL, query, HEADERS));
      });

    const res = await Axios.all(queries);

    const allData = res.map((d, i) => ({
      observationSnap: datesObservation[i],
      data: d.data.aggregations.by_publication_year.buckets,
    }));

    const colors = [
      getCSSValue('--affiliations-etablissements-150'),
      getCSSValue('--affiliations-etablissements-125'),
      getCSSValue('--affiliations-etablissements-100'),
      getCSSValue('--affiliations-etablissements-75'),
      getCSSValue('--affiliations-etablissements-50'),
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
      serie.name = getObservationLabel(
        observationSnapData.observationSnap,
        intl,
      );
      serie.color = colors[i];
      serie.dashStyle = lineStyle[i];
      if (i === 0) {
        serie.marker = {
          fillColor: 'white',
          lineColor: colors[i],
          symbol: 'circle',
          lineWidth: 2,
          radius: 5,
        };
      }
      serie.data = filtered.map((el, index) => ({
        bsoDomain,
        y: (el.by_is_oa.buckets[0].doc_count * 100) / el.doc_count,
        y_tot: el.doc_count,
        y_abs: el.by_is_oa.buckets[0].doc_count,
        affiliation:
          needle === '*'
            ? intl.formatMessage({ id: 'app.all-affiliations' })
            : needle,
        name: filtered[index].key,
        publicationDate: filtered[index].key,
      }));
      serie.ratios = filtered.map(
        (el) => `(${el.by_is_oa.buckets[0].doc_count} / ${el.doc_count})`,
      );
      serie.publicationDate = filtered[filtered.length - 1].key;
      dataGraph2.push(serie);
    });

    const categories = dataGraph2?.[0]?.data.map((item) => item.publicationDate) || [];

    const dataGraph1 = dataGraph2.map((el) => ({
      name: el.name, // observation date
      bsoDomain,
      y: el.data[el.data.length - 1].y,
      affiliation: el.data[el.data.length - 1].affiliation,
      ratio: el.ratios[el.data.length - 1],
      publicationDate: el.publicationDate,
      color: getCSSValue('--affiliations-etablissements-100'),
      states: {
        hover: {
          color: getCSSValue('--affiliations-etablissements-125'),
        },
      },
    }));

    return {
      affiliations,
      categories,
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
