import { Icon as DSIcon } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { getDateFormated } from '../../utils/helpers';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import useLang from '../../utils/Hooks/useLang';

export default function Chip() {
  const { lang } = useLang();
  const today = new Date();
  const { updateDate, observationDates } = useGlobals();

  return (
    <div className='bso-chip marianne-bold text-center'>
      <DSIcon name='ri-calendar-line' size='2x' as='div' className='icon p-8'>
        <div>
          <FormattedMessage
            values={{
              date: getDateFormated(updateDate, lang),
              endDate: '2021',
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
