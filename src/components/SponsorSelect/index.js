import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ES_STUDIES_API_URL, HEADERS } from '../../config/config';
import getFetchOptions from '../../utils/chartFetchOptions';
import { capitalize } from '../../utils/helpers';
import useLang from '../../utils/Hooks/useLang';
import SearchableSelect from '../SearchableSelect';

export default function SponsorSelect() {
  const intl = useIntl();
  const { lang } = useLang();
  const [options, setOptions] = useState([]);
  const [sponsor, setSponsor] = useState('*');

  useEffect(() => {
    const getData = async () => {
      const observationSnap =
        process.env.REACT_APP_LAST_OBSERVATION_CLINICAL_TRIALS;
      let lastObservationYear = parseInt(observationSnap.substring(0, 4), 10);
      if (
        !process.env.REACT_APP_LAST_OBSERVATION_CLINICAL_TRIALS.endsWith('Q4')
      ) lastObservationYear -= 1;
      const years10Max = lastObservationYear - 1;
      const years10Min = years10Max - 9;
      const querySponsorsList = getFetchOptions({
        key: 'sponsorsRorList',
        parameters: ['Interventional', years10Min, years10Max],
        objectType: ['clinicalTrials'],
      });
      const results = await Axios.post(
        ES_STUDIES_API_URL,
        querySponsorsList,
        HEADERS,
      );
      const sponsors = results.data.aggregations.by_sponsor.buckets.map(
        (item) => ({
          value: item.key.split('###')[0],
          label: item.key.split('###')[1],
        }),
      );
      sponsors.unshift({
        label: intl.formatMessage({ id: 'app.health-interventional.sponsors-families.espic', defaultMessage: 'ESPIC' }),
        value: 'ESPIC',
      });
      sponsors.unshift({
        label: intl.formatMessage({ id: 'app.health-interventional.sponsors-families.clcc', defaultMessage: 'CLCC' }),
        value: 'CLCC',
      });
      sponsors.unshift({
        label: intl.formatMessage({ id: 'app.health-interventional.sponsors-families.chu', defaultMessage: 'CHU' }),
        value: 'CHU',
      });
      sponsors.unshift({
        label: capitalize(intl.formatMessage({ id: 'app.all-sponsor-types' })),
        value: '*',
      });
      setOptions(sponsors);
    };
    getData();
  }, [intl]);

  return (
    <>
      <SearchableSelect
        label={intl.formatMessage({ id: 'app.sponsor-filter-label' })}
        onChange={(e) => (e.length > 0 ? setSponsor(e) : null)}
        options={options}
        selected={sponsor}
      />
      {(sponsor !== '*') && (
        <>
          <iframe
            height='908'
            id='general.dynamique.chart-evolution'
            src={`../../integration/${lang}/general.dynamique.chart-evolution/health/Interventional?bsoLocalAffiliation=${sponsor}&displayTitle=false&lastObservationYear=latest`}
            title='general.dynamique.chart-evolution'
            width='100%'
          />
          <iframe
            height='716'
            id='general.dynamique.chart-evolution-10-years-within-1-year/health'
            src={`../../integration/${lang}/general.dynamique.chart-evolution-10-years-within-1-year/health/Interventional?bsoLocalAffiliation=${sponsor}&displayTitle=false&lastObservationYear=latest`}
            title='general.dynamique.chart-evolution-10-years-within-1-year/health'
            width='100%'
          />
          <iframe
            height='692'
            id='general.dynamique.chart-evolution-drug/health'
            src={`../../integration/${lang}/general.dynamique.chart-evolution-drug/health/Interventional?bsoLocalAffiliation=${sponsor}&displayTitle=false&lastObservationYear=latest`}
            title='general.dynamique.chart-evolution-drug/health'
            width='100%'
          />
          <iframe
            height='716'
            id='general.dynamique.chart-evolution-10-years-within-1-year-drug/health'
            src={`../../integration/${lang}/general.dynamique.chart-evolution-10-years-within-1-year-drug/health/Interventional?bsoLocalAffiliation=${sponsor}&displayTitle=false&lastObservationYear=latest`}
            title='general.dynamique.chart-evolution-10-years-within-1-year-drug/health'
            width='100%'
          />
        </>
      )}
    </>
  );
}
