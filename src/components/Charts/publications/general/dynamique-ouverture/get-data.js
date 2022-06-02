import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getObservationLabel,
} from '../../../../../utils/helpers';

function useGetData(observationSnaps, domain = '') {
  const intl = useIntl();
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const { search } = useLocation();

  const getDataByObservationSnaps = useCallback(
    async (datesObservation) => {
      // Pour chaque date d'observation, récupération des données associées
      const queries = [];
      datesObservation
        ?.sort((a, b) => b.substr(0, 4) - a.substr(0, 4))
        .forEach((oneDate) => {
          const query = getFetchOptions({
            key: 'publicationRate',
            domain,
            search,
            parameters: [oneDate],
          });
          queries.push(Axios.post(ES_API_URL, query, HEADERS));
        });
      if (domain !== '') {
        datesObservation
          ?.sort((a, b) => b.substr(0, 4) - a.substr(0, 4))
          .forEach((oneDate) => {
            const query = getFetchOptions({
              key: 'publicationRate',
              search,
              parameters: [oneDate],
            });
            queries.push(Axios.post(ES_API_URL, query, HEADERS));
          });
      }

      const res = await Axios.all(queries);
      const allData = res.map((d, i) => ({
        observationSnap: datesObservation[i % datesObservation.length],
        data: d.data.aggregations.by_publication_year.buckets,
      }));
      const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
      const bsoDomainGlobal = intl.formatMessage({ id: 'app.bsoDomain.' });
      const colors = [
        getCSSValue('--orange-soft-100'),
        getCSSValue('--orange-soft-125'),
        getCSSValue('--orange-soft-125'),
        getCSSValue('--orange-soft-125'),
        getCSSValue('--orange-soft-175'),
        getCSSValue('--orange-soft-175'),
        getCSSValue('--orange-soft-175'),
      ];
      const lineStyle = ['solid', 'ShortDot', 'ShortDashDot', 'Dash'];
      const dataGraph2 = [];
      const dataGraphGlobal = [];
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
        serie.data = filtered.map((el) => ({
          y_tot:
            el.by_is_oa.buckets[0].doc_count
            + (el.by_is_oa.buckets[1]?.doc_count || 0),
          y_abs: el.by_is_oa.buckets.find((b) => b.key === 1)?.doc_count || 0,
          publicationDate: el.key,
          bsoDomain,
          y:
            ((el.by_is_oa.buckets.find((b) => b.key === 1)?.doc_count || 0)
              / ((el.by_is_oa.buckets?.[0]?.doc_count || 0)
                + (el.by_is_oa.buckets?.[1]?.doc_count || 0)))
            * 100,
        }));
        serie.ratios = filtered.map(
          (el) => `(${el.by_is_oa.buckets[0].doc_count} / ${el.doc_count})`,
        );
        serie.lastPublicationDate = filtered.length > 0 ? filtered[filtered.length - 1].key : 0;
        if (i < datesObservation.length) {
          dataGraph2.push(serie);
        } else {
          dataGraphGlobal.push(serie);
        }
      });

      const dataGraph1 = { series: [] };
      const serie1 = [];
      const serieGlobal = [];
      dataGraph2.forEach((el) => {
        serie1.push({
          bsoDomain,
          name: el.name,
          y: el.data.length > 0 ? el.data[el.data.length - 1].y : 0,
          ratio: el.data.length > 0 ? el.ratios[el.data.length - 1] : 0,
          publicationDate: el.lastPublicationDate,
        });
      });
      dataGraphGlobal.forEach((el) => {
        serieGlobal.push({
          bsoDomain: bsoDomainGlobal,
          name: el.name,
          y: el.data.length > 0 ? el.data[el.data.length - 1].y : 0,
          ratio: el.data.length > 0 ? el.ratios[el.data.length - 1] : 0,
          publicationDate: el.lastPublicationDate,
        });
      });
      const showInLegend = domain !== '';
      const currentName = domain !== ''
        ? intl.formatMessage({ id: `app.publications.${domain}` })
        : intl.formatMessage({ id: 'app.publications.global' });
      dataGraph1.series.push({
        data: serie1,
        showInLegend,
        name: capitalize(currentName),
      });
      if (domain !== '') {
        dataGraph1.series.push({
          data: serieGlobal,
          showInLegend,
          name: capitalize(
            intl.formatMessage({ id: 'app.publications.global' }),
          ),
          pointPlacement: -0.2,
        });
      }
      const categories = dataGraph2?.[0]?.data.map((item) => item.publicationDate) || [];

      const year1 = '2019';
      const year2 = '2020';
      const year3 = '2021';
      const value1 = dataGraph2[1]?.data.slice(-1)?.[0]?.y.toFixed(0) || 0;
      const value2 = dataGraph1?.series[0]?.data
        .find((item) => item.name === year3)
        ?.y.toFixed(0) || 0;
      const healthPublicationsLabel = capitalize(
        intl.formatMessage({ id: 'app.publications.health' }),
      );
      const healthValue1 = dataGraph1?.series
        .find((item) => item.name === healthPublicationsLabel)
        ?.data?.find((item) => item.name === year2)
        ?.y.toFixed(0) || 0;
      const healthValue2 = dataGraph1?.series
        .find((item) => item.name === healthPublicationsLabel)
        ?.data?.find((item) => item.name === year3)
        ?.y.toFixed(0) || 0;
      const comments = {
        observationDate: dataGraph2[0]?.name,
        observationDate4: dataGraph2[3]?.name,
        oaYMinusOne4: dataGraph2[3]?.data.slice(-1)?.[0]?.y.toFixed(0) || 0,
        oaYMinus4: dataGraph2[0]?.data.slice(-4)?.[0]?.y.toFixed(0) || 0,
        publicationDate4:
          dataGraph2[3]?.data.slice(-1)?.[0]?.publicationDate || 0,
        minPublicationDate: dataGraph2[0]?.data?.[0]?.publicationDate || 0,
        oaYMinusOne: dataGraph2[0]?.data.slice(-2)?.[0]?.y.toFixed(0) || 0,
        oaEvolution:
          (
            dataGraph2?.[0]?.data.slice(-2)?.[0]?.y
            || 0 - dataGraph2?.[1]?.data.slice(-1)?.[0]?.y
            || 0
          ).toFixed(2) || 0,
        maxPublicationDate: dataGraph2?.[0]?.lastPublicationDate || '',
        year1,
        year2,
        year3,
        value1,
        value2,
        healthValue1,
        healthValue2,
        differenceValue: value2 - value1,
        healthDifferenceValue: healthValue2 - healthValue1,
      };

      return {
        categories,
        comments,
        dataGraph1,
        dataGraph2,
      };
    },
    [domain, intl, search],
  );

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
  }, [observationSnaps, getDataByObservationSnaps]);

  return { data, isLoading, isError };
}
export default useGetData;
