import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType, sponsor = '*') {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function getDataAxios() {
    const queries = [];
    const queryDynamiqueOuverture = getFetchOptions(
      'studiesDynamiqueOuverture',
      '',
      studyType,
    );
    queries.push(
      Axios.post(ES_STUDIES_API_URL, queryDynamiqueOuverture, HEADERS),
    );
    const queryDynamiqueOuvertureSponsor = getFetchOptions(
      'studiesDynamiqueOuvertureSponsor',
      '',
      studyType,
      sponsor,
    );
    queries.push(
      Axios.post(ES_STUDIES_API_URL, queryDynamiqueOuvertureSponsor, HEADERS),
    );
    const queryDynamiqueSponsor = getFetchOptions(
      'studiesDynamiqueSponsor',
      '',
      studyType,
      sponsor,
    );
    queries.push(
      Axios.post(ES_STUDIES_API_URL, queryDynamiqueSponsor, HEADERS),
    );
    const res = await Axios.all(queries);
    const currentYear = new Date().getFullYear();
    const data1SortedByYear = res[0].data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2010 && y.key <= currentYear);
    const data2SortedByYear = res[1].data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= 2010 && y.key <= currentYear);
    const categories = [];
    const dataAcademic = [];
    const dataIndus = [];
    const dataGlobal = [];
    const dataSponsor = [];
    data1SortedByYear.forEach((el) => {
      categories.push(el.key);
      const academic = el.by_sponsor_type.buckets.find(
        (ele) => ele.key === 'academique',
      );
      const academicWith = academic?.by_has_result.buckets.find(
        (ele) => ele.key === 1,
      );
      const indus = el.by_sponsor_type.buckets.find(
        (ele) => ele.key === 'industriel',
      );
      const indusWith = indus?.by_has_result.buckets.find(
        (ele) => ele.key === 1,
      );
      const spons = data2SortedByYear.find((y) => y.key === el.key);
      const sponsWith = spons?.by_has_result.buckets.find(
        (ele) => ele.key === 1,
      );
      dataAcademic.push({
        year: el.key,
        y_tot: academic?.doc_count || 0,
        y_abs: academicWith?.doc_count || 0,
        y: 100 * ((academicWith?.doc_count || 0) / academic?.doc_count),
      });
      dataIndus.push({
        year: el.key,
        y_tot: indus?.doc_count || 0,
        y_abs: indusWith?.doc_count || 0,
        y: 100 * ((indusWith?.doc_count || 0) / indus?.doc_count),
      });
      dataGlobal.push({
        year: el.key,
        y_tot: academic?.doc_count + indus?.doc_count || 0,
        y_abs: academicWith?.doc_count + indusWith?.doc_count || 0,
        y:
          100
          * ((academicWith?.doc_count + indusWith?.doc_count)
            / (academic?.doc_count + indus?.doc_count)),
      });
      dataSponsor.push({
        year: el.key,
        y_tot: spons?.doc_count || 0,
        y_abs: sponsWith?.doc_count || 0,
        y: 100 * (sponsWith?.doc_count / spons?.doc_count || 0),
      });
    });
    const series = [
      {
        name: intl.formatMessage({ id: 'app.sponsor.academique' }),
        data: dataAcademic,
        color: getCSSValue('--lead-sponsor-public'),
      },
      {
        name: intl.formatMessage({ id: 'app.sponsor.industriel' }),
        data: dataIndus,
        color: getCSSValue('--lead-sponsor-privee'),
      },
      {
        name: intl.formatMessage({ id: 'app.all-sponsor-types' }),
        data: dataGlobal,
        color: getCSSValue('--blue-soft-100'),
      },
    ];
    if (sponsor !== '*') {
      series.push({
        name: sponsor,
        data: dataSponsor,
        color: getCSSValue('--lead-sponsor-highlight'),
      });
    }
    const dataGraph1 = { categories, series };

    const tab = [];
    const nbHisto = 10;
    const lastYear = currentYear;
    res[2].data.aggregations.by_sponsor.buckets.forEach((currentSponsor) => {
      if (currentSponsor.key !== 'N/A') {
        const bucket = currentSponsor.by_type.buckets[0];
        const obj = {
          name: currentSponsor.key,
          sponsor_type: bucket.key,
          color:
            bucket.key === 'academique'
              ? getCSSValue('--lead-sponsor-public')
              : getCSSValue('--lead-sponsor-privee'),
          data: bucket.by_year.buckets
            .filter((el) => el.key > lastYear - nbHisto && el.key <= lastYear)
            .sort((a, b) => a.key - b.key)
            .map((el) => ({
              name: el.key,
              year: el.key,
              y_tot: el.doc_count,
              y_abs:
                el.by_has_result.buckets.find((ele) => ele.key === 1)
                  ?.doc_count || 0,
              y:
                (100
                  * el.by_has_result.buckets.find((ele) => ele.key === 1)
                    ?.doc_count || 0) / el?.doc_count,
            })),
        };
        tab.push(obj);
      }
    });
    const dataGraph2 = tab.slice(0, 12);
    return { dataGraph1, dataGraph2 };
  }

  useEffect(() => {
    async function getData() {
      try {
        const dataGraph = await getDataAxios();
        setData(dataGraph);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyType, sponsor]);

  return { allData, isLoading };
}
export default useGetData;
