import { Icon } from '@dataesr/react-dsfr';

export default function Chip({ title }) {
  return (
    <div className='chip marianne-bold text-center'>
      <Icon name='ri-calendar-line' size='2x' as='div' className='icon p-8'>
        <div>{title}</div>
      </Icon>
    </div>
  );
}
