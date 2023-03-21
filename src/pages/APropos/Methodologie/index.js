import { Col, Container, Row } from '@dataesr/react-dsfr';
import { FormattedMessage } from 'react-intl';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';

function Methodologie() {
  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-22'
          color1='blue-soft-125'
          color2='blue-soft-75'
        />
      </Col>
    </Row>
  );
  return (
    <div className='methodologie'>
      <Banner
        backgroundColor='blue-soft-50'
        textColor='blue-dark-150'
        supTitle={<FormattedMessage id='app.header.title' />}
        title={<FormattedMessage id='app.header.nav.a-propos-methodologie' />}
        icons={renderIcons}
      />
      <Container>
        <section className='content py-48'>
          <Row gutters>
            <Col n='12 lg-8'>
              <FormattedMessage id='app.methodo-bso3-intro' />
              <br />
              {' '}
              <a
                href='https://github.com/Barometre-de-la-Science-Ouverte/bso3-techdoc/blob/master/methodology/bso3.pdf'
                target='_blank'
                rel='noreferrer'
                className='external_link'
              >
                Monitoring the production and the openness of research data and
                software in France: Large-scale Machine-Learning analysis of
                scientific PDF
              </a>
              {' '}
              <br />
              <br />
              <hr />
              <br />
              <a
                href='/assets/dmp.pdf'
                target='_blank'
                rel='noreferrer'
                className='external_link'
              >
                <FormattedMessage id='app.methodo-bso3-dmp' />
              </a>
              <br />
              <br />
              <hr />
              <br />
              <FormattedMessage id='app.methodo-publi-intro' />
              <br />
              {' '}
              <a
                href='https://hal.archives-ouvertes.fr/hal-03651518'
                target='_blank'
                rel='noreferrer'
                className='external_link'
              >
                Extending the open monitoring of open science: A new framework
                for the French Open Science Monitor (BSO)
              </a>
              {' '}
              <br />
              <br />
              <hr />
              <br />
              <FormattedMessage id='app.methodo-contact' />
              {' '}
              <a href='mailto:bso@recherche.gouv.fr'>bso@recherche.gouv.fr</a>
              .
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default Methodologie;
