import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType, sponsorType = '*') {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const location = useLocation();

  async function getDataAxios() {
    const querySponsorTypes = getFetchOptions(
      'sponsorsTypesList',
      '',
      location,
      studyType,
    );

    const responseSponsorTypes = await Axios.post(
      ES_STUDIES_API_URL,
      querySponsorTypes,
      HEADERS,
    );
    let sponsorTypes = responseSponsorTypes.data.aggregations.by_sponsor_type.buckets.map(
      (item) => item.key,
    );
    sponsorTypes = sponsorTypes.map((st) => ({
      value: st,
      label: intl.formatMessage({ id: `app.sponsor.${st}` }),
    }));

    const queries = [];
    const query1 = getFetchOptions(
      'studiesResultsPublicationsOa',
      '',
      location,
      studyType,
      sponsorType,
    );
    queries.push(Axios.post(ES_STUDIES_API_URL, query1, HEADERS));
    const res = await Axios.all(queries);
    const currentYear = new Date().getFullYear();
    const data1SortedByYear = res[0].data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2010 && y.key <= currentYear);
    const categories = [];
    const dataOa = [];
    const dataClosed = [];
    const dataNA = [];
    data1SortedByYear.forEach((el) => {
      categories.push(el.key);
      const withPublications = el.by_has_publications.buckets.find(
        (b) => b.key === 1,
      );
      const withPublicationsOA = withPublications?.by_oa.buckets.find(
        (b) => b.key === 1,
      );
      const withPublicationsClosed = withPublications?.by_oa.buckets.find(
        (b) => b.key === 0,
      );
      dataOa.push({
        y_tot: withPublications?.doc_count || 0,
        y_abs: withPublicationsOA?.doc_count || 0,
        y:
          100 * (withPublicationsOA?.doc_count / withPublications?.doc_count)
          || 0,
        year: el.key,
      });
      dataClosed.push({
        y_tot: withPublications?.doc_count || 0,
        y_abs: withPublicationsClosed?.doc_count || 0,
        y:
          100
            * (withPublicationsClosed?.doc_count / withPublications?.doc_count)
          || 0,
        year: el.key,
      });
      dataNA.push({
        y_tot: withPublications?.doc_count || 0,
        y_abs:
          (withPublications?.doc_count || 0)
          - (withPublicationsClosed?.doc_count || 0)
          - (withPublicationsOA?.doc_count || 0),
        y:
          (100
            * ((withPublications?.doc_count || 0)
              - (withPublicationsClosed?.doc_count || 0)
              - (withPublicationsOA?.doc_count || 0)))
          / withPublications?.doc_count,
        year: el.key,
      });
    });
    const series = [
      {
        name: intl.formatMessage({ id: 'app.type-hebergement.open' }),
        data: dataOa,
        color: getCSSValue('--acces-ouvert'),
      },
    ];
    const dataGraph1 = { categories, series };
    return { sponsorTypes, dataGraph1 };
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataAxios();
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
  }, [studyType, sponsorType]);

  return { allData, isLoading, isError };
}
export default useGetData;
