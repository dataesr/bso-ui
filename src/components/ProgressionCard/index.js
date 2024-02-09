import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { domains } from '../../utils/constants';
import { getObservationLabel, isInProduction } from '../../utils/helpers';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import useGetPublicationRateFrom from '../../utils/Hooks/useGetPublicationRateFrom';
import Icon from '../Icon';
import InfoCard from '../InfoCard';

export default function ProgressionCard({ domain }) {
  const intl = useIntl();
  const { beforeLastObservationSnap, lastObservationSnap, observationSnaps } = useGlobals();
  const [previousObservationSnap, setPreviousObservationSnap] = useState('');
  const [progression, setProgression] = useState({});

  useEffect(() => {
    setPreviousObservationSnap(
      isInProduction()
        ? beforeLastObservationSnap
        : observationSnaps?.[observationSnaps?.length - 1],
    );
  }, [beforeLastObservationSnap, observationSnaps]);

  const updateProgression = (res, year) => {
    const { rate } = res;
    if (
      (Object.keys(progression).indexOf(year) < 0 && rate)
      || (progression[year] !== rate && rate)
    ) {
      setProgression((prev) => ({ ...prev, [year]: rate }));
    }
  };

  useGetPublicationRateFrom(domain, previousObservationSnap).then((res) => {
    if (previousObservationSnap && Object.keys(res).length > 0) {
      updateProgression(res, previousObservationSnap);
    }
  });

  useGetPublicationRateFrom(domain, lastObservationSnap).then((res) => {
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
      let lastOaRate = progression[lastObservationSnap]
        ? progression[lastObservationSnap]
        : null;
      lastOaRate = Math.round(lastOaRate);
      let previousOaRate = progression[previousObservationSnap]
        ? progression[previousObservationSnap]
        : null;
      previousOaRate = Math.round(previousOaRate);
      if (previousOaRate && lastOaRate) {
        const evolution = Math.round(lastOaRate - previousOaRate);
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
          color2='orange-soft-50'
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

ProgressionCard.defaultProps = {
  domain: '',
};

ProgressionCard.propTypes = {
  domain: PropTypes.oneOf(domains),
};
