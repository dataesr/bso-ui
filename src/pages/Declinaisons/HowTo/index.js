import {
  Accordion,
  AccordionItem,
  Col,
  Container,
  Icon as DSIcon,
  Row,
} from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';
import Studio from '../../../components/Studio';
import SubmissionForm from '../../../components/SubmissionForm';

function HowTo() {
  const search = new URLSearchParams(useLocation().search);
  const expanded = search?.get('expanded') || 2;

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
        <section className='color-blue-dark-125 content pb-8'>
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
              <Accordion>
                <AccordionItem
                  initExpand={parseInt(expanded, 10) === 0}
                  title='1. Définissez le périmètre de votre BSO local'
                >
                  <ul className='style-disc'>
                    <li>
                      Un seul et unique fichier est attendu toutes années
                      confondues
                    </li>
                    <li>
                      Pour les publications, le baromètre couvre la période de
                      2013 à 2021, année de publication
                    </li>
                    <li>Aucune donnée concernant les APC n'est à fournir</li>
                    <li>Une déduplication des publications sera effectuée</li>
                    <li>
                      Chaque colonne du fichier est indépendante des autres
                    </li>
                    <li>
                      Chaque colonne peut contenir aucune, une ou plusieurs
                      valeurs
                    </li>
                    <li>
                      Une colonne vide peut être omise ou absente du fichier
                    </li>
                  </ul>
                  Le périmètre de chaque BSO local reste entièrement à la main
                  de l'établissement ou du laboratoire. Il est possible de
                  remonter une ou plusieurs des informations
                  {' '}
                  <b>complémentaires</b>
                  {' '}
                  suivantes :
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
                  <p>
                    Chaque information peut contenir une ou plusieurs valeurs.
                    Ces valeurs sont renseignées dans une colonne dédiée du
                    ficher.
                    <b> Chaque colonne est indépendante des autres.</b>
                  </p>
                  <p>
                    Chaque colonne permet de relier des productions à votre BSO
                    local. Ainsi, la colonne hal_struct_id permet par exemple de
                    relier automatiquement toutes les productions de HAL avec
                    cet identifiant à votre BSO local.
                  </p>
                  <p>
                    <table>
                      <thead>
                        <tr>
                          <th className='doiCol'>doi</th>
                          <th className='halStructCol'>hal_struct_id</th>
                          <th className='halCollCol'>hal_coll_code</th>
                          <th className='halIdCol'>hal_id</th>
                          <th className='nntEtabCol'>nnt_etab</th>
                          <th className='nntIdCol'>nnt_id</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className='doiCol'>
                            10.1016/j.chemgeo.2016.10.031
                          </td>
                          <td className='halStructCol'>413289</td>
                          <td className='halCollCol'>UNIV-LORRAINE</td>
                          <td> </td>
                          <td className='nntEtabCol'>LORR</td>
                          <td> </td>
                        </tr>
                        <tr>
                          <td className='doiCol'>
                            10.1371/journal.pone.0168349
                          </td>
                        </tr>
                        <tr>
                          <td className='doiCol'>
                            10.1016/j.jpowsour.2016.10.037
                          </td>
                        </tr>
                        <tr>
                          <td className='doiCol'>
                            10.1016/j.jpowsour.2016.10.035
                          </td>
                        </tr>
                        <tr>
                          <td className='doiCol'>10.1021/acs.jpcc.6b09974</td>
                        </tr>
                      </tbody>
                    </table>
                    Dans cet exemple, la colonne hal_id est vide (la colonne
                    peut être omise) car tous les liens sont gérés par
                    l'identifiant structure et collection. De même pour la
                    colonne nnt_id car le rattachement des thèses est géré dans
                    cet exemple uniquement par le code établissement.
                  </p>
                  <p>
                    <b>
                      Tout l'historique doit être fourni dans le fichier, pour
                      chaque mise à jour.
                      {' '}
                    </b>
                    Pour les publications, le baromètre couvre la période de
                    2013 à 2021, année de publication.
                  </p>
                  <p>
                    <b>
                      {' '}
                      Un seul fichier est attendu toutes années confondues.
                    </b>
                  </p>
                  <p>
                    Toutes ces informations doivent figurer dans un unique
                    fichier (voir exemple ci-dessous).
                  </p>
                  <p>
                    Afin de constituer votre périmètre de DOI, l'Université de
                    Lorraine propose cette méthodologie :
                    {' '}
                    <a
                      href='https://gitlab.com/Cthulhus_Queen/barometre_scienceouverte_universitedelorraine/'
                      target='_blank'
                      rel='noreferrer'
                    >
                      https://gitlab.com/Cthulhus_Queen/barometre_scienceouverte_universitedelorraine/
                    </a>
                    .
                  </p>
                  <p>
                    <b>
                      {' '}
                      NB: Aucune donnée concernant les APC n'est à fournir.
                    </b>
                  </p>
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
                </AccordionItem>
                <AccordionItem
                  initExpand={parseInt(expanded, 10) === 1}
                  title='2. Envoyez-nous votre fichier'
                >
                  <SubmissionForm />
                </AccordionItem>
                <AccordionItem
                  initExpand={parseInt(expanded, 10) === 2}
                  title='3. Intégrez directement les graphiques générés (via iFrame)'
                >
                  <Studio />
                </AccordionItem>
              </Accordion>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default HowTo;
