import {
  Card,
  CardDescription,
  Col,
  Container,
  Icon as DSIcon,
  Row,
} from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Banner from '../../../components/Banner';
import FlashCard from '../../../components/FlashCard';
import Icon from '../../../components/Icon';

function NotesFlash() {
  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-21'
          color1='blue-dark-125'
          color2='yellow-medium-100'
        />
      </Col>
    </Row>
  );

  return (
    <div className='notes-flash page'>
      <Banner
        backgroundColor='yellow-medium-50'
        textColor='blue-dark-125'
        supTitle={<FormattedMessage id='app.header.title' />}
        title={<FormattedMessage id='app.header.nav.a-propos-notes-flash' />}
        icons={renderIcons}
      />
      <Container>
        <section className='content py-48'>
          <Row gutters>
            <Col n='12 lg-8'>
              <h5 className='marianne-bold fs-16-24'>
                <FormattedMessage id='app.notes.flash.last-note-publication' />
              </h5>
              <h4 className='marianne-bold fs-24-32'>
                <FormattedMessage id='app.notes.flash.last-note-title' />
              </h4>
              <p className='fs-16-28'>
                <FormattedMessage id='app.note.flash.edition.2020' />
              </p>
            </Col>
            <Col n='12 sm-6 lg-4'>
              <FlashCard
                intlTitle='app.note.flash.jan-2021'
                url='https://www.enseignementsup-recherche.gouv.fr/cid156502/barometre-francais-de-la-science-ouverte-2020.html'
              />
            </Col>
          </Row>
          <Row gutters>
            <Col>
              <Col n='12 md-6 lg-4'>
                <h4 className='marianne-bold fs-24-32'>
                  <FormattedMessage id='app.notes.flash.last-notes.title' />
                </h4>
              </Col>
              <Col n='12'>
                <Container fluid>
                  <Row gutters>
                    <Col n='12 md-6 lg-4'>
                      <FlashCard
                        intlTitle='app.note.flash.oct-2019'
                        url='https://www.enseignementsup-recherche.gouv.fr/cid146139/barometre-francais-de-la-science-ouverte.html'
                      />
                    </Col>
                    <Col n='12 md-6 lg-4'>
                      <FlashCard
                        intlTitle='app.note.flash.jan-2020'
                        url='https://www.enseignementsup-recherche.gouv.fr/cid148931/barometre-francais-de-la-science-ouverte.html'
                      />
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Col>
            <Col n='12'>
              <Card
                bodyClassName='bg-dark-blue text-white'
                hasArrow={false}
                href='https://github.com/dataesr/bso-ui'
              >
                <CardDescription as='div'>
                  <Container>
                    <Row alignItems='middle'>
                      <Col n='12 md-6'>
                        <div className='w-100 fs-32-40 marianne-bold pb-32 text-white text-center text-left-l'>
                          <FormattedMessage id='app.link.github.code-projet' />
                        </div>
                        <div className='text-center text-left-l fs-20-20 pb-56'>
                          <FormattedMessage id='app.link.github' />
                        </div>
                      </Col>
                      <Col n='12 md-6'>
                        <DSIcon name='ri-github-fill' size='10x'>
                          <div className='w-100 text-center' />
                        </DSIcon>
                      </Col>
                      <Col n='12'>
                        <DSIcon
                          name='ri-link'
                          size='lg'
                          as='span'
                          className='ds-fr--v-middle'
                        >
                          <div className='w-100 text-right' />
                        </DSIcon>
                      </Col>
                    </Row>
                  </Container>
                </CardDescription>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default NotesFlash;
