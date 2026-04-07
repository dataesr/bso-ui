import { Container } from '@dataesr/react-dsfr';

import BSOChart from '../../components/Charts';

function Publishing() {
  return (
    <Container fluid className='page'>
      <section className='content'>
        <Container>
          <BSOChart id='publishing.journals.presence' />
        </Container>
      </section>
    </Container>
  );
}

export default Publishing;
