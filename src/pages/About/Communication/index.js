import { Col, Container, Link as DSLink, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Banner from '../../../components/Banner';
import FlashCard from '../../../components/FlashCard';
import Icon from '../../../components/Icon';
import useLang from '../../../utils/Hooks/useLang';

function NotesFlash() {
  const { lang } = useLang();

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
    <div className='page communication'>
      <Banner
        backgroundColor='yellow-medium-50'
        textColor='blue-dark-125'
        supTitle={<FormattedMessage id='app.header.title' />}
        title={<FormattedMessage id='app.header.nav.a-propos.communication' />}
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
                <FormattedMessage id='app.note.flash.edition.2024' />
              </p>
            </Col>
            <Col n='12 sm-6 lg-4'>
              <FlashCard
                intlTitle='app.note.flash.jan-2025'
                url='https://www.enseignementsup-recherche.gouv.fr/fr/le-barometre-francais-de-la-science-ouverte-2024-98423'
                urlPdf='https://www.enseignementsup-recherche.gouv.fr/sites/default/files/2025-01/nf-sies-2025-01-36071.pdf'
              />
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 md-4 lg-4'>
              <h4 className='marianne-bold fs-24-32'>
                <FormattedMessage id='app.flyer.presentation' />
              </h4>
              <div>
                <DSLink href='/assets/flyer_bso_2025_fr.pdf' target='_blank'>
                  <FormattedMessage id='app.flyer.presentation.description-fr' />
                </DSLink>
              </div>
              <div>
                <DSLink href='/assets/flyer_bso_2024_en.pdf' target='_blank'>
                  <FormattedMessage id='app.flyer.presentation.description-en' />
                </DSLink>
              </div>
              <img
                src={`/assets/flyer_bso_2025_${lang}.png`}
                alt='flyer bso'
                className='w-100 flex img-fluid w-100 ds-fr--v-middle'
              />
            </Col>
            <Col n='12 md-4 lg-4'>
              <h4 className='marianne-bold fs-24-32'>
                <FormattedMessage id='app.flyer.results' />
              </h4>
              <div>
                <DSLink
                  href='/assets/flyer_resultats_bso_2025_fr.pdf'
                  target='_blank'
                >
                  <FormattedMessage id='app.flyer.results.description-fr' />
                </DSLink>
              </div>
              <div>
                <DSLink
                  href='/assets/flyer_resultats_bso_2024_en.pdf'
                  target='_blank'
                >
                  <FormattedMessage id='app.flyer.results.description-en' />
                </DSLink>
              </div>
              <img
                src={`/assets/flyer_resultats_bso_2025_${lang}.png`}
                alt='flyer resultats bso'
                className='w-100 flex img-fluid w-100 ds-fr--v-middle'
              />
            </Col>
            <Col n='12 md-4 lg-4'>
              <h4 className='marianne-bold fs-24-32'>
                <FormattedMessage id='app.flyer.variations' />
              </h4>
              <div>
                <DSLink
                  href='/assets/flyer_bso_local_variations_2023.pdf'
                  target='_blank'
                >
                  <FormattedMessage id='app.flyer.variations.description-fr' />
                </DSLink>
              </div>
              <img
                src='/assets/flyer_bso_local_variations_2023.png'
                alt='flyer local variation bso'
                className='w-100 flex img-fluid w-100 ds-fr--v-middle'
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
                        intlTitle='app.note.flash.fev-2024'
                        url='https://www.enseignementsup-recherche.gouv.fr/fr/le-barometre-francais-de-la-science-ouverte-2023-94953'
                        urlPdf='https://www.enseignementsup-recherche.gouv.fr/sites/default/files/2024-02/nf-sies-2024-05-31926.pdf'
                      />
                    </Col>
                    <Col n='12 md-6 lg-4'>
                      <FlashCard
                        intlTitle='app.note.flash.mar-2023'
                        url='https://www.enseignementsup-recherche.gouv.fr/fr/barometre-francais-science-ouverte-2022-89981'
                        urlPdf='https://www.enseignementsup-recherche.gouv.fr/sites/default/files/2023-03/nf-sies-2023-03-26906.pdf'
                      />
                    </Col>
                    <Col n='12 md-6 lg-4'>
                      <FlashCard
                        intlTitle='app.note.flash.jan-2022'
                        url='https://enseignementsup-recherche.gouv.fr/fr/barometre-francais-de-la-science-ouverte-2021'
                        urlData='https://www.enseignementsup-recherche.gouv.fr/sites/default/files/2022-01/nf-sies-2022-03-tableaux-et-graphiques-16328.xlsx'
                        urlPdf='https://www.enseignementsup-recherche.gouv.fr/sites/default/files/2022-01/nf-sies-2022-03-16325.pdf'
                      />
                    </Col>
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
