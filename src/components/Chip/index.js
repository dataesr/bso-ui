import { Icon as DSIcon } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { getFormattedDate } from '../../utils/helpers';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import useLang from '../../utils/Hooks/useLang';

export default function Chip() {
  const { lang } = useLang();
  const today = new Date();
  const { updateDate, lastObservationSnap } = useGlobals();

  return (
    <div className='bso-chip marianne-bold text-center'>
      <DSIcon name='ri-calendar-line' size='2x' as='div' className='icon p-8'>
        <div>
          <FormattedMessage
            values={{
              date: getFormattedDate(updateDate, lang),
              endDate:
                lastObservationSnap.slice(0, 4) - 1 || today.getFullYear(),
              startDate: 2013,
            }}
            id='app.sante.update.date'
            defaultMessage=''
          />
        </div>
      </DSIcon>
    </div>
  );
}
