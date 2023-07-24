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
        <section className='color-blue-dark-125 content'>
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
                alt='bso local UL'
                href='https://scienceouverte.univ-lorraine.fr/bibliometrie/barometre-lorrain-de-la-science-ouverte/'
                img='/declinaisons/ul.svg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local CEA'
                href='https://www.cea.fr/chercheurs/Pages/information-scientifique/barometre-science-ouverte-2021.aspx'
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
                href='https://insermbiblio.inist.fr/barometre-de-la-science-ouverte-inserm/'
                img='/declinaisons/inserm.svg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Université de Rennes'
                href='https://scienceouverte.univ-rennes.fr/barometre-science-ouverte-edition-2022'
                img='/declinaisons/rennes.jpeg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Université de Bourgogne'
                href='https://www.u-bourgogne.fr/non-categorise/politique-science-ouverte'
                img='/declinaisons/universite-bourgogne.png'
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
                href='https://www.univ-poitiers.fr/decouvrir-la-recherche/publications-et-parutions/barometre-de-la-science-ouverte-de-luniversite-de-poitiers/'
                img='/declinaisons/universite-poitiers.svg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local INSA Toulouse'
                href='https://bib.insa-toulouse.fr/fr/chercheurs-et-doctorants/science-ouverte/barometre.html'
                img='/declinaisons/insa-toulouse.jpeg'
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
                alt='bso local CentraleSupélec'
                href='http://pole-ist.centralesupelec.fr/fr/node/482'
                img='/declinaisons/centrale-supelec.png'
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
                href='https://bibliotheques.univ-tlse3.fr/utiliser-nos-services/se-former-s-informer/chercheurs/la-science-ouverte-l-ut3'
                img='/declinaisons/ut3.jpeg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local CIRAD'
                href='https://partage-connaissances.cirad.fr/actualites/barometre-national-de-la-science-ouverte-declinaison-pour-le-cirad'
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
                alt='bso local Univeristé Brest UBO'
                href='http://ubodoc.univ-brest.fr/science-ouverte-et-valorisation/science-ouverte-a-lubo/barometre_science_ouverte/'
                img='/declinaisons/ubo.png'
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
                alt='bso local Université Lyon 1 UCBL'
                href='https://www.univ-lyon1.fr/actualites/lacces-ouvert-progresse-encore-a-lyon-1'
                img='/declinaisons/lyon1.jpg'
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
                href='https://www.imt-mines-albi.fr/fr/barometre-science-ouverte-2022'
                img='/declinaisons/imt-albi.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Université de Montpellier'
                href='https://bibliotheques.edu.umontpellier.fr/science-ouverte/bso-um/'
                img='/declinaisons/montpellier.png'
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
                href='https://www6.inrae.fr/dipso/La-science-ouverte-a-INRAE/Barometre-Science-Ouverte-INRAE2'
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
                href='https://openarchiv.hypotheses.org/7391'
                img='/declinaisons/onera.jpg'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local Université Jean Monnet Saint-Étienne UJM'
                href='https://www.univ-st-etienne.fr/fr/recherche/science-ouverte/barometre-de-la-science-ouverte.html'
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
                alt='bso local cnam'
                href='https://bibliotheques.cnam.fr/opac/article/le-barometre-science-ouverte-du-cnam/5_so_barometre2'
                img='/declinaisons/cnam.svg'
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
                img='/declinaisons/normandie_universite.png'
              />
            </Col>
            <Col n='lg-2 md-4 sm-6'>
              <CardLogo
                alt='bso local unilehavre Université Le Havre Normandie'
                href='https://bu.univ-lehavre.fr/enseignant-chercheur-doctorant/barometre-de-la-science-ouverte/article/barometre-de-la-science-ouverte'
                img='/declinaisons/unilehavre.jpg'
              />
            </Col>
          </Row>
          <Row gutters>
            <Col n='12' className='p-0'>
              <h4 className='p-0'>
                Baromètres de la Science Ouverte mis en place par les agences de
                financement
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
                Baromètres de la Science Ouverte mis en place par les
                établissements (ancienne version du BSO)
              </h4>
            </Col>
            <Col n='12 lg-8'>
              <ul className='style-disc'>
                <li>
                  <a
                    href='https://aau.archi.fr/laboratoire-aau/science-ouverte/'
                    rel='noreferrer'
                    target='_blank'
                  >
                    CRENAU - UMR AAU
                  </a>
                </li>
                <li>
                  <a
                    href='https://u-paris.fr/science-ouverte/barometre/'
                    rel='noreferrer'
                    target='_blank'
                  >
                    Université de Paris-Cité
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
}

export default Variations;
