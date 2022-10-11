import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';

function Variations() {
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
    <div className='variations'>
      <Banner
        backgroundColor='blue-soft-50'
        textColor='blue-dark-150'
        supTitle={<FormattedMessage id='app.header.title' />}
        title={<FormattedMessage id='app.header.nav.a-propos-variations' />}
        icons={renderIcons}
      />
      <Container>
        <section className='content py-48'>
          <Row gutters>
            <Col n='12 lg-8'>
              <h4 className='marianne-bold fs-24-32' id='examples'>
                Baromètres de la Science Ouverte des établissements déjà en
                place
              </h4>
              L'Université de Lorraine a été le premier établissement à
              développer une déclinaison locale du Baromètre français de la
              Science Ouverte. Le code réalisé à cette occasion est disponible
              dans
              {' '}
              <a
                href='https://hal.univ-lorraine.fr/hal-03450104'
                target='_blank'
                rel='noreferrer'
              >
                HAL et Software Heritage
              </a>
              . Forte de cette expérience, l'Université de Lorraine a contribué
              à la mise en place de cette nouvelle déclinaison locale.
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8'>
              Pour toute question, n'hésitez pas à envoyer un mail à
              {' '}
              <a href='mailto:bso@recherche.gouv.fr'>bso@recherche.gouv.fr</a>
              .
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8'>
              Liste des déclinaisons locales des BSO utilisant le cadre proposé
              par le BSO général :
              <ul className='style-disc'>
                <li>
                  <a
                    href='https://scienceouverte.univ-lorraine.fr/barometre-lorrain-de-la-science-ouverte/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université de Lorraine
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.cea.fr/chercheurs/Pages/information-scientifique/barometre-science-ouverte-2021.aspx'
                    target='_blank'
                    rel='noreferrer'
                  >
                    CEA
                  </a>
                </li>
                <li>
                  <a
                    href='https://bibliotheques.ensam.eu/page/barometre-de-la-science-ouverte'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Arts et Métiers Sciences & Technologies
                  </a>
                </li>
                <li>
                  <a
                    href='https://oaamu.hypotheses.org/3118'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Aix-Marseille Université
                  </a>
                </li>
                <li>
                  <a
                    href='https://explore.psl.eu/fr/se-former/publier/barometre-de-la-science-ouverte-de-luniversite-psl'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université PSL
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.ephe.psl.eu/le-barometre-de-la-science-ouverte-de-lecole'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Ecole Pratique des Hautes Études - PSL
                  </a>
                </li>
                <li>
                  <a
                    href='https://insermbiblio.inist.fr/barometre-de-la-science-ouverte-inserm/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Inserm
                  </a>
                </li>
                <li>
                  <a
                    href='https://scienceouverte.univ-rennes1.fr/barometre-science-ouverte-de-luniversite-de-rennes-1'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université de Rennes 1
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.u-bourgogne.fr/non-categorise/politique-science-ouverte'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université de Bourgogne
                  </a>
                </li>
                <li>
                  <a
                    href='https://bu.univ-larochelle.fr/lappui-a-la-recherche/barometre-science-ouverte/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université de La Rochelle
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.univ-poitiers.fr/decouvrir-la-recherche/publications-et-parutions/barometre-de-la-science-ouverte-de-luniversite-de-poitiers/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université de Poitiers
                  </a>
                </li>
                <li>
                  <a
                    href='https://bib.insa-toulouse.fr/fr/chercheurs-et-doctorants/science-ouverte/barometre.html'
                    target='_blank'
                    rel='noreferrer'
                  >
                    INSA Toulouse
                  </a>
                </li>
                <li>
                  <a
                    href='https://hal-insa-lyon.archives-ouvertes.fr/page/barometre-science-ouverte'
                    target='_blank'
                    rel='noreferrer'
                  >
                    INSA Lyon
                  </a>
                </li>
                <li>
                  <a
                    href='https://bu.univ-avignon.fr/barometre-de-la-science-ouverte-avignon-universite/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Avignon Université
                  </a>
                </li>
                <li>
                  <a
                    href='http://pole-ist.centralesupelec.fr/fr/node/482'
                    target='_blank'
                    rel='noreferrer'
                  >
                    CentraleSupélec
                  </a>
                </li>
                <li>
                  <a
                    href='https://science-ouverte.uca.fr/publications-et-open-access/barometre-science-ouverte-uca'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université Clermont Auvergne
                  </a>
                </li>
                <li>
                  <a
                    href='https://bibliotheques.univ-tlse3.fr/utiliser-nos-services/se-former-s-informer/chercheurs/la-science-ouverte-l-ut3'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université Toulouse 3 - Paul Sabatier
                  </a>
                </li>
                <li>
                  <a
                    href='https://partage-connaissances.cirad.fr/actualites/barometre-national-de-la-science-ouverte-declinaison-pour-le-cirad'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Cirad
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.imt-atlantique.fr/fr/recherche-innovation/enjeux/science-ouverte/libre-acces/bso'
                    target='_blank'
                    rel='noreferrer'
                  >
                    IMT Atlantique
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.biblio.univ-evry.fr/index.php/recherche-et-enseignement/science-ouverte/barometre-de-la-science-ouverte-evry/barometre-science-ouverte-evry-2022/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université Evry Val d'Essone
                  </a>
                </li>
                <li>
                  <a
                    href='https://scienceouverte.univ-grenoble-alpes.fr/science-ouverte-grenoble-alpes/barometre-science-ouverte/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université Grenoble Alpes
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8'>
              Liste des autres déclinaisons locales des BSO (ou équivalent de
              suivi du taux open access) :
              <ul className='style-disc'>
                <li>
                  <a
                    href='https://aau.archi.fr/laboratoire-aau/science-ouverte/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    CRENAU - UMR AAU
                  </a>
                </li>
                <li>
                  <a
                    href='https://bibliotheques.cnam.fr/opac/article/le-barometre-science-ouverte-du-cnam/5_so_barometre1'
                    target='_blank'
                    rel='noreferrer'
                  >
                    CNAM
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.science-ouverte.cnrs.fr/actualite/louverture-des-publications-progresse-au-cnrs/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    CNRS
                  </a>
                </li>
                <li>
                  <a
                    href='https://espacechercheurs.enpc.fr/fr/taux-OA'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Ecole des Ponts Paristech
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.imt-mines-albi.fr/barometre-science-ouverte-2021'
                    target='_blank'
                    rel='noreferrer'
                  >
                    IMT Mines Albi
                  </a>
                </li>
                <li>
                  <a
                    href='https://www6.inrae.fr/dipso/La-science-ouverte-a-INRAE/Barometre-Science-Ouverte-INRAE2'
                    target='_blank'
                    rel='noreferrer'
                  >
                    INRAE
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.pasteur.fr/fr/ceris/bibliotheque/s-engager-science-ouverte#barometre'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Institut Pasteur
                  </a>
                </li>
                <li>
                  <a
                    href='https://openarchiv.hypotheses.org/6387'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Onera
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.unilasalle.fr/actualites/le-barometre-de-la-science-ouverte-unilasalle-est-disponible'
                    target='_blank'
                    rel='noreferrer'
                  >
                    UniLaSalle
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.univ-brest.fr/drive/menu/DRIVe/Science-Ouverte/Barometre-de-la-science-ouverte'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université de Brest
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.univ-lyon1.fr/recherche/point-barometre-pour-la-science-ouverte-lyon'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université de Lyon 1
                  </a>
                </li>
                <li>
                  <a
                    href='https://u-paris.fr/science-ouverte/barometre/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université de Paris-Cité
                  </a>
                </li>
                <li>
                  <a
                    href='https://scienceouverte.unistra.fr/strategie/le-barometre-science-ouverte/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université de Strasbourg
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.universite-paris-saclay.fr/barometre-science-ouverte-2021'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université Paris Saclay
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.uvsq.fr/barometre-science-ouverte'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université Versailles Saint Quentin
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default Variations;
