/* eslint-disable react/require-default-props */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { domains } from '../../utils/constants';
import { getObservationLabel } from '../../utils/helpers';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import useGetPublicationRateFrom from '../../utils/Hooks/useGetPublicationRateFrom';
import useGetStudiesRateFrom from '../../utils/Hooks/useGetStudiesRateFrom';
import Icon from '../Icon';
import InfoCard from '../InfoCard';

export default function ProgressionCard({ domain = '' }) {
  const intl = useIntl();
  const { lastObservationSnap, observationSnaps } = useGlobals();
  const [previousObservationSnap, setPreviousObservationSnap] = useState('');
  const [progression, setProgression] = useState({});

  const observationSnapsHealth = ['2025Q4', '2024Q4', '2023Q4', '2022Q4'];
  const obs = domain === '' ? observationSnaps : observationSnapsHealth;

  useEffect(() => {
    setPreviousObservationSnap(obs?.[obs?.length - 1]);
  }, [obs]);

  const updateProgression = (res, year) => {
    const { rate } = res;
    if (
      (Object.keys(progression).indexOf(year) < 0 && rate)
      || (progression[year] !== rate && rate)
    ) {
      setProgression((prev) => ({ ...prev, [year]: rate }));
    }
  };

  const fn = domain === '' ? useGetPublicationRateFrom : useGetStudiesRateFrom;

  fn(domain, previousObservationSnap).then((res) => {
    if (previousObservationSnap && Object.keys(res).length > 0) {
      updateProgression(res, previousObservationSnap);
    }
  });
  fn(domain, lastObservationSnap).then((res) => {
    if (lastObservationSnap) {
      updateProgression(res, lastObservationSnap);
    }
  });

  const progressionPoints = () => {
    let progPoints = '';
    if (lastObservationSnap && previousObservationSnap) {
      const rhesus = progression[lastObservationSnap] >= progression[previousObservationSnap]
        ? '+'
        : '';
      const lastOaRate = progression?.[lastObservationSnap];
      const previousOaRate = progression?.[previousObservationSnap];
      if (previousOaRate && lastOaRate) {
        const evolution = (
          lastOaRate.toFixed(1) - previousOaRate.toFixed(1)
        ).toFixed(1);
        progPoints = `${rhesus}${evolution}`;
      }
    }
    return progPoints;
  };

  return (
    <InfoCard
      icon={(
        <Icon
          name='icon-bsso-33'
          color1='blue-dark-125'
          color2={domain === '' ? 'orange-soft-50' : 'patient-50'}
        />
      )}
      data1={progressionPoints()}
      data2={
        progressionPoints() > 1
          ? ` ${intl.formatMessage({ id: 'app.commons.points' })}`
          : ` ${intl.formatMessage({ id: 'app.commons.point' })}`
      }
      title={(
        <FormattedMessage
          values={{
            startYear: getObservationLabel(previousObservationSnap, intl),
            endYear: getObservationLabel(lastObservationSnap, intl),
            div: (chunks) => <div>{chunks}</div>,
          }}
          id={
            domain === ''
              ? 'app.national-publi.progression'
              : 'app.health-publi.progression'
          }
          defaultMessage='Progression'
        />
      )}
    />
  );
}

ProgressionCard.propTypes = {
  domain: PropTypes.oneOf(domains),
};
