import { Icon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

export default function Chip({ label }) {
  return (
    <div className='bso-chip marianne-bold text-center'>
      <Icon name='ri-calendar-line' size='2x' as='div' className='icon p-8'>
        <div>{label}</div>
      </Icon>
    </div>
  );
}

Chip.propTypes = {
  label: PropTypes.string.isRequired,
};
