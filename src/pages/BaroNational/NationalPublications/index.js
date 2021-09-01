import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Banner from '../../../components/Banner';
import Chip from '../../../components/Chip';
import DataCardSection from '../../../components/DataCardsSection';
import Glossary from '../../../components/Glossary';
import GlossaryFormattedMessage from '../../../components/Glossary/GlossaryFormattedMessage';
import Icon from '../../../components/Icon';
import ScrollTop from '../../../components/ScrollTop';
import urls from '../../../config/urls';
import GlossaryEntries from '../../../translations/glossary.json';
import useLang from '../../../utils/Hooks/useLang';

export default function NationalPublications() {
  const { lang } = useLang();

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-28'
          color1='blue-soft-125'
          color2='publication-25'
        />
      </Col>
    </Row>
  );

  return (
    <Container fluid className='page'>
      <Banner
        backgroundColor='blue-dark-100'
        homeLink={urls.sante[lang]}
        supTitle={<FormattedMessage id='app.header.title-national' />}
        title={<FormattedMessage id='app.baro-national.title' />}
        chip={<Chip />}
        icons={renderIcons}
      />
      <ScrollTop />
      <section className='content'>
        <Row>
          <Container>
            <Row>
              <Col n='12'>
                <h1 className='contentTitle marianne-bold mb-32'>
                  <FormattedMessage id='app.baro-national.main-title' />
                </h1>
                <p>
                  <GlossaryFormattedMessage
                    intlKey='app.baro-national.intro'
                    glossaryKey='acces-ouvert'
                  />
                </p>
              </Col>
            </Row>
          </Container>
          <Glossary entries={GlossaryEntries} />
          <Container>
            <DataCardSection lang={lang} />
          </Container>
        </Row>
      </section>
    </Container>
  );
}
