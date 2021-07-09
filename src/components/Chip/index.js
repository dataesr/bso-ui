import { Icon as DSIcon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

export default function Chip({ label }) {
  return (
    <div className='bso-chip marianne-bold text-center'>
      <DSIcon name='ri-calendar-line' size='2x' as='div' className='icon p-8'>
        <div>{label}</div>
      </DSIcon>
    </div>
  );
}

Chip.propTypes = {
  label: PropTypes.string.isRequired,
};
