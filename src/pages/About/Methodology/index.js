import './style.scss';

import { Col, Container, Link as DSLink, Row } from '@dataesr/react-dsfr';
import { FormattedMessage, useIntl } from 'react-intl';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';
import { isInProduction } from '../../../utils/helpers';
import useLang from '../../../utils/Hooks/useLang';

function Methodology() {
  const intl = useIntl();
  const { lang } = useLang();

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
      <div className='methodology'>
        <Banner
          backgroundColor='blue-soft-50'
          textColor='blue-dark-150'
          supTitle={<FormattedMessage id='app.header.title' />}
          title={<FormattedMessage id='app.header.nav.a-propos-methodologie' />}
          icons={renderIcons}
        />
      </div>
      <Container>
        <section className='content py-4'>
          <Row gutters>
            <Col n='12 md-6 lg-6'>
              <h4 className='marianne-bold fs-24-32'>
                <FormattedMessage id='app.methodologie.publication' />
              </h4>
              <div>
                <DSLink
                  href='/assets/methodologie_publications_fr.pdf'
                  target='_blank'
                >
                  <FormattedMessage id='app.methodologie.publication.description-fr' />
                </DSLink>
              </div>
              <div>
                <DSLink
                  href='/assets/methodologie_publications_en.pdf'
                  target='_blank'
                >
                  <FormattedMessage id='app.methodologie.publication.description-en' />
                </DSLink>
              </div>
              <img
                src={`/assets/methodologie_publications_${lang}.png`}
                alt='flyer bso'
                className='w-100 flex img-fluid w-100 ds-fr--v-middle'
              />
            </Col>
            <Col n='12 md-6 lg-6'>
              <h4 className='marianne-bold fs-24-32'>
                <FormattedMessage id='app.methodologie.data_software' />
              </h4>
              <div>
                <DSLink
                  href='/assets/methodologie_data_software_fr.pdf'
                  target='_blank'
                >
                  <FormattedMessage id='app.methodologie.data_software.description-fr' />
                </DSLink>
              </div>
              <div>
                <DSLink
                  href='/assets/methodologie_data_software_en.pdf'
                  target='_blank'
                >
                  <FormattedMessage id='app.methodologie.data_software.description-en' />
                </DSLink>
              </div>
              <img
                src={`/assets/methodologie_data_software_${lang}.png`}
                alt='flyer resultats bso'
                className='w-100 flex img-fluid w-100 ds-fr--v-middle'
              />
            </Col>
          </Row>
        </section>
      </Container>
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
          <Container className='bg-blue-soft-25'>
            <section className='content py-48'>
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
                  Publication : une méthodologie inédite
                </h3>
              </Row>
              <Row>
                <div className='mb-24 text-center w-100'>
                  <span className='border-radius-30 fs-28-32 marianne-bold px-28 py-4'>
                    Notre constat
                  </span>
                </div>
              </Row>
              <Row gutters className='mb-60'>
                <Col n='12 md-5' offset='1' className='border'>
                  <div className='fs-20-24 marianne-bold text-center'>
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
                  <div className='text-center mt-16 mb-n50'>
                    <img
                      alt='euro'
                      src='/assets/methodology_0_open_bases.svg'
                    />
                  </div>
                  <Col
                    n='8'
                    className='bg-blue-soft-100 border-radius-8 color-white fs-12-16 p-12 relative'
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
                  <div className='float-right mb-n171'>
                    <img alt='euro' src='/assets/methodology_euro.svg' />
                  </div>
                  <div className='clear text-center mt-16 mb-n50'>
                    <img
                      alt='proprietary bases'
                      src='/assets/methodology_0_proprietary_bases.svg'
                    />
                  </div>
                  <Col
                    n='8'
                    className='bg-blue-soft-100 border-radius-8 color-white fs-12-16 p-12 relative'
                    offset='2'
                  >
                    Les bases bibliographiques propriétaires :
                    <ul className='ml-12 mx-0'>
                      <li>
                        <b>ne sont pas partageables sous licence libre</b>
                      </li>
                      <li>
                        <b>
                          sont biaisées et ne permettent pas de rendre compte de
                          la bibliodiversité de la production
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
                    métadonnées d'affiliations pour chaque publication du monde,
                    à partir de
                    {' '}
                    <b>plusieurs sources libres</b>
                    . Notre
                    originalité : aucune utilisation de bases de données
                    propriétaires.
                  </div>
                </Col>
                <Col n='5'>
                  <div className='mt-90 relative'>
                    <img
                      alt='collect data'
                      className='absolute'
                      src='/assets/methodology_1_collect_fr.svg'
                    />
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
              <Row>
                <Col n='1' className='before-border-link-2'>
                  <div className='border-link w-100 h-100' />
                </Col>
                <Col n='5' className='after-border-link'>
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
                  <div className='ml-20'>
                    <span className='fs-16-22 marianne-extra-bold'>
                      Taux de détection des publications scientifiques
                      françaises
                    </span>
                    <Row>
                      <Col n='3'>
                        <span>
                          <img
                            alt='donut'
                            src='/assets/methodology_2_donut.svg'
                          />
                        </span>
                      </Col>
                      <Col n='7'>
                        <span className='fs-12-16'>
                          La méthodologie du Baromètre a permis de constituer
                          {' '}
                          <b>
                            la base de données des publications françaises la
                            plus exhaustive à ce jour dans le monde*
                          </b>
                          .
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col n='4'>
                        <span className='fs-12-16'>
                          pour un des outils mondiaux de référence, le Web of
                          Science (WoS).
                        </span>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col n='5' className='ml-35'>
                  <div className='text-left'>
                    <img
                      alt='enrich data'
                      className='mr-90 mt-10'
                      src='/assets/methodology_2_detect.svg'
                    />
                    <div className='float-right fs-12-12 mb-10 mr-90 mt-n50 text-justify w-30'>
                      Outil pour détecter le pays d'affiliation d'une métadonnée
                      d'affiliation brute
                    </div>
                    <div className='clear marianne-medium-italic text-right'>
                      <div>
                        <span>"Sorbonne Université, Paris" → France</span>
                        <span>
                          <img
                            alt='success'
                            className='ml-10'
                            src='/assets/methodology_success.svg'
                          />
                        </span>
                      </div>
                      <div>
                        <span>
                          "Hotel Dieu de France, Beirut, Lebanon" → Liban
                        </span>
                        <span>
                          <img
                            alt='success'
                            className='ml-10'
                            src='/assets/methodology_error.svg'
                          />
                        </span>
                      </div>
                    </div>
                    <div className='mt-40 my-60 text-center'>
                      <div className='fs-24-28 marianne-bold'>
                        Base des publications scientifiques françaises
                      </div>
                      <div className='fs-52-35 marianne-light mt-12'>
                        170 000/an
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className='float-right'>
                <Col className='mr-500 mt-n100'>
                  <div className='text-center'>
                    <img
                      alt='French publication filter'
                      src='/assets/methodology_2_footer.svg'
                    />
                  </div>
                </Col>
              </Row>
              <Row className='clear mb-60'>
                <Col n='1' className='before-border-link-3'>
                  <div className='border-link w-100 h-100' />
                </Col>
                <Col n='5' className='after-border-link'>
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
                    ( fas tText) basé sur le titre, le résumé et le nom de la
                    revue.
                  </div>
                  <div className='fs-18-25 mt-16 ml-20 mt-40'>
                    Si des métadonnées sont disponibles dans HAL, on effectue
                    {' '}
                    <span className='bg-orange-soft-100 color-white px-6'>
                      un transcodage de la nomenclature HAL vers celle du
                      Baromètre.
                    </span>
                  </div>
                </Col>
                <Col n='5'>
                  <div className='text-right'>
                    <img
                      alt='enrich data'
                      src='/assets/methodology_3_enrich_fr.svg'
                    />
                  </div>
                </Col>
              </Row>
              <Row className='mb-60'>
                <Col n='11' offset='1' className='after-border-link'>
                  <div>
                    <span className='bg-blue-soft-150 border-radius-30 color-white fs-24-32 marianne-bold px-20 py-4'>
                      #4 Partager...
                    </span>
                  </div>
                  <div className='color-blue-dark-125 fs-24-28 marianne-bold ml-20 mt-10'>
                    avec la communauté toutes ces données agrégées et calculées
                  </div>
                  <Row>
                    <Col>
                      <div className='bg-white border-black border-radius-8 fs-20-24 marianne-bold mt-28 px-8 py-4 w-60'>
                        Données datavisualisées sur le site du Baromètre...
                      </div>
                      <div className='bg-yellow-medium-100 border-black border-radius-8 fs-14-19 marianne-bold mb-20 ml-40 p-8 w-60'>
                        <a
                          href='barometredelascienceouverte.esr.gouv.fr'
                          target='_blank'
                        >
                          barometredelascienceouverte.esr.gouv.fr
                        </a>
                      </div>
                      <div className='ml-60'>
                        <img
                          alt='screenshot BSO'
                          src='/assets/screenshot_bso.png'
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className='bg-white border-black border-radius-8 fs-20-24 marianne-bold mt-28 px-8 py-4 w-60'>
                        ...et disponibles sur le portail Open Data du MESR
                      </div>
                      <div className='bg-yellow-medium-100 border-black border-radius-8 fs-14-19 marianne-bold mb-20 ml-40 p-8 w-60'>
                        <a
                          href='data.enseignementsup-recherche.gouv.fr'
                          target='_blank'
                        >
                          data.enseignementsup-recherche.gouv.fr
                        </a>
                      </div>
                      <div className='ml-60'>
                        <img
                          alt='screenshot ScanR'
                          src='/assets/screenshot_scanr.png'
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </section>
          </Container>
        </div>
      )}
      <Container>
        <section className='content py-28'>
          <FormattedMessage id='app.methodo-contact' />
          {' '}
          <a href='mailto:bso@recherche.gouv.fr'>
            <FormattedMessage id='app.variations.email' />
          </a>
          .
        </section>
      </Container>
    </>
  );
}

export default Methodology;
