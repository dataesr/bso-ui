import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  getFormattedDate,
  getPublicationYearFromObservationSnap,
} from '../../utils/helpers';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import useLang from '../../utils/Hooks/useLang';

export default function UpdateDate() {
  const { lastObservationSnap } = useGlobals();
  const { updateDate } = useGlobals();
  const { lang } = useLang();

  return (
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
      id='app.sante.update.date'
      defaultMessage=''
    />
  );
}
