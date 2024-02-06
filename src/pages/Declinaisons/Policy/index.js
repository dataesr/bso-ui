import { Col, Container, Row } from '@dataesr/react-dsfr';
import { FormattedMessage } from 'react-intl';

const Policy = () => (
  <div className='policy no-arrow-link'>
    <Container>
      <section className='color-blue-dark-125 content py-48'>
        <Row gutters>
          <Col n='12'>
            <h2>
              <FormattedMessage id='app.header.nav.declinaisons.policy' />
            </h2>
          </Col>
        </Row>
      </section>
    </Container>
  </div>
);

export default Policy;
