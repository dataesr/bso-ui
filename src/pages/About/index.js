import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Banner from '../../components/Banner';

function About() {
  const intl = useIntl();

  return (
    <div className='about'>
      <Banner
        supTitle={<FormattedMessage id='app.header.title' />}
        title={<FormattedMessage id='app.header.nav.a-propos' />}
      />
      <Container className='mb-100'>
        <section className='content'>
          <Row gutters>
            <Col n='12'>
              <h3>{intl.formatMessage({ id: 'app.about.overview' })}</h3>
              <FormattedMessage
                id='app.about.body'
                values={{
                  p: (chunks) => <p>{chunks}</p>,
                  fosm: () => (
                    <a
                      href='https://frenchopensciencemonitor.esr.gouv.fr/'
                      style={{ marginInline: '0.5em' }}
                      target='_blank'
                      rel='noreferrer'
                    >
                      French Open Science Monitor
                    </a>
                  ),
                  openalex: () => (
                    <a
                      href='https://openalex.org/'
                      style={{ marginInline: '0.5em' }}
                      target='_blank'
                      rel='noreferrer'
                    >
                      OpenAlex
                    </a>
                  ),
                }}
              />
            </Col>
          </Row>
          <Row gutters>
            <Col n='12'>
              <h3>{intl.formatMessage({ id: 'app.about.reference' })}</h3>
              <a href='https://frenchopensciencemonitor.esr.gouv.fr/'>
                French Open Science Monitor
              </a>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default About;
