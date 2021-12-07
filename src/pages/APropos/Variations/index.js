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
                      <b>name</b>
                      : Nom de l'établissement / laboratoire qui
                      préfixe le titre du graphe (ex: name=Université de
                      Lorraine)
                    </li>
                    <li>
                      <b>startYear</b>
                      : filtre sur l'année de publication
                      supérieure ou égale (ex: startYear=2016)
                    </li>
                    <li>
                      <b>endYear</b>
                      : filtre sur l'année de publication
                      inférieure ou égale (ex: endYear=2020)
                    </li>
                    <li>
                      <b>displayTitle</b>
                      : affiche ou masque le titre (ex:
                      displayTitle=false),
                      <i>default: true</i>
                    </li>
                  </ul>
                  <li>
                    Attention, seuls les graphes du BSO national sont
                    adaptables. Pour des raisons de manque de données, les
                    graphes relatifs au domaine de la santé ne seront pas
                    adaptables.
                  </li>
                </li>
              </ol>
              Exemple:
              {' '}
              <i>
                <a
                  href='https://bso.staging.dataesr.ovh/integration/fr/publi.general.dynamique-ouverture.chart-taux-ouverture?bsoLocalAffiliation=130015506&startYear=2016'
                  rel='noreferrer'
                  target='_blank'
                >
                  https://bso.staging.dataesr.ovh/integration/fr/publi.general.dynamique-ouverture.chart-taux-ouverture?bsoLocalAffiliation=130015506&startYear=2016
                </a>
              </i>
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
                <li>Université de Lorraine</li>
              </ul>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default Variations;
