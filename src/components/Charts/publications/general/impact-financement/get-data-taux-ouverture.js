import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { ES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue, getObservationLabel } from '../../../../../utils/helpers';

function useGetData(beforeLastObservationSnap, observationSnap, domain) {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const { search } = useLocation();

  async function getDataForLastObservationSnap(lastObservationSnap) {
    const queries = [];
    const queryFilter = [
      {
        term: {
          'grants.agency.keyword': 'ANR',
        },
      },
      {
        term: {
          'bso_local_affiliations.keyword': 'ANR',
        },
      },
    ];
    const queryFiltered = getFetchOptions({
      key: 'openingRateGrant',
      domain,
      search,
      parameters: [lastObservationSnap, queryFilter],
    });
    queries.push(Axios.post(ES_API_URL, queryFiltered, HEADERS));
    const query = getFetchOptions({
      key: 'openingRateGrant',
      domain,
      search,
      parameters: [lastObservationSnap, []],
    });
    queries.push(Axios.post(ES_API_URL, query, HEADERS));
    const res = await Axios.all(queries);
    const bsoDomain = intl.formatMessage({ id: `app.bsoDomain.${domain}` });
    let dataAgency = res[0].data.aggregations.by_publication_year.buckets;
    let data = res[1].data.aggregations.by_publication_year.buckets;

    // Tri pour avoir les années dans l'ordre d'affichage du graphe
    data = data.sort((a, b) => a.key - b.key);
    dataAgency = dataAgency.sort((a, b) => a.key - b.key);
    const categories = []; // Elements d'abscisse
    const all = [];
    const withDeclaration = [];
    // const withoutDeclaration = [];
    dataAgency
      .filter(
        (el) => el.key > 2012
          && el.doc_count > 1
          && parseInt(el.key, 10)
            < parseInt(lastObservationSnap.substring(0, 4), 10),
      )
      .forEach((el) => {
        // avec declaration
        const withDeclarationOa = el?.by_is_oa.buckets.find(
          (item) => item.key === 1,
        )?.doc_count || 0;
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

        // avec ou sans declaration
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
        if (withDeclaration[index].publicationDate > el.key) {
          withDeclaration.unshift(null);
        }
        // sans declaration
        // const withoutDeclarationElements = el.by_has_grant.buckets.find(
        //   (item) => item.key === 0,
        // );
        // const withoutDeclarationOa = withoutDeclarationElements.by_is_oa.buckets.find(
        //   (item) => item.key === 1,
        // )?.doc_count || 0;
        // withoutDeclaration.push({
        //   y:
        //     (100 * withoutDeclarationOa) / withoutDeclarationElements.doc_count,
        //   y_abs: withoutDeclarationOa,
        //   y_tot: withoutDeclarationElements.doc_count,
        //   publicationDate: el.key,
        //   bsoDomain,
        //   agency: 'no-grant',
        // });
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
      // {
      //   name: intl.formatMessage({ id: 'app.without-declaration' }),
      //   data: withoutDeclaration,
      //   color: getCSSValue('--g-400'),
      // },
    ];

    const publicationYear = parseInt(getObservationLabel(beforeLastObservationSnap, intl), 10);
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
        ?.y.toFixed(0);
      publicationsWithoutStatementRate = dataGraph
        .find((item) => item.name === publicationsWithoutStatementLabel)
        ?.data?.find((item) => item?.publicationDate === publicationYear)
        ?.y.toFixed(0);
    }

    const comments = {
      allPublicationsRate,
      publicationsWithoutStatementRate,
      publicationsWithStatementRate,
      publicationYear,
    };

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
