import './loader.scss';

import { Container, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

export default function LoadingSpinner({ size, spacing }) {
  return (
    <Container>
      <Row alignItems='middle' spacing={spacing} justifyContent='center'>
        <svg
          className='loader'
          style={{ height: size, width: size }}
          viewBox='0 0 120 120'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle className='internal-circle' cx='60' cy='60' r='30' />
          <circle className='external-circle' cx='60' cy='60' r='50' />
        </svg>
      </Row>
    </Container>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.string,
  spacing: PropTypes.string,
};

LoadingSpinner.defaultProps = {
  size: '100px',
  spacing: 'py-15w px-auto',
};
