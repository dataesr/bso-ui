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
              La partie nationale du BSO est déclinable pour les établissements
              (et laboratoires).
              <ol>
                <li>
                  Chaque établissement / laboratoire qui le souhaite nous fait
                  parvenir une liste de DOI (csv ou excel) , et nous précise le
                  nom qui sera affiché pour l'établissement, la date de début
                  ainsi que la date de fin si nécessaire. Pour obtenir cette
                  liste de DOI, l'Université de Lorraine a développé un code que
                  vous pouvez trouver
                  {' '}
                  <a
                    href='https://gitlab.com/Cthulhus_Queen/barometre_scienceouverte_universitedelorraine/-/blob/master/01_nettoyage_donnees.ipynb'
                    rel='noreferrer'
                    target='_blank'
                  >
                    ici
                  </a>
                  .
                </li>
                <li>
                  Il faut alors que notre système ingère cette liste de DOI afin
                  de compléter les informations dont nous disposons si
                  nécessaire.
                </li>
                <li>
                  Dès lors, chaque graphique du BSO national est déclinable pour
                  l'établissement / laboratoire en passant un paramètre dans
                  l'URL. Ce graphe sera alors intégrable dans n'importe quel
                  site web via une iFrame. Pour décliner un graphe, cliquer sur
                  le bouton "Intégration" en bas du graphe voulu, afin de
                  récupérer l'url du graphe en question. Ensuite, ajouter à
                  cette url l'identifiant RNSR de la structure (ex:
                  <i>bsoLocalAffiliation=130015506</i>
                  {' '}
                  pour l'Université de
                  Lorraine).
                </li>
                <li>
                  Par défaut, les éléments envoyés précédemment (nom, date de
                  début et date de fin) seront intégrés pour cet établissement /
                  laboratoire. Néanmoins, il est possible de les modifier
                  directement dans l'URL via des paramètres :
                  <ul>
                    <li>
                      <b>bsoLocalAffiliation</b>
                      : RNSR de l'établissement (ex:
                      bsoLocalAffiliation=130015506)
                      <i>requis</i>
                    </li>
                    <li>
                      <b>commentsName</b>
                      : Nom de l'établissement / laboratoire
                      qui sera affiché dans les commentaires (ex:
                      commentsName=pour l'université de Lorraine)
                      <i>défaut: ''</i>
                    </li>
                    <li>
                      <b>displayComment</b>
                      : affiche ou masque le commentaire
                      (ex: displayComment=false),
                      <i>défaut: true</i>
                    </li>
                    <li>
                      <b>displayTitle</b>
                      : affiche ou masque le titre (ex:
                      displayTitle=false),
                      <i>défaut: true</i>
                    </li>
                    <li>
                      <b>endYear</b>
                      : filtre sur l'année de publication
                      inférieure ou égale (ex: endYear=2020)
                      <i>défaut: Aucune</i>
                    </li>
                    <li>
                      <b>name</b>
                      : Nom de l'établissement / laboratoire qui
                      préfixe le titre du graphe (ex: name=Université de
                      Lorraine)
                      <i>défaut: Aucun</i>
                    </li>
                    <li>
                      <b>startYear</b>
                      : filtre sur l'année de publication
                      supérieure ou égale (ex: startYear=2016)
                      <i>défaut: 2013</i>
                    </li>
                  </ul>
                  <li>
                    Attention, seuls les graphes du BSO national sont
                    adaptables. Pour des raisons de manque de données, les
                    graphes relatifs au domaine de la santé ne seront pas
                    adaptables.
                  </li>
                  <li>
                    D'autre part, l'url doit être encodée. Pour ce faire, il
                    faut copier coller l'url composée dans un navigateur et
                    celui-ci la réécrira dans la barre d'adresse. C'est alors
                    cette URL réécrite qu'il faudra mettre dans l'attribut "src"
                    de l'iframe.
                  </li>
                </li>
              </ol>
              Exemple:
              {' '}
              <i>
                <a
                  href='https://bso.staging.dataesr.ovh/integration/fr/publi.general.dynamique-ouverture.chart-evolution-proportion?bsoLocalAffiliation=130015506&endYear=2019&displayTitle=false'
                  rel='noreferrer'
                  target='_blank'
                >
                  https://bso.staging.dataesr.ovh/integration/fr/publi.general.dynamique-ouverture.chart-evolution-proportion?bsoLocalAffiliation=130015506&endYear=2019&displayTitle=false
                </a>
              </i>
              <br />
              <br />
              <pre className='code'>
                &lt;iframe
                <br />
                <span style={{ paddingLeft: '18px' }} />
                id="publi.general.dynamique-ouverture.chart-evolution-proportion"
                <br />
                <span style={{ paddingLeft: '18px' }} />
                title="Université de Lorraine: Evolution du taux d'accès ouvert
                des publications scientifiques françaises par année
                d'observation"
                <br />
                <span style={{ paddingLeft: '18px' }} />
                width="800"
                <br />
                <span style={{ paddingLeft: '18px' }} />
                height="600"
                <br />
                <span style={{ paddingLeft: '18px' }} />
                src="https://bso.staging.dataesr.ovh/integration/fr/publi.general.dynamique-ouverture.chart-evolution-proportion?bsoLocalAffiliation=130015506&endYear=2019&displayTitle=false"
                <br />
                &gt;&lt;/iframe&gt;
              </pre>
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8'>
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
              Liste des déclinaisons locales des BSO :
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
                    href='https://www.pasteur.fr/fr/ceris/bibliotheque/s-engager-science-ouverte#barometre'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Institut Pasteur
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
                    href='https://www.biblio.univ-evry.fr/index.php/recherche-et-enseignement/science-ouverte/barometre-de-la-science-ouverte-evry/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université Evry Val d'Essone
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
                <li>
                  <a
                    href='https://www.cea.fr/chercheurs/Pages/information-scientifique/barometre-science-ouverte.aspx'
                    target='_blank'
                    rel='noreferrer'
                  >
                    CEA
                  </a>
                </li>
                <li>
                  <a
                    href='https://scienceouverte.univ-rennes1.fr/barometre-de-la-science-ouverte-de-luniversite-de-rennes-1'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université de Rennes 1
                  </a>
                </li>
                <li>
                  <a
                    href='https://www6.inrae.fr/dipso/La-science-ouverte-a-INRAE/Barometre-Science-Ouverte-INRAE'
                    target='_blank'
                    rel='noreferrer'
                  >
                    INRAE
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
                    href='https://www.imt-mines-albi.fr/barometre-science-ouverte-2021'
                    target='_blank'
                    rel='noreferrer'
                  >
                    IMT Mines Albi
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
                    href='https://bibliotheques.cnam.fr/opac/article/le-barometre-science-ouverte-du-cnam/5_so_barometre1'
                    target='_blank'
                    rel='noreferrer'
                  >
                    CNAM
                  </a>
                </li>
                <li>
                  <a
                    href='http://pole-ist.centralesupelec.fr/fr/node/430'
                    target='_blank'
                    rel='noreferrer'
                  >
                    CentraleSupélec
                  </a>
                </li>
                <li>
                  <a
                    href='https://guide-hal.univ-grenoble-alpes.fr/actualites/formations-et-evenements-uga/barometre-science-ouverte-de-l-uga-853860.kjsp'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Université Grenoble Alpes
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.science-ouverte.cnrs.fr/actualite/louverture-des-publications-progresse-au-cnrs/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    CNRS (pas nommé BSO mais ca en est un)
                  </a>
                </li>
                <li>
                  <a
                    href='https://espacechercheurs.enpc.fr/fr/plan-science-ouverte'
                    target='_blank'
                    rel='noreferrer'
                  >
                    ENPC (pas nommé BSO mais ca en est un, fait avec leur propre
                    méthodo)
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
