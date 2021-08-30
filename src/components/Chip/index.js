import { Icon as DSIcon } from '@dataesr/react-dsfr';
import React from 'react';

import UpdateDate from '../UpdateDate';

export default function Chip() {
  return (
    <div className='bso-chip marianne-bold text-center'>
      <DSIcon name='ri-calendar-line' size='2x' as='div' className='icon p-8'>
        <div>
          <UpdateDate />
        </div>
      </DSIcon>
    </div>
  );
}
