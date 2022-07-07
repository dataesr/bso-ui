import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  getCSSValue,
  getObservationLabel,
  getPublicationYearFromObservationSnap,
} from '../../../../../utils/helpers';

function useGetData(beforeLastObservationSnap, observationDate, domain = '') {
  const intl = useIntl();
  const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const getDataForLastObservationDate = useCallback(
    async (lastObservationSnap) => {
      const queries = [];
      const query1 = getFetchOptions({
        key: 'publicationRateRangUtile',
        domain,
        parameters: [lastObservationSnap],
      });
      queries.push(Axios.post(ES_API_URL, query1, HEADERS));
      const query2 = getFetchOptions({
        key: 'publicationRatePays',
        domain,
        parameters: [lastObservationSnap],
      });
      queries.push(Axios.post(ES_API_URL, query2, HEADERS));
      const res = await Axios.all(queries);
      let data1 = res[0].data.aggregations.by_publication_year.buckets;

      data1 = data1
        .sort((a, b) => a.key - b.key)
        .filter(
          (el) => el.key > 2012
            && parseInt(el.key, 10)
              < parseInt(lastObservationSnap.substring(0, 4), 10),
        );
      const categories = [];
      const fr = [];
      const foreign = [];

      data1.forEach((el) => {
        categories.push(el.key);
        const frCurrent = el.by_author_useful_rank_fr.buckets.find(
          (item) => item.key === 1,
        );
        const foreignCurrent = el.by_author_useful_rank_fr.buckets.find(
          (item) => item.key === 0,
        );
        fr.push({
          bsoDomain,
          y:
            (100
              * frCurrent.by_is_oa.buckets.find((item) => item.key === 1)
                .doc_count)
            / frCurrent.doc_count,
          y_abs: frCurrent.by_is_oa.buckets.find((item) => item.key === 1)
            .doc_count,
          y_tot: frCurrent.doc_count,
          x: el.key,
        });
        foreign.push({
          bsoDomain,
          y:
            (100
              * foreignCurrent.by_is_oa.buckets.find((item) => item.key === 1)
                .doc_count)
            / foreignCurrent.doc_count,
          y_abs: foreignCurrent.by_is_oa.buckets.find((item) => item.key === 1)
            .doc_count,
          y_tot: foreignCurrent.doc_count,
          x: el.key,
        });
      });

      const dataGraph = [
        {
          name: intl.formatMessage({
            id: 'app.affiliations.rang-utile-fr',
          }),
          data: fr,
          color: getCSSValue('--blue-soft-125'),
        },
        {
          name: intl.formatMessage({
            id: 'app.affiliations.rang-utile-etranger',
          }),
          data: foreign,
          color: getCSSValue('--green-warm-100'),
        },
      ];

      const data2 = res[1].data.aggregations.by_country.buckets;
      const categories2 = [];
      let oaCountry = [];
      data2.forEach((el) => {
        oaCountry.push({
          bsoDomain,
          y:
            (100
              * el.by_is_oa.buckets.find((item) => item.key === 1)?.doc_count
              || 0) / el.doc_count,
          y_abs:
            el.by_is_oa.buckets.find((item) => item.key === 1)?.doc_count || 0,
          y_tot: el.doc_count,
          country: intl.formatMessage({ id: `app.country.${el.key}` }),
          publicationDate:
            getPublicationYearFromObservationSnap(lastObservationSnap),
          color:
            el.key === 'fr'
              ? getCSSValue('--blue-soft-125')
              : getCSSValue('--acces-ouvert'),
        });
      });
      oaCountry = oaCountry.sort((a, b) => a.y - b.y);
      oaCountry.forEach((el) => {
        categories2.push(el.country);
      });
      const dataGraph2 = [
        {
          name: intl.formatMessage({ id: 'app.type-hebergement.open' }),
          data: oaCountry,
          color: getCSSValue('--acces-ouvert'),
        },
      ];

      const publicationYear = getObservationLabel(
        beforeLastObservationSnap,
        intl,
      );
      const withFrenchAffiliationLabel = intl.formatMessage({
        id: 'app.affiliations.rang-utile-fr',
      });
      const withFrenchAffiliation = dataGraph
        .find((item) => item.name === withFrenchAffiliationLabel)
        ?.data.find((item) => item.x.toString() === publicationYear)
        ?.y?.toFixed(0);
      const withoutFrenchAffiliationLabel = intl.formatMessage({
        id: 'app.affiliations.rang-utile-etranger',
      });
      const withoutFrenchAffiliation = dataGraph
        .find((item) => item.name === withoutFrenchAffiliationLabel)
        ?.data.find((item) => item.x.toString() === publicationYear)
        ?.y?.toFixed(0);

      const comments = {
        publicationYear,
        withFrenchAffiliation,
        withoutFrenchAffiliation,
      };

      return {
        categories,
        categories2,
        comments,
        dataGraph,
        dataGraph2,
      };
    },
    [beforeLastObservationSnap, bsoDomain, domain, intl],
  );

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataForLastObservationDate(observationDate);
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
  }, [observationDate]);

  return { allData, isError, isLoading };
}
export default useGetData;
