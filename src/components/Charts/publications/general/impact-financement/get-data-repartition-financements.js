import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue, getURLSearchParams } from '../../../../../utils/helpers';

function useGetData(observationSnap, needle = '*', domain) {
  const intl = useIntl();
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  async function getDataForLastObservationSnap(lastObservationSnap) {
    const { agency, bsoLocalAffiliation } = getURLSearchParams(intl);
    const queries = [];
    const query = getFetchOptions({
      key: 'declarationRate',
      domain,
      parameters: [lastObservationSnap, bsoLocalAffiliation, agency],
      objectType: ['publications'],
    });
    query.query.bool.filter.push({
      wildcard: { 'grants.sub_agency.keyword': needle },
    });
    queries.push(Axios.post(ES_API_URL, query, HEADERS));
    const query2 = getFetchOptions({
      key: 'subAgencies',
      domain,
      parameters: [lastObservationSnap, bsoLocalAffiliation, agency],
      objectType: ['publications'],
    });
    queries.push(Axios.post(ES_API_URL, query2, HEADERS));
    const res = await Axios.all(queries);
    const subAgencies = res?.[1]?.data?.aggregations?.by_sub_agency?.buckets ?? [];
    const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
    const dataAgency = res?.[0]?.data?.aggregations?.by_agency?.buckets
      ?.filter((el) => el.key === agency)?.[0]
      ?.by_funding_year.buckets?.sort((a, b) => a.key - b.key) || [];
    const categories = [];
    const dataGraph = [];
    const colors = [
      getCSSValue('--blue-soft-150'),
      getCSSValue('--blue-soft-150'),
      getCSSValue('--blue-soft-150'),
      getCSSValue('--blue-soft-150'),
      getCSSValue('--blue-soft-150'),
      getCSSValue('--blue-soft-150'),
      getCSSValue('--blue-soft-150'),
      getCSSValue('--blue-soft-150'),
      getCSSValue('--blue-soft-150'),
      getCSSValue('--blue-soft-150'),
      getCSSValue('--blue-soft-100'),
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
    let ix = 0;
    dataAgency.forEach((el) => {
      const fundingYear = el.key;
      categories.push(fundingYear);
      const currentData = [];
      let nbTotal = 0;
      el.by_publication_year.buckets
        .sort((a, b) => a.key - b.key)
        .forEach((b) => {
          const publicationDate = b.key;
          const oa = b.by_is_oa.buckets.find((k) => k.key === 1)?.doc_count || 0;
          const closed = b.by_is_oa.buckets.find((k) => k.key === 0)?.doc_count || 0;
          const total = oa + closed;
          nbTotal += total;
          if (publicationDate > fundingYear && total > 10) {
            currentData.push({
              x: publicationDate,
              subagency:
                needle === '*'
                  ? intl.formatMessage({ id: 'app.all-agency' })
                  : needle,
              publicationDate,
              y_abs: oa,
              y_tot: total,
              y: (100.0 * oa) / total,
              bsoDomain,
              color: colors[ix],
            });
          }
        });
      const currentSerie = {
        name: el.key,
        data: currentData,
        nbTotal,
        color: colors[ix],
        dashStyle: dashStyles[ix],
      };
      const minTotal = agency === 'ANR' ? 100 : 0;
      if (nbTotal >= minTotal && fundingYear >= 2016) {
        dataGraph.push(currentSerie);
        ix += 1;
      }
    });

    return {
      categories,
      dataGraph,
      subAgencies,
    };
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataForLastObservationSnap(observationSnap);
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
  }, [needle, observationSnap]);
  return { data, isError, isLoading };
}
export default useGetData;
