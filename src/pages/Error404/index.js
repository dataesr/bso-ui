import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { useIntl } from 'react-intl';

function Error404() {
  const intl = useIntl();

  return (
    <div className='error404'>
      <Container>
        <section className='content py-48'>
          <Row gutters>
            <Col n='12 lg-8'>
              {intl.formatMessage({ id: 'app.pages.does-not-exist' })}
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default Error404;
