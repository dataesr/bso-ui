import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

function WorksMagnet() {
  return (
    <div>
      <Container>
        <section className='content py-48'>
          <Row gutters>
            <Col n='12 lg-10' className='p-0'>
              <h2 id='worksmagnet'>
                <FormattedMessage id='app.worksmagnet.title' />
              </h2>
              <p>
                <FormattedMessage id='app.worksmagnet.paragraph1' />
              </p>
              <div className='bg-yellow-medium-100 border-black border-radius-8 fs-14-19 marianne-bold mb-20 ml-40 p-8 w-60'>
                <a
                  href='https://works-magnet.esr.gouv.fr/'
                  target='_blank'
                  rel='noreferrer'
                >
                  works-magnet.esr.gouv.fr
                </a>
              </div>
              <p>
                <FormattedMessage id='app.worksmagnet.paragraph2' />
              </p>
              <p>
                <FormattedMessage id='app.worksmagnet.paragraph3' />
              </p>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default WorksMagnet;
