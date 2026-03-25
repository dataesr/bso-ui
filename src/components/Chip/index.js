/* eslint-disable react/require-default-props */
import { Icon as DSIcon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

import { domains } from '../../utils/constants';
import UpdateDate from '../UpdateDate';

export default function Chip({ domain = '' }) {
  return (
    <div className='bso-chip marianne-bold text-center'>
      <DSIcon name='ri-calendar-line' size='2x' as='div' className='icon p-8'>
        <div>
          <UpdateDate domain={domain} />
        </div>
      </DSIcon>
    </div>
  );
}

Chip.propTypes = {
  domain: PropTypes.oneOf(domains),
};
