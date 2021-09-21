/* eslint-disable no-console */
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType, sponsorType = '*') {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function getDataAxios() {
    const queries = [];
    const query1 = getFetchOptions('studiesResultsPublicationsOa', '', studyType, sponsorType);
    queries.push(Axios.post(ES_STUDIES_API_URL, query1, HEADERS));
    const res = await Axios.all(queries).catch(() => {
      setLoading(false);
    });
    const currentYear = new Date().getFullYear();
    const data1SortedByYear = res[0].data.aggregations.by_year.buckets.sort(
      (a, b) => a.key - b.key,
    ).filter((y) => y.key >= 2010 && y.key <= currentYear);
    const categories = [];
    const dataOa = [];
    const dataClosed = [];
    const dataNA = [];
    data1SortedByYear.forEach((el) => {
      categories.push(el.key);
      const withPublications = el.by_has_publications.buckets.find((b) => b.key === 1);
      const withPublicationsOA = withPublications?.by_oa.buckets.find((b) => b.key === 1);
      const withPublicationsClosed = withPublications?.by_oa.buckets.find((b) => b.key === 0);
      dataOa.push({
        y_tot: withPublications?.doc_count || 0,
        y_abs: withPublicationsOA?.doc_count || 0,
        y: 100 * (withPublicationsOA?.doc_count / withPublications?.doc_count) || 0,
        year: el.key,
      });
      dataClosed.push({
        y_tot: withPublications?.doc_count || 0,
        y_abs: withPublicationsClosed?.doc_count || 0,
        y: 100 * (withPublicationsClosed?.doc_count / withPublications?.doc_count) || 0,
        year: el.key,
      });
      dataNA.push({
        y_tot: withPublications?.doc_count || 0,
        y_abs: (withPublications?.doc_count || 0) - (withPublicationsClosed?.doc_count || 0) - (withPublicationsOA?.doc_count || 0),
        y: (100 * ((withPublications?.doc_count || 0) - (withPublicationsClosed?.doc_count || 0) - (withPublicationsOA?.doc_count || 0)))
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
      {
        name: intl.formatMessage({ id: 'app.type-hebergement.closed' }),
        data: dataClosed,
        color: getCSSValue('--blue-soft-175'),
      },
      {
        name: intl.formatMessage({ id: 'app.na' }),
        data: dataNA,
        color: getCSSValue('--g-400'),
      },
    ];
    const dataGraph1 = { categories, series };
    return { dataGraph1 };
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataAxios();
        setData(dataGraph);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyType, sponsorType]);

  return { allData, isLoading };
}
export default useGetData;
