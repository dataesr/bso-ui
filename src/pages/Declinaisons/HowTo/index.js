import { Col, Container, Icon as DSIcon, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';

function HowTo() {
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
        <section className='content py-48 bd125'>
          <Row gutters>
            <Col n='12 lg-8'>
              <h2 className='marianne-bold fs-12-16'>
                Déclinaisons locales du Baromètre de la Science Ouverte
              </h2>
              Les différents volets du BSO (hors essais cliniques et études
              observationnelles) sont déclinables pour chaque établissement ou
              laboratoire qui le souhaite.
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8'>
              <h4 className='marianne-bold fs-24-32 bd125' id='methodo'>
                A - Définition du périmètre du BSO local
              </h4>
              Le périmètre de chaque BSO local reste entièrement à la main de
              l'établissement. Il est possible de remonter plusieurs
              informations :
              <ul>
                <li>
                  -
                  <span className='marianne-bold'> liste de DOI </span>
                  (à partir des sources à votre disposition)
                  <em> ex: 10.1016/j.chemgeo.2016.10.031</em>
                </li>
                <li>
                  -
                  <span className='marianne-bold'>
                    {' '}
                    liste d'identifiants structure dans HAL (structId)
                    {' '}
                  </span>
                  <em> ex: 413289</em>
                </li>
                <li>
                  -
                  <span className='marianne-bold'>
                    {' '}
                    liste de codes collection dans HAL
                    {' '}
                  </span>
                  <em> ex: UNIV-LORRAINE </em>
                </li>
                <li>
                  -
                  <span className='marianne-bold'>
                    {' '}
                    liste d'identifiants HAL de publications
                    {' '}
                  </span>
                  <em> ex: hal-03651518</em>
                </li>
                <li>
                  -
                  <span className='marianne-bold'>
                    {' '}
                    liste de codes établissement pour les thèses
                    {' '}
                  </span>
                  <em> ex: LORR</em>
                </li>
                <li>
                  -
                  <span className='marianne-bold'>
                    {' '}
                    liste d'identifiants NNT pour les thèses
                    {' '}
                  </span>
                  <em> ex: 2019LORR0153</em>
                </li>
              </ul>
              <em>
                NB : Toutes les informations doivent figurer dans un seul
                fichier.
              </em>
              <Col offset='2 md-4'>
                <div className='button-link marianne-bold relative my-button'>
                  <DSIcon
                    className='ds-fr--v-middle'
                    size='xl'
                    name='ri-arrow-right-line'
                    iconPosition='right'
                  >
                    <a href='https://storage.gra.cloud.ovh.net/v1/AUTH_32c5d10cb0fe4519b957064a111717e3/bso_dump/BSO_local.csv'>
                      Voir un fichier d'exemple
                    </a>
                  </DSIcon>
                </div>
              </Col>
              <h4 className='marianne-bold fs-24-32 bd125' id='methodo'>
                B - Envoyez-nous votre fichier
              </h4>
              Une fois votre fichier réalisé, vous pouvez nous le transmettre
              par email
              <span className='underline marianne-bold'>
                <a href='mailto:bso@recherche.gouv.fr'>
                  {' '}
                  bso@recherche.gouv.fr
                  {' '}
                </a>
              </span>
              et nous
              <span className='marianne-bold'> préciser</span>
              :
              <ul>
                <li>
                  -
                  <span className='marianne-bold'>
                    {' '}
                    le nom complet de l'établissement
                  </span>
                </li>
                <li>
                  - (si besoin)
                  <span className='marianne-bold'>
                    {' '}
                    le nom court (ou acronyme) de l'établissement
                  </span>
                </li>
                <li>
                  -
                  <span className='marianne-bold'> la période couverte </span>
                  (années de publication couvertes)
                </li>
              </ul>
              Un meilleur système de remontée sera probablement mis en place
              dans le futur.
              <h4 className='marianne-bold fs-24-32 bd125' id='methodo'>
                C - Intégration des graphiques générés (via iFrame)
              </h4>
              Dès lors, chaque graphique du BSO publications est déclinable pour
              l'établissement / laboratoire. Ce graphique sera alors intégrable
              dans n'importe quel site web via une iFrame. Pour décliner un
              graphique, cliquer sur le bouton "Intégration" en bas du graphique
              voulu, afin de récupérer son url. Ensuite, ajouter à cette url
              l'identifiant Siren de la structure (ex:
              <i>bsoLocalAffiliation=130015506</i>
              {' '}
              pour l'Université de
              Lorraine). Par défaut, les éléments envoyés précédemment (nom,
              date de début et date de fin) seront intégrés pour cet
              établissement / laboratoire. Néanmoins, il est possible de les
              modifier directement dans l'URL via des paramètres :
              <ul>
                <li>
                  <b>bsoLocalAffiliation</b>
                  {' '}
                  : SIREN de l'établissement (ex:
                  bsoLocalAffiliation=130015506)
                  <i> requis</i>
                </li>
                <li>
                  <b>commentsName</b>
                  {' '}
                  : Nom de l'établissement / laboratoire qui
                  sera affiché dans les commentaires (ex: commentsName=de
                  l'université de Lorraine),
                  <i> défaut: vide</i>
                </li>
                <li>
                  <b>commentsNameEN</b>
                  {' '}
                  : Nom de l'établissement / laboratoire
                  qui sera affiché dans les commentaires en anglais (ex:
                  commentsName=of the university of Lorraine),
                  <i> défaut: vide</i>
                </li>
                <li>
                  <b>displayComment</b>
                  {' '}
                  : affiche ou masque le commentaire (ex:
                  displayComment=false),
                  <i> défaut: true</i>
                </li>
                <li>
                  <b>displayTitle</b>
                  {' '}
                  : affiche ou masque le titre (ex:
                  displayTitle=false),
                  <i> défaut: true</i>
                </li>
                <li>
                  <b>displayFooter</b>
                  {' '}
                  : affiche ou masque le footer (ex:
                  displayFooter=false),
                  <i> défaut: true</i>
                </li>
                <li>
                  <b>endYear</b>
                  {' '}
                  : filtre sur l'année d'observation inférieure
                  ou égale (ex: endYear=2020),
                  <i> défaut: vide</i>
                </li>
                <li>
                  <b>name</b>
                  {' '}
                  : Nom de l'établissement / laboratoire qui préfixe
                  le titre du graphe (ex: name=Université de Lorraine),
                  <i> défaut: vide</i>
                </li>
                <li>
                  <b>observationYear</b>
                  {' '}
                  : Dernière année d'observation à
                  prendre en compte,
                  <i> défaut: 2021</i>
                </li>
                <li>
                  <b>startYear</b>
                  {' '}
                  : première année de publication (ex:
                  startYear=2016),
                  <i> défaut: 2013</i>
                </li>
                <li>
                  <b>firstObservationYear</b>
                  {' '}
                  : première année d'observation
                  (ex: firstObservationYear=2019),
                  <i> défaut: 2018</i>
                </li>
              </ul>
              <li>
                Attention, seuls les graphes du BSO publications sont adaptables
                (et pas ceux concernant la santé).
              </li>
              <li>
                D'autre part, l'url doit être encodée. Pour ce faire, il faut
                copier coller l'url composée dans un navigateur et celui-ci la
                réécrira dans la barre d'adresse. C'est alors cette URL réécrite
                qu'il faudra mettre dans l'attribut "src" de l'iframe.
              </li>
              Exemple:
              {' '}
              <i>
                <a
                  href='https://barometredelascienceouverte.esr.gouv.fr/integration/fr/publi.general.dynamique-ouverture.chart-evolution-proportion?bsoLocalAffiliation=130015506&startYear=2016'
                  rel='noreferrer'
                  target='_blank'
                >
                  https://barometredelascienceouverte.esr.gouv.fr/integration/fr/publi.general.dynamique-ouverture.chart-evolution-proportion?bsoLocalAffiliation=130015506&startYear=2016
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
                src="https://barometredelascienceouverte.esr.gouv.fr/integration/fr/publi.general.dynamique-ouverture.chart-evolution-proportion?bsoLocalAffiliation=130015506&endYear=2019"
                <br />
                &gt;&lt;/iframe&gt;
              </pre>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default HowTo;
