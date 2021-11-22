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
                  <a
                    href='https://gitlab.com/Cthulhus_Queen/barometre_science
                    ouverte_universitedelorraine/-/blob/ master/01_nettoyage_
                    donnees.ipynb'
                    target='_blank'
                    rel='noreferrer'
                  >
                    parvenir une liste de DOI (csv ou excel)
                  </a>
                  , et nous précise le nom qui sera affiché pour
                  l'établissement, la date de début ainsi que la date de fin si
                  nécessaire.
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
                  <i>bso-local-affiliations=130015506</i>
                  {' '}
                  pour l'Université de
                  Lorraine).
                </li>
                <li>
                  Par défaut, les éléments envoyés précédemment (nom, date de
                  déut et date de fin), seront intégrés par défaut pour cet
                  établissement / laboratoire. Néanmoins, il est possible de les
                  surcharger via des paramètres de l'url :
                  <ul>
                    <li>
                      <b>name</b>
                      : Nom de l'établissement / laboratoire qui
                      préfixe le titre du graphe (ex: name=Université de
                      Lorraine)
                    </li>
                    <li>
                      <b>start-year</b>
                      : filtre sur l'année de publication
                      supérieure ou égale (ex: start-year=2016)
                    </li>
                    <li>
                      <b>end-year</b>
                      : filtre sur l'année de publication
                      inférieure ou égale (ex: end-year=2020)
                    </li>
                  </ul>
                  <li>
                    Attention, seuls les graphes du BSO national adaptables.
                    Pour des raisons de manque de données, les graphes relatifs
                    au domaine de la santé ne seront pas daptables.
                  </li>
                </li>
              </ol>
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8'>
              Liste des déclinaisons locales des BSO :
              <ul>
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
