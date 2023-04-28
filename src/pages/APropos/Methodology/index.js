import './style.scss';

import { Col, Container, Row } from '@dataesr/react-dsfr';
import { FormattedMessage, useIntl } from 'react-intl';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';
import { isInProduction } from '../../../utils/helpers';

function Methodology() {
  const intl = useIntl();

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters className='mb-32'>
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
    <>
      {!isInProduction() && (
        <div className='color-blue-soft-175 methodology'>
          <Banner
            backgroundColor='blue-soft-50'
            textColor='blue-dark-150'
            supTitle={<FormattedMessage id='app.header.title' />}
            title={
              <FormattedMessage id='app.header.nav.a-propos-methodologie' />
            }
            icons={renderIcons}
            selectNavigation={{
              title: intl.formatMessage({ id: 'app.navigation.methodologies' }),
              selected: intl.formatMessage({
                id: 'url.about.methodology#publications',
              }),
              options: [
                {
                  label: intl.formatMessage({
                    id: 'app.baro-national.publications.title',
                  }),
                  value: intl.formatMessage({
                    id: 'url.about.methodology#publications',
                  }),
                },
                {
                  label: intl.formatMessage({
                    id: 'app.baro-national.data-and-software.title',
                  }),
                  value: intl.formatMessage({
                    id: 'url.about.methodology#data-and-software',
                  }),
                },
              ],
            }}
          />
          <Container>
            <section className='content py-48'>
              <Row>
                <Col>
                  <h2 className='fs-28-32 fs-40-48-xl mt-40 mb-32'>
                    Publication :
                    <br />
                    une méthodologie inédite
                  </h2>
                </Col>
              </Row>
              <Row gutters className='bg-blue-soft-25'>
                <Col className='ml-68 mt-50'>
                  <Row>
                    <Col n='8'>
                      <Row>
                        <div>
                          <Icon
                            name='icon-bsso-3'
                            color1='blue-soft-125'
                            color2='yellow-medium-50'
                            height='32px'
                            width='50px'
                          />
                        </div>
                        <div>
                          <Icon
                            name='icon-bsso-4'
                            color1='blue-soft-125'
                            color2='orange-medium-75'
                            height='32px'
                            width='50px'
                          />
                        </div>
                        <div>
                          <Icon
                            name='icon-bsso-1'
                            color1='blue-soft-125'
                            color2='green-soft-50'
                            height='32px'
                            width='50px'
                          />
                        </div>
                        <div>
                          <Icon
                            name='icon-bsso-5'
                            color1='blue-soft-125'
                            color2='blue-soft-50'
                            height='32px'
                            width='50px'
                          />
                        </div>
                        <div>
                          <Icon
                            name='icon-bsso-2'
                            color1='blue-soft-125'
                            color2='pink-light-75'
                            height='32px'
                            width='50px'
                          />
                        </div>
                        <div>
                          <Icon
                            name='icon-bsso-6'
                            color1='blue-soft-125'
                            color2='green-medium-50'
                            height='32px'
                            width='50px'
                          />
                        </div>
                        <div className='fs-16-32 ml-10'>
                          Le Baromètre français de la Science Ouverte
                        </div>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <h3 className='mt-12 mb-32'>
                      Publication : une méthologie inédite
                    </h3>
                  </Row>
                  <Row>
                    <div className='mb-24 text-center w-100'>
                      <span className='bg-white border-radius-30 fs-28-32 marianne-bold px-28 py-4'>
                        Notre constat
                      </span>
                    </div>
                  </Row>
                  <Row gutters className='mb-60'>
                    <Col n='12 md-5' offset='1' className='border'>
                      <div className='fs-20-24 marianne-bold text-center '>
                        Les bases bibliographiques
                        <div className='mx-5'>
                          <span className='border-radius-30 bg-white px-6'>
                            ouvertes
                          </span>
                        </div>
                      </div>
                      <div className='text-center'>
                        proposent peu de métadonnées
                      </div>
                      <div className='text-center'>
                        d'affiliation et de qualité disparate
                      </div>
                      <Col
                        n='8'
                        className='bg-blue-soft-100 border-radius-8 color-white fs-12-16 p-12'
                        offset='2'
                      >
                        les bases bibliographiques ouvertes permettent de
                        {' '}
                        <b>partager et ré-utiliser les données</b>
                        , même de
                        {' '}
                        <b>construire de nouveaux services</b>
                        {' '}
                        sur les données
                        partagées
                      </Col>
                    </Col>
                    <Col n='12 md-5'>
                      <div className='fs-20-24 marianne-bold text-center'>
                        Les bases bibliographiques
                        <div className='mx-5'>
                          <span className='bg-white border-radius-30 px-6'>
                            propriétaires
                          </span>
                        </div>
                      </div>
                      <div className='text-center'>pallient ces défauts en</div>
                      <div className='text-center'>
                        enrichissant ces métadonnées
                      </div>
                      <Col
                        n='8'
                        className='bg-blue-soft-100 border-radius-8 color-white fs-12-16 p-12'
                        offset='2'
                      >
                        Les bases bibliographiques propriétaires :
                        <ul className='ml-12 my-0'>
                          <li>
                            <b>ne sont pas partageables sous licence libre</b>
                          </li>
                          <li>
                            <b>
                              sont biaisées et ne permettent pas de rendre
                              compte de la bibliodiversité de la production
                            </b>
                          </li>
                        </ul>
                      </Col>
                    </Col>
                  </Row>
                  <Row className='mb-60'>
                    <Col n='1' className='before-border-link-0'>
                      <div className='border-link border-link-first w-100 h-100' />
                    </Col>
                    <Col n='5' className='after-border-link'>
                      <div>
                        <span className='bg-white border-radius-30 color-blue-dark-125 fs-28-38 marianne-bold px-20'>
                          Notre méthodologie ouverte
                        </span>
                      </div>
                      <div className='fs-18-25 mt-16 ml-20'>
                        Nous avons donc décidé de collecter un maximum de
                        métadonnées d'affiliations pour chaque publication du
                        monde, à partir de
                        {' '}
                        <b>plusieurs sources libres</b>
                        .
                        Notre originalité : aucune utilisation de basesde
                        données propriétaires.
                      </div>
                    </Col>
                  </Row>
                  <Row className='mb-140'>
                    <Col n='1' className='before-border-link-1'>
                      <div className='border-link w-100 h-100' />
                    </Col>
                    <Col n='6' className='after-border-link'>
                      <div>
                        <span className='bg-blue-soft-150 border-radius-30 color-white fs-24-32 marianne-bold px-20 py-4'>
                          #1 Collecter...
                        </span>
                      </div>
                      <div className='color-blue-dark-125 fs-24-28 marianne-bold ml-20 mt-10'>
                        un maximum de métadonnées
                      </div>
                      <div className='fs-18-25 mt-16 ml-20 mt-12'>
                        Pour chaque publication du monde,
                        <br />
                        <span className='bg-purple-medium-100 color-white px-6'>
                          consolidation de plusieurs sources
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row className='mb-60'>
                    <Col n='1' className='before-border-link-2'>
                      <div className='border-link w-100 h-100' />
                    </Col>
                    <Col n='4' className='after-border-link'>
                      <div>
                        <span className='bg-blue-soft-150 border-radius-30 color-white fs-24-32 marianne-bold px-20 py-4'>
                          #2 Détecter...
                        </span>
                      </div>
                      <div className='color-blue-dark-125 fs-24-28 marianne-bold ml-20 mt-10'>
                        Le pays d'affiliation
                      </div>
                      <div className='fs-18-25 mt-16 ml-20 mt-12'>
                        <span className='bg-green-soft-100 color-white px-6'>
                          On filtre
                        </span>
                        {' '}
                        pour ne garder que les publications pour lesquelles
                        {' '}
                        <span className='bg-green-soft-100 color-white px-6'>
                          au moins une affiliation est française
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row className='mb-60'>
                    <Col n='1' className='before-border-link-3'>
                      <div className='border-link w-100 h-100' />
                    </Col>
                    <Col n='6' className='after-border-link'>
                      <div>
                        <span className='bg-blue-soft-150 border-radius-30 color-white fs-24-32 marianne-bold px-20 py-4'>
                          #3 Enrichir...
                        </span>
                      </div>
                      <div className='color-blue-dark-125 fs-24-28 marianne-bold ml-20 mt-10'>
                        ... le statut d'ouverture
                      </div>
                      <div className='fs-18-25 marianne-bold ml-20 mt-50'>
                        Pour les DOI crossref :
                      </div>
                      <div className='fs-18-25 ml-20'>
                        les informations viennent d'
                        <span className='bg-purple-medium-100 border-black border-radius-8 color-white marianne-bold px-6'>
                          Unpaywall
                        </span>
                      </div>
                      <div className='fs-18-25 marianne-bold ml-20 mt-20'>
                        Pour les publications dans HAL (sans DOI) :
                      </div>
                      <div className='fs-18-25 ml-20'>
                        les informations viennent de
                        {' '}
                        <span className='bg-purple-medium-100 border-black border-radius-8 color-white marianne-bold px-6'>
                          HAL
                        </span>
                      </div>
                      <div className='color-blue-dark-125 fs-24-28 marianne-bold ml-20 mt-120'>
                        ... la classification disciplinaire
                      </div>
                      <div className='fs-18-25 mt-16 ml-20 mt-20'>
                        Grâce à un
                        {' '}
                        <span className='bg-orange-soft-100 color-white px-6'>
                          algorithme de machine learning declassification
                          automatique
                        </span>
                        {' '}
                        (fastText) basé sur le titre, le résumé et le nom de la
                        revue.
                      </div>
                      <div className='fs-18-25 mt-16 ml-20 mt-40'>
                        Si des métadonnées sont disponibles dans HAL, on
                        effectue
                        {' '}
                        <span className='bg-orange-soft-100 color-white px-6'>
                          un transcodage de la nomenclature HAL vers celle du
                          Baromètre.
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row className='mb-60'>
                    <Col n='6' offset='1' className='after-border-link'>
                      <div>
                        <span className='bg-blue-soft-150 border-radius-30 color-white fs-24-32 marianne-bold px-20 py-4'>
                          #4 Partager...
                        </span>
                      </div>
                      <div className='color-blue-dark-125 fs-24-28 marianne-bold ml-20 mt-10'>
                        avec la communauté toutes ces données agrégées et
                        calculées
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </section>
          </Container>
        </div>
      )}
      {isInProduction() && (
        <div className='methodology'>
          <Banner
            backgroundColor='blue-soft-50'
            textColor='blue-dark-150'
            supTitle={<FormattedMessage id='app.header.title' />}
            title={
              <FormattedMessage id='app.header.nav.a-propos-methodologie' />
            }
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
                    Monitoring the production and the openness of research data
                    and software in France: Large-scale Machine-Learning
                    analysis of scientific PDF
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
                    Extending the open monitoring of open science: A new
                    framework for the French Open Science Monitor (BSO)
                  </a>
                  {' '}
                  <br />
                  <br />
                  <hr />
                  <br />
                  <FormattedMessage id='app.methodo-contact' />
                  {' '}
                  <a href='mailto:bso@recherche.gouv.fr'>
                    bso@recherche.gouv.fr
                  </a>
                  .
                </Col>
              </Row>
            </section>
          </Container>
        </div>
      )}
    </>
  );
}

export default Methodology;
