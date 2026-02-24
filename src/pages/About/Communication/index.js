import { Col, Container, Link as DSLink, Row } from '@dataesr/react-dsfr';
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
        title={<FormattedMessage id='app.header.nav.about.results' />}
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
                <FormattedMessage id='app.note.flash.edition.2025' values={{ br: <br /> }} />
              </p>
            </Col>
            <Col n='12 sm-6 lg-4'>
              <FlashCard
                doi='10.5281/zenodo.18758226'
                intlTitle='app.note.flash-fev-2026'
                // urlPdf=''
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
                        doi='10.5281/zenodo.18660895'
                        intlTitle='app.note.flash.jan-2025'
                        urlData='https://zenodo.org/records/18660896/files/1180_1.xlsx?download=1'
                        urlPdf='https://zenodo.org/records/18660896/files/1180.pdf?download=1'
                      />
                    </Col>
                    <Col n='12 md-6 lg-4'>
                      <FlashCard
                        doi='10.5281/zenodo.18660767'
                        intlTitle='app.note.flash.fev-2024'
                        urlPdf='https://zenodo.org/records/18660768/files/1133.pdf?download=1'
                      />
                    </Col>
                    <Col n='12 md-6 lg-4'>
                      <FlashCard
                        doi='10.5281/zenodo.18660626'
                        intlTitle='app.note.flash.mar-2023'
                        urlPdf='https://zenodo.org/records/18660627/files/1082.pdf?download=1'
                      />
                    </Col>
                    <Col n='12 md-6 lg-4'>
                      <FlashCard
                        doi='10.5281/zenodo.17527254'
                        intlTitle='app.note.flash.jan-2022'
                        urlData='https://zenodo.org/records/18759132/files/nf-sies-2022-03-tableaux-et-graphiques-16328.xlsx?download=1'
                        urlPdf='https://zenodo.org/records/18759132/files/1026.pdf?download=1'
                      />
                    </Col>
                    <Col n='12 md-6 lg-4'>
                      <FlashCard
                        doi='10.5281/zenodo.18660364'
                        intlTitle='app.note.flash.jan-2021'
                        urlData='https://zenodo.org/records/18759166/files/NF2021_01_Barometre_Science_Ouverte_1370577.xlsx?download=1'
                        urlPdf='https://zenodo.org/records/18759166/files/964.pdf?download=1'
                      />
                    </Col>
                    <Col n='12 md-6 lg-4'>
                      <FlashCard
                        doi='10.5281/zenodo.18660141'
                        intlTitle='app.note.flash.jan-2020'
                        urlData='https://zenodo.org/records/18660142/files/NF_Bso_2019_1236202.xlsx?download=1'
                        urlPdf='https://zenodo.org/records/18660142/files/899.pdf?download=1'
                      />
                    </Col>
                    <Col n='12 md-6 lg-4'>
                      <FlashCard
                        doi='10.5281/zenodo.18660100'
                        intlTitle='app.note.flash.oct-2019'
                        urlData='https://zenodo.org/records/18759211/files/NF22_Bso_1194931.xlsx?download=1'
                        urlPdf='https://zenodo.org/records/18759211/files/881.pdf?download=1'
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
