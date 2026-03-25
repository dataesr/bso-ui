/* eslint-disable react/require-default-props */
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { domains } from '../../utils/constants';
import {
  getFormattedDate,
  getPublicationYearFromObservationSnap,
} from '../../utils/helpers';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import useLang from '../../utils/Hooks/useLang';

export default function UpdateDate({ domain = '' }) {
  const { lastObservationSnap, updateDate, updateDateClinicalTrials } = useGlobals();
  const { lang } = useLang();

  return (
    domain === 'health' ? (
      <FormattedMessage
        values={{
          date: getFormattedDate(updateDateClinicalTrials, lang),
        }}
        id='app.health.update.date'
        defaultMessage='Doonées mises à jour pour les essais cliniques'
      />
    ) : (
      <FormattedMessage
        values={{
          date: getFormattedDate(updateDate, lang),
          endDate:
            lastObservationSnap.length > 4
              ? getPublicationYearFromObservationSnap(
                lastObservationSnap.substring(0, 4),
              )
              : getPublicationYearFromObservationSnap(lastObservationSnap),
          startDate: '2013',
        }}
        id='app.publis.update.date'
        defaultMessage='Données mises à jour pour les publications'
      />
    )
  );
}

UpdateDate.propTypes = {
  domain: PropTypes.oneOf(domains),
};
