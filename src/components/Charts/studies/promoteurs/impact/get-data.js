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
  const [isError, setError] = useState(false);

  async function getDataAxios() {
    const querySponsorTypes = getFetchOptions({
      key: 'sponsorsTypesList',
      parameters: [studyType],
      objectType: ['clinicalTrials'],
    });
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
    const query1 = getFetchOptions({
      key: 'studiesPromoteursImpactPaysLeadSponsor',
      parameters: [studyType, sponsorType],
      objectType: ['clinicalTrials'],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, query1, HEADERS));
    const query2 = getFetchOptions({
      key: 'studiesPromoteursImpactPays',
      parameters: [studyType, sponsorType],
      objectType: ['clinicalTrials'],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, query2, HEADERS));
    const res = await Axios.all(queries);
    const currentYear = parseInt(
      process.env.REACT_APP_LAST_OBSERVATION.substr(0, 4),
      10,
    );
    const data1SortedByYear = res[0].data.aggregations.by_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter((y) => y.key >= currentYear - 10 && y.key <= currentYear);
    const categories = [];
    const dataFrenchAcademic = [];
    const dataFrenchIndus = [];
    const dataNotFrenchAcademic = [];
    const dataNotFrenchIndus = [];
    data1SortedByYear.forEach((el) => {
      categories.push(el.key);
      const frOnly = el.by_fr_only.buckets.find((ele) => ele.key === 1);
      const frAcademic = frOnly?.by_sponsor_type.buckets.find(
        (ele) => ele.key === 'academique',
      );
      const frAcademicOpen = frAcademic?.by_has_result_or_publi.buckets.find(
        (ele) => ele.key === 1,
      );
      const frIndus = frOnly?.by_sponsor_type.buckets.find(
        (ele) => ele.key === 'industriel',
      );
      const frIndusOpen = frIndus?.by_has_result_or_publi.buckets.find(
        (ele) => ele.key === 1,
      );

      const notfrOnly = el.by_fr_only.buckets.find((ele) => ele.key === 0);
      const notfrAcademic = notfrOnly?.by_sponsor_type.buckets.find(
        (ele) => ele.key === 'academique',
      );
      const notfrAcademicOpen = notfrAcademic?.by_has_result_or_publi.buckets.find(
        (ele) => ele.key === 1,
      );
      const notfrIndus = notfrOnly?.by_sponsor_type.buckets.find(
        (ele) => ele.key === 'industriel',
      );
      const notfrIndusOpen = notfrIndus?.by_has_result_or_publi.buckets.find(
        (ele) => ele.key === 1,
      );

      dataFrenchAcademic.push({
        year: el.key,
        y_tot: frOnly?.doc_count || 0,
        y_abs: frAcademicOpen?.doc_count || 0,
        y: (100 * frAcademicOpen?.doc_count || 0) / frOnly?.doc_count,
      });
      dataFrenchIndus.push({
        year: el.key,
        y_tot: frOnly?.doc_count || 0,
        y_abs: frIndusOpen?.doc_count || 0,
        y: (100 * frIndusOpen?.doc_count || 0) / frOnly?.doc_count,
      });
      dataNotFrenchAcademic.push({
        year: el.key,
        y_tot: notfrOnly?.doc_count || 0,
        y_abs: notfrAcademicOpen?.doc_count || 0,
        y: (100 * notfrAcademicOpen?.doc_count || 0) / notfrOnly?.doc_count,
      });
      dataNotFrenchIndus.push({
        year: el.key,
        y_tot: notfrOnly?.doc_count || 0,
        y_abs: notfrIndusOpen?.doc_count || 0,
        y: (100 * notfrIndusOpen?.doc_count || 0) / notfrOnly?.doc_count,
      });
    });
    const series = [
      {
        name: intl.formatMessage({ id: 'app.studies.french-industriel' }),
        data: dataFrenchIndus,
        color: getCSSValue('--blue-dark-125'),
        stack: 'fr',
      },
      {
        name: intl.formatMessage({ id: 'app.studies.french-academique' }),
        data: dataFrenchAcademic,
        color: getCSSValue('--blue-soft-100'),
        stack: 'fr',
      },
      {
        name: intl.formatMessage({ id: 'app.studies.notfrench-industriel' }),
        data: dataNotFrenchIndus,
        color: getCSSValue('--green-warm-175'),
        stack: 'international',
      },
      {
        name: intl.formatMessage({ id: 'app.studies.notfrench-academique' }),
        data: dataNotFrenchAcademic,
        color: getCSSValue('--green-warm-100'),
        stack: 'international',
      },
    ];
    const dataGraph1 = { categories, series };
    const data2 = res[1].data.aggregations.by_country.buckets;
    data2.sort(
      (a, b) => b.by_has_result_or_publi.buckets.find((ele) => ele.key === 1)
        ?.doc_count
          / b.doc_count
        - a.by_has_result_or_publi.buckets.find((ele) => ele.key === 1)
          ?.doc_count
          / a.doc_count,
    );
    const dataGraph2 = {
      categories: data2.map((el) => intl.formatMessage({ id: `app.country.${el.key}` })),
      series: [
        {
          name: 'taux-ouverture',
          showInLegend: false,
          data: data2.map((el) => ({
            y_abs:
              el.by_has_result_or_publi.buckets.find((ele) => ele.key === 1)
                ?.doc_count || 0,
            y:
              (100
                * el.by_has_result_or_publi.buckets.find((ele) => ele.key === 1)
                  ?.doc_count || 0) / el.doc_count,
            y_tot: el.doc_count,
            country: intl.formatMessage({ id: `app.country.${el.key}` }),
          })),
          color: getCSSValue('--acces-ouvert'),
        },
      ],
    };
    return { sponsorTypes, dataGraph1, dataGraph2 };
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
