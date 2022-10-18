import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue, getObservationLabel } from '../../../../../utils/helpers';

function useGetData(beforeLastObservationSnap, observationSnap, domain) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  async function getDataForLastObservationSnap(lastObservationSnap) {
    const queries = [];
    const queryFilter = [
      {
        term: {
          'grants.agency.keyword': 'ANR',
        },
      },
    ];
    const queryFiltered = getFetchOptions({
      key: 'openingRateGrant',
      domain,
      parameters: [lastObservationSnap, queryFilter],
      objectType: ['publications'],
    });
    queries.push(Axios.post(ES_API_URL, queryFiltered, HEADERS));
    const query = getFetchOptions({
      key: 'openingRateGrant',
      domain,
      parameters: [lastObservationSnap, []],
      objectType: ['publications'],
    });
    queries.push(Axios.post(ES_API_URL, query, HEADERS));
    const queryAll = getFetchOptions({
      key: 'openingRateAllGrant',
      domain,
      parameters: [lastObservationSnap],
      objectType: ['publications'],
    });
    queries.push(Axios.post(ES_API_URL, queryAll, HEADERS));
    const res = await Axios.all(queries);
    const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
    let dataAgency = res[0].data.aggregations.by_publication_year.buckets;
    let data = res[1].data.aggregations.by_publication_year.buckets;
    const dataAll = res[2].data.aggregations.by_agency.buckets;

    // Sort on publication year desc
    data = data.sort((a, b) => a.key - b.key);
    dataAgency = dataAgency.sort((a, b) => a.key - b.key);
    const categories = []; // X elements
    const all = [];
    const withDeclaration = [];
    dataAgency
      .filter(
        (el) => el.key > 2012
          && el.doc_count > 1
          && parseInt(el.key, 10)
            < parseInt(lastObservationSnap.substring(0, 4), 10),
      )
      .forEach((el) => {
        // avec declaration
        const withDeclarationOa = el?.by_is_oa.buckets.find((item) => item.key === 1)?.doc_count || 0;
        withDeclaration.push({
          y: (100 * withDeclarationOa) / el?.doc_count,
          y_abs: withDeclarationOa,
          y_tot: el?.doc_count || 0,
          publicationDate: el.key,
          bsoDomain,
          agency: intl.formatMessage({ id: 'app.all-agencies' }),
        });
      });

    data
      .filter(
        (el) => el.key > 2012
          && parseInt(el.key, 10)
            < parseInt(lastObservationSnap.substring(0, 4), 10),
      )
      .forEach((el, index) => {
        categories.push(el.key);

        const Oa = el.by_is_oa.buckets.find((item) => item.key === 1)?.doc_count || 0;
        all.push({
          y: (100 * Oa) / el.doc_count,
          y_abs: Oa,
          y_tot: el.doc_count,
          publicationDate: el.key,
          bsoDomain,
          agency: 'withAndWithoutGrant',
        });
        // avec declaration, on s'assure qu'il y a bien toutes années, sinon on complète par un null
        if (
          withDeclaration?.[index]?.publicationDate === undefined
          || withDeclaration[index].publicationDate > el.key
        ) {
          withDeclaration.unshift(null);
        }
      });
    const dataGraph = [
      {
        name: intl.formatMessage({ id: 'app.all-publications' }),
        data: all,
        color: getCSSValue('--orange-soft-100'),
      },
      {
        name: intl.formatMessage({ id: 'app.with-declaration' }),
        data: withDeclaration,
        color: getCSSValue('--orange-soft-175'),
      },
    ];

    // Get all publication years as abscissa values
    let categoriesAll = dataAll[0].by_publication_year.buckets.map(
      (item) => item.key,
    );
    categoriesAll = categoriesAll.sort();
    const dataGraphAll = [];
    dataAll.forEach((el) => {
      const grants = [];
      // Sort by publication year asc
      const years = el.by_publication_year.buckets.sort(
        (a, b) => a.key - b.key,
      );
      years.forEach((item) => {
        const nbOpen = item.by_is_oa.buckets.find((item2) => item2.key === 1)?.doc_count
          || 0;
        grants.push((nbOpen / item.doc_count) * 100);
      });
      dataGraphAll.push({
        name: el.key,
        data: grants,
      });
    });

    const publicationYear = parseInt(
      getObservationLabel(beforeLastObservationSnap, intl),
      10,
    );
    const allPublicationsLabel = intl.formatMessage({
      id: 'app.all-publications',
    });
    const publicationsWithStatementLabel = intl.formatMessage({
      id: 'app.with-declaration',
    });
    const publicationsWithoutStatementLabel = intl.formatMessage({
      id: 'app.without-declaration',
    });
    let allPublicationsRate = '';
    let publicationsWithStatementRate = '';
    let publicationsWithoutStatementRate = '';
    if (dataGraph) {
      allPublicationsRate = dataGraph
        .find((item) => item.name === allPublicationsLabel)
        ?.data?.find((item) => item?.publicationDate === publicationYear)
        ?.y.toFixed(0);
      publicationsWithStatementRate = dataGraph
        .find((item) => item.name === publicationsWithStatementLabel)
        ?.data?.find((item) => item?.publicationDate === publicationYear)
        ?.y.toFixed(0) || 0;
      publicationsWithoutStatementRate = dataGraph
        .find((item) => item.name === publicationsWithoutStatementLabel)
        ?.data?.find((item) => item?.publicationDate === publicationYear)
        ?.y.toFixed(0) || 0;
    }

    const comments = {
      allPublicationsRate,
      publicationsWithoutStatementRate,
      publicationsWithStatementRate,
      publicationYear,
    };

    return {
      categories,
      categoriesAll,
      comments,
      ctas: [
        'https://pubmed.ncbi.nlm.nih.gov/',
        'https://www.nih.gov/',
        'https://anr.fr/',
      ],
      dataGraph,
      dataGraphAll,
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
