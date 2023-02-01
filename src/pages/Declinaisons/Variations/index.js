import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Banner from '../../../components/Banner';
import CardLogo from '../../../components/CardLogo';
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
        <section className='content bd125'>
          <Row gutters>
            <Col n='12'>
              <h2>
                Baromètres de la Science Ouverte mis en place par les
                établissements
              </h2>
            </Col>
            <Col n='12 lg-10 '>
              L'Université de Lorraine a été le premier établissement à
              développer une déclinaison locale du Baromètre français de la
              Science Ouverte. Suite à cette expérience réussie, une
              collaboration entre le MESR et l'UL a mis en place une démarche
              simple pour la création de déclinaison locale du Baromètre de la
              Science Ouverte, que ce soit au niveau établissement, groupement
              de laboratoires ou laboratoire.
            </Col>
            <Col n='12 lg-10'>
              La page
              <span>
                <span> </span>
                <span className='external_link'>
                  <a href='comment-realiser-bso-local'>
                    "Comment réaliser son BSO local"
                  </a>
                </span>
                <span> </span>
              </span>
              détaille les étapes. Une mailing-list RENATER est ouverte à tous
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
              pour constituer un réseau d'entraide et fédérer les compétences.
              Par ailleurs, l'équipe BSO est contactable à l'adresse :
              {' '}
              <a href='mailto:bso@recherche.gouv.fr'>bso@recherche.gouv.fr</a>
              .
              <p>
                <br />
              </p>
            </Col>
          </Row>
          <Row gutters>
            <Col n='12' className='p-0'>
              <h4 className='p-0'>
                Baromètres de la Science Ouverte mis en place par les
                établissements (dernière version du BSO)
              </h4>
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                img='/declinaisons/UL.svg'
                alt='bso local UL'
                href='https://scienceouverte.univ-lorraine.fr/barometre-lorrain-de-la-science-ouverte/'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://www.cea.fr/chercheurs/Pages/information-scientifique/barometre-science-ouverte-2021.aspx'
                img='/declinaisons/CEA.png'
                alt='bso local CEA'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://bibliotheques.ensam.eu/page/barometre-de-la-science-ouverte'
                img='/declinaisons/ENSAM.png'
                alt='bso local ENSAM'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://oaamu.hypotheses.org/3118'
                img='/declinaisons/AMU.png'
                alt='bso local AMU'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://explore.psl.eu/fr/se-former/publier/barometre-de-la-science-ouverte-de-luniversite-psl'
                img='/declinaisons/PSL.png'
                alt='bso local PSL'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://www.ephe.psl.eu/le-barometre-de-la-science-ouverte-de-lecole'
                img='/declinaisons/EPHE.png'
                alt='bso local EPHE'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://insermbiblio.inist.fr/barometre-de-la-science-ouverte-inserm/'
                img='/declinaisons/INSERM.svg'
                alt='bso local INSERM'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://scienceouverte.univ-rennes1.fr/barometre-science-ouverte-de-luniversite-de-rennes-1'
                img='/declinaisons/rennes1.png'
                alt='bso local Rennes 1'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://www.u-bourgogne.fr/non-categorise/politique-science-ouverte'
                img='/declinaisons/universiteBourgogne.png'
                alt='bso local UB'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://bu.univ-larochelle.fr/lappui-a-la-recherche/barometre-science-ouverte/'
                img='/declinaisons/universiteLaRochelle.png'
                alt='bso local la rochelle'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://www.univ-poitiers.fr/decouvrir-la-recherche/publications-et-parutions/barometre-de-la-science-ouverte-de-luniversite-de-poitiers/'
                img='/declinaisons/universitePoitiers.svg'
                alt='bso local Poitiers'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://bib.insa-toulouse.fr/fr/chercheurs-et-doctorants/science-ouverte/barometre.html'
                img='/declinaisons/INSAToulouse.jpeg'
                alt='bso local INSA Toulouse'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://hal-insa-lyon.archives-ouvertes.fr/page/barometre-science-ouverte'
                img='/declinaisons/INSALyon.jpeg'
                alt='bso local INSA Lyon'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://bu.univ-avignon.fr/barometre-de-la-science-ouverte-avignon-universite/'
                img='/declinaisons/AvignonUniversite.jpeg'
                alt='bso local Avignon université'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='http://pole-ist.centralesupelec.fr/fr/node/482'
                img='/declinaisons/CentraleSupelec.png'
                alt='bso local CentraleSupélec'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://science-ouverte.uca.fr/publications-et-open-access/barometre-science-ouverte-uca'
                img='/declinaisons/UCA.jpeg'
                alt='bso local UCA'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://bibliotheques.univ-tlse3.fr/utiliser-nos-services/se-former-s-informer/chercheurs/la-science-ouverte-l-ut3'
                img='/declinaisons/UT3.jpeg'
                alt='bso local Toulouse 3'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://partage-connaissances.cirad.fr/actualites/barometre-national-de-la-science-ouverte-declinaison-pour-le-cirad'
                img='/declinaisons/CIRAD.png'
                alt='bso local CIRAD'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://www.imt-atlantique.fr/fr/recherche-innovation/enjeux/science-ouverte/libre-acces/bso'
                img='/declinaisons/IMTAtlantique.jpeg'
                alt='bso local IMT Atlantique'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://www.biblio.univ-evry.fr/index.php/recherche-et-enseignement/science-ouverte/barometre-de-la-science-ouverte-evry/barometre-science-ouverte-evry-2022/'
                img='/declinaisons/universiteEvry.png'
                alt='bso local Evry'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://scienceouverte.univ-grenoble-alpes.fr/science-ouverte-grenoble-alpes/barometre-science-ouverte/'
                img='/declinaisons/UGA.png'
                alt='bso local UGA'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://www.univ-brest.fr/drive/menu/DRIVe/Science-Ouverte/Barometre-de-la-science-ouverte'
                img='/declinaisons/UBO.png'
                alt='bso local univeristé brest'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://www.pasteur.fr/fr/ceris/bibliotheque/s-engager-science-ouverte#barometre'
                img='/declinaisons/pasteur.png'
                alt='bso local institut pasteur'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://www.universite-paris-saclay.fr/recherche/science-ouverte/le-barometre-de-la-science-ouverte-de-luniversite-paris-saclay'
                img='/declinaisons/UPS.svg'
                alt='bso local universite paris saclay'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://www.univ-lyon1.fr/actualites/les-trois-quarts-de-la-production-scientifique-de-lyon-1-sont-en-acces-ouvert'
                img='/declinaisons/lyon1.jpg'
                alt='bso local universite lyon 1'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://scienceouverte.unistra.fr/strategie/le-barometre-science-ouverte/'
                img='/declinaisons/unistra.png'
                alt='bso local universite strasbourg unistra'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://bu.univ-nantes.fr/science-ouverte/le-barometre-de-la-science-ouverte-de-nantes-universite'
                img='/declinaisons/nantes_univ.png'
                alt='bso local universite nantes'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://www.imt-mines-albi.fr/fr/barometre-science-ouverte-2022'
                img='/declinaisons/IMTAlbi.png'
                alt='bso local imt mines albi'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://bibliotheques.edu.umontpellier.fr/science-ouverte/bso-um/'
                img='/declinaisons/montpellier.png'
                alt='bso local universite montpellier'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                href='https://www.sorbonne-universite.fr/barometre-science-ouverte-de-sorbonne-universite'
                img='/declinaisons/sorbonne.svg'
                alt='bso local sorbonne universite'
              />
            </Col>
          </Row>
          <Row gutters>
            <Col n='12'>
              <h4 className='p-0'>
                Baromètres de la Science Ouverte mis en place par les
                établissements (ancienne version du BSO)
              </h4>
            </Col>
            <Col n='12 lg-8'>
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
                    href='https://www6.inrae.fr/dipso/La-science-ouverte-a-INRAE/Barometre-Science-Ouverte-INRAE2'
                    target='_blank'
                    rel='noreferrer'
                  >
                    INRAE
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
                    href='https://u-paris.fr/science-ouverte/barometre/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université de Paris-Cité
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
            <p>
              <br />
            </p>
          </Row>
          <Row gutters>
            <Col n='12'>
              <h4 className='p-0'>
                Autres suivis de l'ouverture des publications
              </h4>
            </Col>
            <Col n='12 lg-8' className='p-0'>
              <ul className='style-disc'>
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
              </ul>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default Variations;
