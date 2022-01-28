import { Col, Container, Row } from '@dataesr/react-dsfr';
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
                <FormattedMessage id='app.note.flash.edition.2021' />
              </p>
            </Col>
            <Col n='12 sm-6 lg-4'>
              <FlashCard
                intlTitle='app.note.flash.jan-2022'
                url='https://enseignementsup-recherche.gouv.fr/fr/barometre-francais-de-la-science-ouverte-2021'
                urlData='https://www.enseignementsup-recherche.gouv.fr/sites/default/files/2022-01/nf-sies-2022-03-tableaux-et-graphiques-16328.xlsx'
                urlPdf='https://www.enseignementsup-recherche.gouv.fr/sites/default/files/2022-01/nf-sies-2022-03-16325.pdf'
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
                        intlTitle='app.note.flash.jan-2021'
                        url='https://www.enseignementsup-recherche.gouv.fr/cid156502/barometre-francais-de-la-science-ouverte-2020.html'
                        urlData='https://www.enseignementsup-recherche.gouv.fr/sites/default/files/imported_files/documents/NF2021_01_Barometre_Science_Ouverte_1370577.xlsx'
                        urlPdf='https://www.enseignementsup-recherche.gouv.fr/sites/default/files/imported_files/documents/NF2021_01_Barometre_Science_Ouverte_1370579.pdf'
                      />
                    </Col>
                    <Col n='12 md-6 lg-4'>
                      <FlashCard
                        intlTitle='app.note.flash.jan-2020'
                        url='https://www.enseignementsup-recherche.gouv.fr/cid148931/barometre-francais-de-la-science-ouverte.html'
                        urlData='https://www.enseignementsup-recherche.gouv.fr/sites/default/files/imported_files/documents/NF_Bso_2019_1236202.xlsx'
                        urlPdf='https://www.enseignementsup-recherche.gouv.fr/sites/default/files/imported_files/documents/NF_BarometreSO_1236191.pdf'
                      />
                    </Col>
                    <Col n='12 md-6 lg-4'>
                      <FlashCard
                        intlTitle='app.note.flash.oct-2019'
                        url='https://www.enseignementsup-recherche.gouv.fr/fr/barometre-francais-de-la-science-ouverte-47368'
                        urlData='https://www.enseignementsup-recherche.gouv.fr/sites/default/files/imported_files/documents/NF22_Bso_1194931.xlsx'
                        urlPdf='https://www.enseignementsup-recherche.gouv.fr/sites/default/files/imported_files/documents/BSO_NoteFlash_Oct2019vf_1194933.pdf'
                      />
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default NotesFlash;
