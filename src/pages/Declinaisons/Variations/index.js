import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Banner from '../../../components/Banner';
import CardLogo from '../../../components/CardLogo';
import Icon from '../../../components/Icon';

const Variations = () => {
  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-23'
          color1='blue-soft-125'
          color2='blue-soft-75'
        />
      </Col>
    </Row>
  );
  return (
    <div className='variations no-arrow-link'>
      <Banner
        backgroundColor='blue-soft-50'
        textColor='blue-dark-150'
        supTitle={<FormattedMessage id='app.header.title' />}
        title={<FormattedMessage id='app.header.nav.a-propos-variations' />}
        icons={renderIcons}
      />
      <Container>
        <section className='color-blue-dark-125 content py-48'>
          <Row gutters>
            <Col n='12'>
              <h2>
                <FormattedMessage id='app.variations.title' />
              </h2>
            </Col>
            <Col n='12 lg-10 '>
              <FormattedMessage id='app.variations.first' />
            </Col>
            <Col n='12 lg-10'>
              <FormattedMessage id='app.variations.page' />
              <span>
                <span> </span>
                <span className='external_link'>
                  <a href='comment-realiser-bso-local'>
                    <FormattedMessage id='app.variations.how-to' />
                  </a>
                </span>
                <span> </span>
              </span>
              <FormattedMessage id='app.variations.steps' />
              <span> </span>
              <span className='external_link'>
                <a
                  target='_blank'
                  rel='noreferrer'
                  href='https://groupes.renater.fr/sympa/info/bso-etablissements'
                >
                  https://groupes.renater.fr/sympa/info/bso-etablissements
                </a>
              </span>
              <span> </span>
              <FormattedMessage id='app.variations.mailinglist' />
              {' '}
              <a href='mailto:bso@recherche.gouv.fr'>
                <FormattedMessage id='app.variations.email' />
              </a>
              .
              <p>
                <br />
              </p>
            </Col>
          </Row>
          <Row gutters>
            <Col n='12' className='p-0'>
              <h4 className='p-0'>
                <FormattedMessage id='app.variations.institutions' />
              </h4>
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local UL'
                href='https://scienceouverte.univ-lorraine.fr/bibliometrie/barometre-lorrain-de-la-science-ouverte/'
                img='/declinaisons/ul.svg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local CEA'
                href='https://www.cea.fr/chercheurs/Pages/information-scientifique/barometre-science-ouverte.aspx'
                img='/declinaisons/cea.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local ENSAM'
                href='https://bibliotheques.ensam.eu/page/barometre-de-la-science-ouverte'
                img='/declinaisons/ensam.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local AMU'
                href='https://oaamu.hypotheses.org/4850'
                img='/declinaisons/amu.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local PSL'
                href='https://explore.psl.eu/fr/se-former/publier/barometre-de-la-science-ouverte-de-luniversite-psl'
                img='/declinaisons/psl.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local EPHE'
                href='https://www.ephe.psl.eu/le-barometre-de-la-science-ouverte-de-lecole'
                img='/declinaisons/ephe.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local INSERM'
                href='https://insermbiblio.inist.fr/barometre-de-la-science-ouverte-inserm-2024/'
                img='/declinaisons/inserm.svg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Université de Rennes'
                href='https://scienceouverte.univ-rennes.fr/barometre-de-la-science-ouverte-0'
                img='/declinaisons/rennes.jpeg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local La Rochelle Université'
                href='https://bu.univ-larochelle.fr/lappui-a-la-recherche/barometre-science-ouverte/'
                img='/declinaisons/universite-la-rochelle.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Université de Poitiers'
                href='https://scienceouverte.univ-poitiers.fr/barometre-de-la-science-ouverte-de-luniversite-de-poitiers/'
                img='/declinaisons/universite-poitiers.svg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local INSA Lyon'
                href='https://hal-insa-lyon.archives-ouvertes.fr/page/barometre-science-ouverte'
                img='/declinaisons/insa-lyon.jpeg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Avignon Université'
                href='https://bu.univ-avignon.fr/barometre-de-la-science-ouverte-avignon-universite/'
                img='/declinaisons/avignon-universite.jpeg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local UCA'
                href='https://science-ouverte.uca.fr/publications-et-open-access/barometre-science-ouverte-uca'
                img='/declinaisons/uca.jpeg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Toulouse III'
                href='https://www.univ-tlse3.fr/la-recherche/science-ouverte'
                img='/declinaisons/ut3.jpeg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local CIRAD'
                href='https://indicateurs-publication.cirad.lodex.fr/#bso'
                img='/declinaisons/cirad.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local IMT Atlantique'
                href='https://www.imt-atlantique.fr/fr/recherche-innovation/enjeux/science-ouverte/libre-acces/bso'
                img='/declinaisons/imt-atlantique.jpeg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt="bso local Université d'Evry"
                href='https://www.biblio.univ-evry.fr/index.php/recherche-et-enseignement/science-ouverte/barometre-de-la-science-ouverte-evry/barometre-science-ouverte-evry-2022/'
                img='/declinaisons/universite-evry.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local UGA'
                href='https://scienceouverte.univ-grenoble-alpes.fr/science-ouverte-grenoble-alpes/barometre-science-ouverte/'
                img='/declinaisons/uga.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Institut Pasteur'
                href='https://www.pasteur.fr/fr/ceris/bibliotheque/s-engager-science-ouverte#barometre'
                img='/declinaisons/pasteur.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Université Paris-Saclay'
                href='https://www.universite-paris-saclay.fr/recherche/science-ouverte/le-barometre-de-la-science-ouverte-de-luniversite-paris-saclay'
                img='/declinaisons/ups.svg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Université Strasbourg UNISTRA'
                href='https://scienceouverte.unistra.fr/strategie/bso/'
                img='/declinaisons/unistra.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Nantes Université'
                href='https://bu.univ-nantes.fr/science-ouverte/le-barometre-de-la-science-ouverte-de-nantes-universite'
                img='/declinaisons/nantes.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local IMT Mines Albi'
                href='https://doc.imt-mines-albi.fr/fr/science-ouverte'
                img='/declinaisons/imt-albi.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Sorbonne Université'
                href='https://www.sorbonne-universite.fr/barometre-science-ouverte-de-sorbonne-universite'
                img='/declinaisons/sorbonne.svg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local UniLaSalle'
                href='https://www.unilasalle.fr/actualites/barometre-de-la-science-ouverte-unilasalle-2023'
                img='/declinaisons/unilasalle.svg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local INRAE'
                href='https://science-ouverte.inrae.fr/fr/la-science-ouverte/le-barometre-de-la-science-ouverte-inrae'
                img='/declinaisons/inrae.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local UVSQ'
                href='https://www.uvsq.fr/barometre-science-ouverte'
                img='/declinaisons/uvsq.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local ONERA'
                href='https://openarchiv.hypotheses.org/8887'
                img='/declinaisons/onera.jpg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Université Jean Monnet Saint-Étienne UJM'
                href='https://www.univ-st-etienne.fr/fr/recherche/science-ouverte/barometre-de-la-science-ouverte-2024.html'
                img='/declinaisons/universite-saint-etienne.jpg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local IFREMER'
                href='https://blp.ifremer.fr/Services/Science-Ouverte/Declinaison-Ifremer-du-Barometre-francais-Science-Ouverte'
                img='/declinaisons/ifremer.svg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local cyu cergy'
                href='https://bibliotheque.cyu.fr/version-francaise/science-ouverte/barometre-de-la-science-ouverte-2'
                img='/declinaisons/cyu.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local brgm'
                href='https://www.brgm.fr/fr/actualite/actualite/brgm-publie-barometre-science-ouverte'
                img='/declinaisons/brgm.svg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local upjv'
                href='https://www.bu.u-picardie.fr/pages-daccueil-appui-a-la-recherche/barometre-upjv-de-la-science-ouverte/'
                img='/declinaisons/upjv.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Hospices Civils de Lyon'
                href='https://documentation.chu-lyon.fr/node/512'
                img='/declinaisons/hcl.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Normandie Université'
                href='https://science-ouverte.normandie-univ.fr/blog/premiere-edition-du-barometre-normand-pour-la-science-ouverte/'
                img='/declinaisons/normandie-universite.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local unilehavre Université Le Havre Normandie'
                href='https://bu.univ-lehavre.fr/enseignant-chercheur-doctorant/barometre-de-la-science-ouverte/article/barometre-de-la-science-ouverte'
                img='/declinaisons/unilehavre.jpg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local crenau umr aau'
                href='https://aau.archi.fr/laboratoire-aau/science-ouverte/'
                img='/declinaisons/aau.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local universite tours'
                href='https://scienceouverte.univ-tours.fr/barometre-tourangeau-de-la-science-ouverte'
                img='/declinaisons/tours.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local sciences po'
                href='https://sciencespo.libguides.com/publications/barometre-science-ouverte'
                img='/declinaisons/scpo.jpg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local université Bordeaux'
                href='https://bibliotheques.u-bordeaux.fr/Soutien-a-la-recherche/Acces-ouvert-Open-access/Barometre-de-la-science-ouverte/Barometre-de-la-Science-Ouverte-de-l-universite-de-Bordeaux'
                img='/declinaisons/universite-bordeaux.jpg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local université angers'
                href='https://www.univ-angers.fr/fr/recherche/science-et-societe/open-access-et-publications-sur-hal-ua/barometre-de-la-science-ouverte.html'
                img='/declinaisons/universite-angers.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local université paris cité'
                href='https://u-paris.fr/science-ouverte/barometre/'
                img='/declinaisons/universite-paris-cite.jpg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local upec université paris est créteil'
                href='https://bibliotheque.u-pec.fr/savan/science-ouverte/le-barometre-science-ouverte-de-lupec-1'
                img='/declinaisons/upec.jpg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local inp institut national polytechnique de toulouse'
                href='https://bibliotech.inp-toulouse.fr/fr/services-aux-chercheurs/barometre-de-la-science-ouverte-toulouse-inp.html'
                img='/declinaisons/inp.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local université gustave eiffel'
                href='https://www.univ-gustave-eiffel.fr/la-recherche/science-ouverte/barometre-de-la-science-ouverte-a-luniversite'
                img='/declinaisons/gustave-eiffel.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt="bso local muséum national d'Histoire naturelle"
                href='https://www.mnhn.fr/fr/la-science-ouverte-au-museum'
                img='/declinaisons/mnhn.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt="bso local unica université côte d'azur"
                href='https://univ-cotedazur.fr/recherche-innovation/science-ouverte/science-ouverte-a-universite-cote-dazur/barometre-science-ouverte'
                img='/declinaisons/unica.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt="bso local ua université d'artois"
                href='https://science-ouverte.univ-artois.fr/barometre-de-la-science-ouverte-de-luniversite-dartois/'
                img='/declinaisons/universite-artois.jpg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local INED'
                href='https://so.site.ined.fr/fr/publications/bso/'
                img='/declinaisons/ined.svg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local ULille université de lille'
                href='https://scienceouverte.univ-lille.fr/nos-engagements/barometre-de-la-science-ouverte'
                img='/declinaisons/ulille.svg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local LJK laboratoire jean kuntzmann'
                href='https://www-ljk.imag.fr/spip.php?article120'
                img='/declinaisons/ljk.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local IMT Mines Alès'
                href='https://imt-mines-ales.hal.science/page/barometre-science-ouverte'
                img='/declinaisons/imt-ales.jpg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local UTC université de technologie de Compiègne'
                href='https://www.utc.fr/recherche/science-ouverte/'
                img='/declinaisons/utc.jpg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Centrale Lyon'
                href='https://bibliotheque.ec-lyon.fr/services-la-recherche/la-science-ouverte-centrale-lyon/barometre-science-ouverte'
                img='/declinaisons/centrale-lyon.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local UNîmes Nîmes Université'
                href='https://www.unimes.fr/fr/vie-de-campus/bibliotheque/utiliser-la-bibliotheque/barom-sci-ouv-un.html'
                img='/declinaisons/unimes.jpg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Université de Toulon'
                href='https://www.univ-tln.fr/Barometre-toulonnais-de-la-science-ouverte.html'
                img='/declinaisons/utln.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Université de Lyon 1'
                href='https://portaildoc.univ-lyon1.fr/barometre-de-la-science-ouverte'
                img='/declinaisons/lyon1.jpg'
              />
            </Col>
          </Row>
          <Row gutters>
            <Col n='12' className='p-0'>
              <h4 className='p-0'>
                <FormattedMessage id='app.variations.funders' />
              </h4>
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local ANR'
                href='https://anr.fr/fr/lanr/engagements/la-science-ouverte/le-barometre-science-ouverte-anr/'
                img='/declinaisons/anr.png'
              />
            </Col>
          </Row>
          <Row gutters>
            <Col n='12'>
              <h4 className='p-0'>
                <FormattedMessage id='app.variations.not-published' />
              </h4>
            </Col>
            <Col n='12 lg-8'>
              <ul className='style-disc'>
                <li>ENS de Lyon</li>
              </ul>
            </Col>
          </Row>
          <Row gutters>
            <Col n='12'>
              <h4 className='p-0'>
                <FormattedMessage id='app.variations.others' />
              </h4>
            </Col>
            <Col n='12 lg-8' className='p-0'>
              <ul className='style-disc'>
                <li>
                  <a
                    href='https://www.cnrs.fr/fr/cnrsinfo/le-cnrs-leader-francais-de-la-science-ouverte'
                    rel='noreferrer'
                    target='_blank'
                  >
                    CNRS
                  </a>
                </li>
                <li>
                  <a
                    href='https://espacechercheurs.enpc.fr/fr/taux-OA'
                    rel='noreferrer'
                    target='_blank'
                  >
                    Ecole des Ponts Paristech
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default Variations;
