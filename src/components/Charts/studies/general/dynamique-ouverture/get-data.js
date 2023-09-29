import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../../../../config/config';
import getFetchOptions from '../../../../../utils/chartFetchOptions';
import { capitalize, getCSSValue } from '../../../../../utils/helpers';

function useGetData(studyType, sponsor = '*') {
  const intl = useIntl();
  const [allData, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  async function getDataAxios() {
    const queries = [];
    const currentYear = parseInt(
      process.env.REACT_APP_LAST_OBSERVATION.substr(0, 4),
      10,
    );
    const yearMin = currentYear - 11;
    const yearMax = currentYear - 1;
    const query1 = getFetchOptions({
      key: 'studiesDynamiqueOuverture',
      parameters: [studyType, yearMin, yearMax],
      objectType: ['clinicalTrials'],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, query1, HEADERS));
    const query2 = getFetchOptions({
      key: 'studiesDynamiqueOuvertureSponsor',
      parameters: [studyType, sponsor, yearMin, yearMax],
      objectType: ['clinicalTrials'],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, query2, HEADERS));
    const query3 = getFetchOptions({
      key: 'studiesDynamiqueSponsor',
      parameters: [studyType, yearMin, yearMax],
      objectType: ['clinicalTrials'],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, query3, HEADERS));
    const query4 = getFetchOptions({
      key: 'studiesDynamiqueOuvertureWithin2Years',
      parameters: [studyType, yearMin, yearMax],
      objectType: ['clinicalTrials'],
    });
    queries.push(Axios.post(ES_STUDIES_API_URL, query4, HEADERS));
    const res = await Axios.all(queries);
    const data1 = res[0].data.aggregations;
    const data2 = res[1].data.aggregations;
    const data4 = res[3].data.aggregations;
    const series1 = [
      { name: intl.formatMessage({ id: 'app.sponsor-type' }), data: [] },
    ];
    const series2 = [
      { name: intl.formatMessage({ id: 'app.sponsor-type' }), data: [] },
    ];
    const academic1 = data1.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'academique',
    );
    const academicWith = academic1?.by_has_result.buckets.find(
      (ele) => ele.key === 1,
    );
    const academic2 = data4.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'academique',
    );
    const academicWith2 = academic2?.by_has_results_within_2y.buckets.find(
      (ele) => ele.key === 1,
    );
    const indus = data1.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'industriel',
    );
    const indusWith = indus?.by_has_result.buckets.find((el) => el.key === 1);
    const indus2 = data4.by_sponsor_type.buckets.find(
      (ele) => ele.key === 'industriel',
    );
    const indusWith2 = indus2?.by_has_results_within_2y.buckets.find(
      (el) => el.key === 1,
    );
    const spons = data2;
    const sponsWith = spons?.by_has_result.buckets.find((el) => el.key === 1);
    const categories = [
      capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
      capitalize(intl.formatMessage({ id: 'app.sponsor.industriel' })),
      capitalize(intl.formatMessage({ id: 'app.sponsor.academique' })),
    ];
    series1[0].data.push({
      name: intl.formatMessage({ id: 'app.all-sponsor-types' }),
      yearMin,
      yearMax,
      color: getCSSValue('--blue-soft-100'),
      y_tot: academic1?.doc_count + indus?.doc_count || 0,
      y_abs: academicWith?.doc_count + indusWith?.doc_count || 0,
      y:
        100
        * ((academicWith?.doc_count + indusWith?.doc_count)
          / (academic1?.doc_count + indus?.doc_count)),
    });
    series1[0].data.push({
      name: intl.formatMessage({ id: 'app.sponsor.academique' }),
      yearMin,
      yearMax,
      y_tot: academic1?.doc_count || 0,
      y_abs: academicWith?.doc_count || 0,
      y: 100 * ((academicWith?.doc_count || 0) / academic1?.doc_count),
      color: getCSSValue('--lead-sponsor-public'),
    });
    series1[0].data.push({
      name: intl.formatMessage({ id: 'app.sponsor.industriel' }),
      yearMin,
      yearMax,
      y_tot: indus?.doc_count || 0,
      y_abs: indusWith?.doc_count || 0,
      y: 100 * ((indusWith?.doc_count || 0) / indus?.doc_count),
      color: getCSSValue('--lead-sponsor-privee'),
    });
    series2[0].data.push({
      name: intl.formatMessage({ id: 'app.all-sponsor-types' }),
      yearMin,
      yearMax,
      color: getCSSValue('--blue-soft-100'),
      y_tot: academic2?.doc_count + indus2?.doc_count ?? 0,
      y_abs: academicWith2?.doc_count + indusWith2?.doc_count ?? 0,
      y:
        100
        * ((academicWith2?.doc_count + indusWith2?.doc_count)
          / (academic2?.doc_count + indus2?.doc_count)),
    });
    series2[0].data.push({
      name: intl.formatMessage({ id: 'app.sponsor.academique' }),
      yearMin,
      yearMax,
      y_tot: academic2?.doc_count ?? 0,
      y_abs: academicWith2?.doc_count ?? 0,
      y: 100 * ((academicWith2?.doc_count ?? 0) / academic2?.doc_count),
      color: getCSSValue('--lead-sponsor-public'),
    });
    series2[0].data.push({
      name: intl.formatMessage({ id: 'app.sponsor.industriel' }),
      yearMin,
      yearMax,
      y_tot: indus2?.doc_count ?? 0,
      y_abs: indusWith2?.doc_count ?? 0,
      y: 100 * ((indusWith2?.doc_count ?? 0) / indus2?.doc_count),
      color: getCSSValue('--lead-sponsor-privee'),
    });
    if (sponsor !== '*') {
      series1[0].data.push({
        yearMin,
        yearMax,
        color: getCSSValue('--lead-sponsor-highlight'),
        name: sponsor,
        y_tot: spons?.doc_count || 0,
        y_abs: sponsWith?.doc_count || 0,
        y: 100 * (sponsWith?.doc_count / spons?.doc_count || 0),
      });
      series2[0].data.push({
        yearMin,
        yearMax,
        color: getCSSValue('--lead-sponsor-highlight'),
        name: sponsor,
        y_tot: spons?.doc_count || 0,
        y_abs: sponsWith?.doc_count || 0,
        y: 100 * (sponsWith?.doc_count / spons?.doc_count || 0),
      });
      categories.push(sponsor);
    }
    const dataGraph1 = { categories, series: series1 };
    const dataGraph2 = { categories, series: series2 };

    let allLeadSponsorRate = '';
    let privateLeadSponsorsRate = '';
    let publicLeadSponsorsRate = '';
    if (dataGraph1) {
      const data = dataGraph1?.series[0]?.data;
      const allLeadSponsorLabel = intl.formatMessage({
        id: 'app.all-sponsor-types',
      });
      const privateLeadSponsorsLabel = intl.formatMessage({
        id: 'app.sponsor.industriel',
      });
      const publicLeadSponsorsLabel = intl.formatMessage({
        id: 'app.sponsor.academique',
      });
      allLeadSponsorRate = data
        ?.find((item) => item.name === allLeadSponsorLabel)
        ?.y?.toFixed(0);
      privateLeadSponsorsRate = data
        ?.find((item) => item.name === privateLeadSponsorsLabel)
        ?.y?.toFixed(0);
      publicLeadSponsorsRate = data
        ?.find((item) => item.name === publicLeadSponsorsLabel)
        ?.y?.toFixed(0);
    }

    const comments = {
      allLeadSponsorRate,
      privateLeadSponsorsRate,
      publicLeadSponsorsRate,
    };

    return {
      comments,
      dataGraph1,
      dataGraph2,
    };
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
  }, [studyType, sponsor]);

  return { allData, isLoading, isError };
}
export default useGetData;
