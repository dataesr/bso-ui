import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getObservationLabel,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';

function useGetData(
  observationSnaps,
  beforeLastObservationSnap,
  needle = '*',
  domain,
) {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
  const publisherName = needle === '*' ? intl.formatMessage({ id: 'app.all-publishers' }) : needle;

  async function getDataByObservationSnaps(observationYears) {
    if (!observationYears || observationYears.length === 0) {
      return {};
    }
    // Pour chaque date d'observation, récupération des données associées
    const queries = [];
    const query = getFetchOptions({
      key: 'apcYear',
      domain,
      parameters: [observationYears[0], needle],
      objectType: ['publications'],
    });
    queries.push(Axios.post(ES_API_URL, query, HEADERS));
    const queryHistogram = getFetchOptions({
      key: 'apcHistogram',
      domain,
      parameters: [observationYears[0], needle],
      objectType: ['publications'],
    });
    queries.push(Axios.post(ES_API_URL, queryHistogram, HEADERS));
    const queryPercentile = getFetchOptions({
      key: 'apcPercentile',
      domain,
      parameters: [observationYears[0], needle],
      objectType: ['publications'],
    });
    queries.push(Axios.post(ES_API_URL, queryPercentile, HEADERS));
    const res = await Axios.all(queries);
    // 1er graphe : histogram total
    let dataTotal = res[0].data.aggregations.by_year.buckets;
    // Tri pour avoir les années dans l'ordre d'affichage du graphe
    dataTotal = dataTotal.sort((a, b) => a.key - b.key);
    const categoriesYear = [];
    const goldDataYear = [];
    const hybridDataYear = [];
    const diamondDataYear = [];
    dataTotal
      .filter(
        (el) => el.key > 2012
          && parseInt(el.key, 10)
            < parseInt(observationYears[0].substring(0, 4), 10),
      )
      .forEach((el) => {
        categoriesYear.push(el.key);
        const hybridElem = el.by_oa_colors.buckets.find(
          (b) => b.key === 'hybrid',
        );
        const hybridAPC = hybridElem?.apc?.value || 0;
        const hybridCount = hybridElem?.doc_count || 0;
        hybridDataYear.push({
          bsoDomain,
          publisher: publisherName,
          y: hybridAPC,
          count: hybridCount,
          publicationDate: el.key,
        });
        const goldElem = el.by_oa_colors.buckets.find((b) => b.key === 'gold');
        const goldAPC = goldElem?.apc?.value || 0;
        const goldCount = goldElem?.doc_count || 0;
        goldDataYear.push({
          publisher: publisherName,
          bsoDomain,
          y: goldAPC,
          count: goldCount,
          publicationDate: el.key,
        });
        const diamondElement = el.by_oa_colors.buckets.find(
          (b) => b.key === 'diamond',
        );
        const diamondAPC = diamondElement?.apc?.value || 0;
        const diamondCount = diamondElement?.doc_count || 0;
        diamondDataYear.push({
          publisher: publisherName,
          bsoDomain,
          y: diamondAPC,
          count: diamondCount,
          publicationDate: el.key,
        });
      });
    const dataGraphTotal = [
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.apc-hybrid',
          }),
        ),
        data: hybridDataYear,
        color: getCSSValue('--hybrid'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.apc-gold',
          }),
        ),
        data: goldDataYear,
        color: getCSSValue('--yellow-medium-100'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.diamond',
          }),
        ),
        data: diamondDataYear,
        color: getCSSValue('--diamond'),
      },
    ];

    // 2e graph : graphe histogramme distribution
    let dataDistribution = res[1].data.aggregations.by_year.buckets;
    // Tri pour avoir les années dans l'ordre d'affichage du graphe
    dataDistribution = dataDistribution
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key > 2012
          && parseInt(el.key, 10)
            < parseInt(observationYears[0].substring(0, 4), 10),
      );
    const goldDataHistogram = [];
    const hybridDataHistogram = [];
    const diamondDataHistogram = [];
    const categoriesHistogram = [];
    const categoriesViolin = [];
    const goldDataViolin = [];
    const hybridDataViolin = [];
    const histogramInterval = queryHistogram.aggs.by_year.aggs.by_oa_colors.aggs.apc.histogram.interval;
    const publicationDate = getPublicationYearFromObservationSnap(
      observationYears[0],
    );
    dataDistribution.forEach((elem, yearIndex) => {
      const currentYear = elem.key;
      const currentHybridDataViolin = [];
      const currentGoldDataViolin = [];
      categoriesViolin.push(currentYear);
      const hybridElems = elem.by_oa_colors.buckets.find(
        (b) => b.key === 'hybrid',
      );
      const goldElems = elem.by_oa_colors.buckets.find((b) => b.key === 'gold');
      const diamondElements = elem.by_oa_colors.buckets.find(
        (b) => b.key === 'diamond',
      );
      for (
        let j = 0;
        j
        < Math.max(
          goldElems?.apc?.buckets?.length || 0,
          hybridElems?.apc?.buckets?.length || 0,
        );
        j += 1
      ) {
        const trancheAPC = j * histogramInterval;
        let currentHybridY = 0;
        let currentGoldY = 0;
        let currentDiamondY = 0;
        if (hybridElems && trancheAPC === hybridElems?.apc?.buckets[j]?.key) {
          currentHybridY = hybridElems.apc.buckets[j].doc_count;
        }
        if (goldElems && trancheAPC === goldElems?.apc?.buckets[j]?.key) {
          currentGoldY = goldElems.apc.buckets[j].doc_count;
        }
        if (
          diamondElements
          && trancheAPC === diamondElements?.apc?.buckets[j]?.key
        ) {
          currentDiamondY = diamondElements.apc.buckets[j].doc_count;
        }
        // la distribution des hybrides est sur la partie droite du violin, donc les triplets de points seront de la forme [trancheAPC, 0, valeur]
        // triplets qu'il faut ensuite translater en fonction de l'année ce qui donne au final [trancheAPC, yearIndex, valeur + yearIndex]
        currentHybridDataViolin.push([
          trancheAPC,
          0 + yearIndex,
          yearIndex + currentHybridY / (hybridElems?.doc_count || 1),
        ]);
        // la distribution des gold est sur la partie gauche du violin, donc les triplets de points seront de la forme [trancheAPC, - valeur , 0]
        // triplets qu'il faut ensuite translater en fonction de l'année ce qui donne au final [trancheAPC, yearIndex - valeur , yearIndex]
        currentGoldDataViolin.push([
          trancheAPC,
          yearIndex - currentGoldY / (goldElems?.doc_count || 1),
          0 + yearIndex,
        ]);
        if (currentYear === publicationDate) {
          categoriesHistogram.push(trancheAPC);
          hybridDataHistogram.push({
            publisher: publisherName,
            publicationDate,
            y: currentHybridY,
            interval_lower: trancheAPC,
            interval_upper: trancheAPC + histogramInterval,
            y_tot: hybridElems?.doc_count || 0,
            bsoDomain,
          });
          goldDataHistogram.push({
            publisher: publisherName,
            publicationDate,
            y: currentGoldY,
            interval_lower: trancheAPC,
            interval_upper: trancheAPC + histogramInterval,
            y_tot: goldElems?.doc_count || 0,
            bsoDomain,
          });
          diamondDataHistogram.push({
            publisher: publisherName,
            publicationDate,
            y: currentDiamondY,
            interval_lower: trancheAPC,
            interval_upper: trancheAPC + histogramInterval,
            y_tot: diamondElements?.doc_count || 0,
            bsoDomain,
          });
        }
      }
      goldDataViolin.push(currentGoldDataViolin);
      hybridDataViolin.push(currentHybridDataViolin);
    });
    const dataGraphHistogram = [
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.apc-hybrid',
          }),
        ),
        data: hybridDataHistogram,
        color: getCSSValue('--hybrid'),
      },
      {
        name: capitalize(
          intl.formatMessage({
            id: 'app.publishers.apc-gold',
          }),
        ),
        data: goldDataHistogram,
        color: getCSSValue('--yellow-medium-100'),
      },
    ];

    const dataGraphViolin = [];
    categoriesViolin.forEach((y, i) => {
      const showInLegend = i === 0;
      dataGraphViolin.push({
        name: intl.formatMessage({ id: 'app.publishers.apc-hybrid' }),
        color: getCSSValue('--hybrid'),
        data: hybridDataViolin[i],
        showInLegend,
        enableMouseTracking: false,
      });
      dataGraphViolin.push({
        name: intl.formatMessage({ id: 'app.publishers.apc-gold' }),
        color: getCSSValue('--yellow-medium-100'),
        data: goldDataViolin[i],
        showInLegend,
        enableMouseTracking: false,
      });
    });
    // calcul des medianes pour le violin
    const goldDataYearMedian = [];
    const hybridDataYearMedian = [];
    res[2].data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key > 2012
          && parseInt(el.key, 10)
            < parseInt(observationYears[0].substring(0, 4), 10),
      )
      .forEach((el, yearIndex) => {
        const hybridElem = el.by_oa_colors.buckets.find(
          (b) => b.key === 'hybrid',
        );
        const hybridMedian = hybridElem?.apc?.values['50.0'] || null;
        const hybridCount = hybridElem?.doc_count || 0;
        const goldElem = el.by_oa_colors.buckets.find((b) => b.key === 'gold');
        const goldMedian = goldElem?.apc?.values['50.0'] || null;
        const goldCount = goldElem?.doc_count || 0;
        goldDataYearMedian.push({
          publisher: publisherName,
          x: goldMedian,
          y: yearIndex,
          count: goldCount,
          publicationDate: el.key,
          bsoDomain,
        });
        hybridDataYearMedian.push({
          publisher: publisherName,
          x: hybridMedian,
          y: yearIndex,
          count: hybridCount,
          publicationDate: el.key,
          bsoDomain,
        });
      });
    dataGraphViolin.push({
      type: 'scatter',
      name: intl.formatMessage({ id: 'app.publishers.apc-hybrid-median' }),
      data: hybridDataYearMedian,
      color: getCSSValue('--hybrid'),
      marker: { lineColor: getCSSValue('--hybrid') },
    });
    dataGraphViolin.push({
      type: 'scatter',
      name: intl.formatMessage({ id: 'app.publishers.apc-gold-median' }),
      data: goldDataYearMedian,
      color: getCSSValue('--yellow-medium-100'),
      marker: { lineColor: getCSSValue('--yellow-medium-100') },
    });

    const dataGraphViolinGoldAPC = dataGraphViolin.find(
      (item) => item.name === 'Médiane des APC Gold',
    )?.data || [null];

    const comments = {
      medianValueFirst: dataGraphViolinGoldAPC[0]?.x?.toFixed(0),
      medianValueLast:
        dataGraphViolinGoldAPC[dataGraphViolinGoldAPC.length - 1]?.x?.toFixed(
          0,
        ),
      medianYearFirst: dataGraphViolinGoldAPC[0]?.publicationDate,
      medianYearLast:
        dataGraphViolinGoldAPC[dataGraphViolinGoldAPC.length - 1]
          ?.publicationDate,
      publicationYear: getObservationLabel(beforeLastObservationSnap, intl),
    };

    return {
      categoriesHistogram,
      categoriesViolin,
      categoriesYear,
      comments,
      dataGraphHistogram,
      dataGraphTotal,
      dataGraphViolin,
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
