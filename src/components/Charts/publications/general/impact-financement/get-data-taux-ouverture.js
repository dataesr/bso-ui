import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import {
  capitalize,
  getCSSValue,
  getURLSearchParams,
} from '../../../../../utils/helpers';

function useGetData(observationSnap, domain, split) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  let possibleKeys = [];
  let splitKey = '';
  if (split === 'voie') {
    possibleKeys = [
      'publisher',
      'publisher;repository',
      'repository',
      'closed',
    ];
    splitKey = 'oa_host_type';
  } else if (split === 'business_model') {
    possibleKeys = ['hybrid', 'other', 'gold', 'diamond'];
    splitKey = 'oa_colors_with_priority_to_publisher';
  }

  async function getDataForLastObservationSnap(lastObservationSnap) {
    const { agency } = getURLSearchParams(intl);
    const queries = [];
    const queryFiltered = getFetchOptions({
      key: 'oaHostType',
      domain,
      parameters: [
        lastObservationSnap,
        `oa_details.${lastObservationSnap}.${splitKey}.keyword`,
        'year',
        2016,
      ],
      objectType: ['publications'],
    });
    const query = getFetchOptions({
      key: 'oaHostType',
      domain,
      parameters: [
        lastObservationSnap,
        `oa_details.${lastObservationSnap}.${splitKey}.keyword`,
        'year',
        2016,
      ],
      objectType: ['publications'],
    });
    if (split === 'business_model') {
      const queryFilterArticle = {
        term: {
          'genre.keyword': 'journal-article',
        },
      };
      const queryFilterOaPublisher = {
        term: {
          [`oa_details.${lastObservationSnap}.oa_host_type`]: 'publisher',
        },
      };
      query.query.bool.filter.push(queryFilterArticle);
      query.query.bool.filter.push(queryFilterOaPublisher);
      queryFiltered.query.bool.filter.push(queryFilterArticle);
      queryFiltered.query.bool.filter.push(queryFilterOaPublisher);
    }
    const indexToDelete = query.query.bool.filter.findIndex(
      (item) => item?.terms?.['bso_local_affiliations.keyword'],
    );
    query.query.bool.filter.splice(indexToDelete, 1);
    if (agency) {
      queryFiltered.query.bool.filter.push({
        term: { 'grants.agency.keyword': agency },
      });
    }
    queries.push(Axios.post(ES_API_URL, queryFiltered, HEADERS));
    queries.push(Axios.post(ES_API_URL, query, HEADERS));
    const res = await Axios.all(queries);
    const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
    let dataAgency = res[0].data.aggregations.by_publication_year.buckets;
    let data = res[1].data.aggregations.by_publication_year.buckets;
    // Sort on publication year desc
    data = data.sort((a, b) => a.key - b.key);
    dataAgency = dataAgency.sort((a, b) => a.key - b.key);
    const categories = []; // X elements
    const colors = {
      repository: getCSSValue('--green-medium-125'),
      green_only: getCSSValue('--green-medium-125'),
      'publisher;repository': getCSSValue('--green-light-100'),
      publisher: getCSSValue('--yellow-medium-125'),
      other: getCSSValue('--other'),
      hybrid: getCSSValue('--hybrid'),
      gold: getCSSValue('--yellow-medium-100'),
      diamond: getCSSValue('--diamond'),
    };
    const messageId = {
      repository: 'app.type-hebergement.repository',
      publisher: 'app.type-hebergement.publisher',
      'publisher;repository': 'app.type-hebergement.publisher-repository',
      other: 'app.publishers.other',
      hybrid: 'app.publishers.hybrid',
      gold: 'app.publishers.gold',
      diamond: 'app.publishers.diamond',
      green_only: 'app.publishers.green_only',
    };
    const customDataGeneral = {};
    const customDataAgency = {};
    possibleKeys.forEach((p) => {
      customDataGeneral[p] = [];
      customDataAgency[p] = [];
    });
    data.forEach((el) => {
      categories.push(el.key);
    });
    categories.forEach((y) => {
      const elemGeneral = data.filter((el) => el.key === y)[0];
      const elemAgency = dataAgency.filter((el) => el.key === y)[0];
      let totalGeneral = 0;
      let totalAgency = 0;
      const bucketsGeneral = elemGeneral.by_oa_host_type?.buckets;
      const bucketsAgency = elemAgency.by_oa_host_type?.buckets;
      possibleKeys.forEach((p) => {
        totalGeneral
          += bucketsGeneral.filter((e) => e.key === p)[0]?.doc_count || 0;
        totalAgency
          += bucketsAgency.filter((e) => e.key === p)[0]?.doc_count || 0;
      });
      possibleKeys.forEach((p) => {
        const currentGeneral = bucketsGeneral.filter((e) => e.key === p)[0]?.doc_count || 0;
        customDataGeneral[p].push({
          y: (currentGeneral * 100) / totalGeneral,
          y_tot: totalGeneral,
          y_abs: currentGeneral,
          bsoDomain,
          publicationDate: y,
        });
        const currentAgency = bucketsAgency.filter((e) => e.key === p)[0]?.doc_count || 0;
        customDataAgency[p].push({
          y: (currentAgency * 100) / totalAgency,
          y_tot: totalAgency,
          y_abs: currentAgency,
          bsoDomain,
          publicationDate: y,
        });
      });
    });
    const dataGraph = [];
    possibleKeys
      .filter((p) => p !== 'closed')
      .forEach((p) => {
        dataGraph.push({
          name: capitalize(
            intl.formatMessage({
              id: messageId[p] || 'UNK',
            }),
          ),
          data: customDataGeneral[p],
          color: colors[p],
          stack: 'all',
        });
        dataGraph.push({
          name: capitalize(
            intl.formatMessage({
              id: messageId[p] || 'UNK',
            }),
          ),
          data: customDataAgency[p],
          color: colors[p],
          linkedTo: ':previous',
          stack: 'agency',
        });
      });
    const comments = {};

    return {
      categories,
      comments,
      ctas: [
        'https://pubmed.ncbi.nlm.nih.gov/',
        'https://www.nih.gov/',
        'https://anr.fr/',
      ],
      dataGraph,
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
  }, [observationSnap]);
  return { allData, isError, isLoading };
}

export default useGetData;
