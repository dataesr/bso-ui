import {
  Button,
  Col,
  Container,
  Icon as DSIcon,
  Row,
  Select,
  TextInput,
  Toggle,
} from '@dataesr/react-dsfr';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactDOMServer from 'react-dom/server';
import { FormattedMessage } from 'react-intl';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';
import downloadFile from '../../../utils/files';
import { getCSSValue } from '../../../utils/helpers';
import objects from './tree';

function HowTo() {
  const [bsoLocalAffiliation, setBsoLocalAffiliation] = useState('130015506');
  const [displayComment, setDisplayComment] = useState(true);
  const [displayFooter, setDisplayFooter] = useState(true);
  const [displayTitle, setDisplayTitle] = useState(false);
  const [endYear, setEndYear] = useState(2021);
  const [firstObservationYear, setFirstObservationYear] = useState(2018);
  const [lang, setLang] = useState('fr');
  const [lastObservationYear, setLastObservationYear] = useState(2022);
  const [object, setObject] = useState('publi');
  const [startYear, setStartYear] = useState(2013);
  const [tab, setTab] = useState('general');
  const [useHalId, setUseHalId] = useState(false);
  const langs = [
    { label: 'Français', value: 'fr' },
    { label: 'Anglais', value: 'en' },
  ];
  const observationYears = [2018, 2019, 2020, 2021, 2022].map((item) => ({
    label: item,
    value: item,
  }));
  const publicationYears = [
    2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022,
  ].map((item) => ({ label: item, value: item }));

  const tabs = objects?.find((item) => item.value === object)?.children || [];
  const graphs = tabs?.find((item) => item.value === tab)?.children || [];
  const [graph, setGraph] = useState(graphs[0].value || null);
  const changeTab = (t) => {
    setTab(t);
    const currentTabs = objects?.find((item) => item.value === object)?.children || [];
    const currentGraphs = currentTabs?.find((item) => item.value === t)?.children || [];
    setGraph(currentGraphs[0].value || null);
  };
  const changeObject = (o) => {
    setObject(o);
    const currentTabs = objects?.find((item) => item.value === o)?.children || [];
    const currentGraphs = currentTabs?.find((item) => item.value === currentTabs[0].value)
      ?.children || [];
    setGraph(currentGraphs[0].value || null);
  };
  const changeGraph = (g) => {
    setGraph(g);
  };

  const getGraphUrl = (graphId = null) => `${window.location.origin}/integration/${lang}/${
      graphId || graph
    }?bsoLocalAffiliation=${bsoLocalAffiliation}&displayComment=${displayComment}&displayTitle=${displayTitle}&displayFooter=${displayFooter}&endYear=${endYear}&lastObservationYear=${lastObservationYear}&startYear=${startYear}&firstObservationYear=${firstObservationYear}&useHalId=${useHalId}`;
  const getIframeSnippet = (graphId = null) => (
    <iframe
      height='860'
      id={graphId || graph}
      src={getGraphUrl(graphId)}
      title={graphId || graph}
      width='800'
    />
  );

  const csvContent = objects
    .reduce((acc, curr) => acc.concat(curr.children), [])
    .reduce((acc, curr) => acc.concat(curr.children), [])
    .map((item) => [item.label, getGraphUrl(item.value)].join(';'))
    .join('\n');

  const htmlContent = objects
    .reduce((acc, curr) => acc.concat(curr.children), [])
    .reduce((acc, curr) => acc.concat(curr.children), [])
    .map((item) => ReactDOMServer.renderToString(getIframeSnippet(item.value)));

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
              <h4 className='marianne-bold fs-24-32 bd125 mt-40' id='step_01'>
                A - Définition du périmètre du BSO local
              </h4>
              Le périmètre de chaque BSO local reste entièrement à la main de
              l'établissement ou du laboratoire. Il est possible de remonter une
              ou plusieurs des informations
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
                Chaque information peut contenir une ou plusieurs valeurs. Ces
                valeurs sont rensignées dans une colonne dédiée du ficher.
              </p>
              <p>
                Chaque information permet de collecter une liste de publications
                ou thèses. Ces listes de publications ou thèses sont aggrégées
                avant d'être dédupliquées.
              </p>
              <p>
                Pour les publications, nous remontons jusqu'à 2013, année de
                publication. Pour les thèses, nous remontons jusqu'à 2010, année
                de soutenance.
              </p>
              <p>
                Toutes ces informations doivent figurer dans un unique fichier
                (voir exemple ci-dessous).
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
              <h4 className='marianne-bold fs-24-32 bd125 mt-40' id='step_02'>
                B - Envoyez-nous votre fichier
              </h4>
              Une fois votre fichier réalisé, vous pouvez nous le transmettre
              par email
              {' '}
              <span className='underline marianne-bold'>
                <a href='mailto:bso@recherche.gouv.fr'>bso@recherche.gouv.fr</a>
              </span>
              {' '}
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
              <br />
              Vous pouvez nous envoyer votre fichier tout au long de l'année.
              Les dates de constitution et d'envoi de ce fichier n'ont pas
              d'incidence sur les graphiques générés car ceux-ci reposent sur
              des "snapshots" des outils utilisés (Unpaywall, PubMed...).
              <h4 className='marianne-bold fs-24-32 bd125 mt-40' id='step_03'>
                C - Intégration des graphiques générés (via iFrame)
              </h4>
              <br />
              <br />
              <section
                style={{
                  backgroundColor: getCSSValue('--blue-soft-25'),
                  padding: '28px',
                }}
              >
                <Row gutters>
                  <Col n='12 md-6'>
                    <TextInput
                      hint="Communiqué par l'équipe BSO si périmètre ad-hoc, ou identifiant de structure HAL, ou code collection HAL"
                      label="Identifiant de l'établissement"
                      message='Merci de saisir un identifiant'
                      messageType={bsoLocalAffiliation === '' ? 'error' : ''}
                      onChange={(e) => setBsoLocalAffiliation(e.target.value)}
                      required
                      style={{ backgroundColor: getCSSValue('--white') }}
                      value={bsoLocalAffiliation}
                    />
                  </Col>
                  <Col n='12 md-6'>
                    <Select
                      label='Langue'
                      onChange={(e) => setLang(e.target.value)}
                      options={langs}
                      selected={lang}
                      style={{
                        'margin-top': '50px',
                        backgroundColor: getCSSValue('--white'),
                      }}
                    />
                  </Col>
                </Row>
                <Row gutters>
                  <Col n='12 md-6'>
                    <Select
                      label='Objet de recherche'
                      hint='Les indicateurs sur les essais cliniques ne sont pas (encore) déclinables.'
                      onChange={(e) => changeObject(e.target.value)}
                      options={objects}
                      selected={object}
                      style={{ backgroundColor: getCSSValue('--white') }}
                    />
                  </Col>
                  <Col n='12 md-6'>
                    <Select
                      label='Onglet'
                      onChange={(e) => changeTab(e.target.value)}
                      options={tabs}
                      selected={tab}
                      style={{
                        'margin-top': '50px',
                        backgroundColor: getCSSValue('--white'),
                      }}
                    />
                  </Col>
                </Row>
                <Row gutters>
                  <Col n='12 md-12'>
                    <Select
                      label='Graphique'
                      onChange={(e) => changeGraph(e.target.value)}
                      options={graphs}
                      selected={graph}
                      style={{ backgroundColor: getCSSValue('--white') }}
                    />
                  </Col>
                </Row>
                <Row gutters>
                  <Col n='12 md-6'>
                    <Select
                      hint="Filtre sur l'année de publication supérieure ou égale"
                      label='Première année de publication'
                      onChange={(e) => setStartYear(e.target.value)}
                      options={publicationYears}
                      selected={startYear}
                      style={{ backgroundColor: getCSSValue('--white') }}
                    />
                  </Col>
                  <Col n='12 md-6'>
                    <Select
                      hint="Filtre sur l'année de publication inférieure ou égale"
                      label='Dernière année de publication'
                      message='Attention, la dernière année de publication doit être inférieure à la première année de publication'
                      messageType={endYear < startYear ? 'error' : ''}
                      onChange={(e) => setEndYear(e.target.value)}
                      options={publicationYears}
                      selected={endYear}
                      style={{ backgroundColor: getCSSValue('--white') }}
                    />
                  </Col>
                </Row>
                <Row gutters>
                  <Col n='12 md-6'>
                    <Select
                      hint="Filtre sur l'année d'observation inférieure ou égale"
                      label="Première année d'observation"
                      onChange={(e) => setFirstObservationYear(e.target.value)}
                      options={observationYears}
                      selected={firstObservationYear}
                      style={{ backgroundColor: getCSSValue('--white') }}
                    />
                  </Col>
                  <Col n='12 md-6'>
                    <Select
                      hint="Filtre sur l'année d'observation supérieure ou égale"
                      label="Dernière année d'observation"
                      onChange={(e) => setLastObservationYear(e.target.value)}
                      options={observationYears}
                      selected={lastObservationYear}
                      style={{ backgroundColor: getCSSValue('--white') }}
                      messageType={
                        lastObservationYear < firstObservationYear
                          ? 'error'
                          : ''
                      }
                      message="Attention, la dernière année d'observation doit être inférieure à la première année d'observation"
                    />
                  </Col>
                </Row>
                <hr />
                <Row gutters>
                  <Col n='12 md-6'>
                    <Toggle
                      checked={displayTitle}
                      hasLabelLeft
                      label='Affiche le titre du graphique'
                      onChange={() => setDisplayTitle(!displayTitle)}
                    />
                  </Col>
                  <Col n='12 md-6'>
                    <Toggle
                      checked={displayComment}
                      hasLabelLeft
                      label='Affiche le commentaire du graphique'
                      onChange={() => setDisplayComment(!displayComment)}
                    />
                  </Col>
                </Row>
                <hr />
                <Row gutters>
                  <Col n='12 md-6'>
                    <Toggle
                      checked={displayFooter}
                      hasLabelLeft
                      label='Affiche le footer du graphique'
                      onChange={() => setDisplayFooter(!displayFooter)}
                    />
                  </Col>
                  <Col n='12 md-6'>
                    <Toggle
                      checked={useHalId}
                      hasLabelLeft
                      label='Inclure les identifants de HAL'
                      onChange={() => setUseHalId(!useHalId)}
                    />
                  </Col>
                </Row>
                <Row gutters>
                  <Col n='12' className='studio'>
                    {getIframeSnippet()}
                  </Col>
                </Row>
                <Row gutters>
                  <Col n='12'>
                    <TextInput
                      disabled
                      hint='À copier/coller sur votre page web'
                      label="Code de l'iframe"
                      rows={7}
                      textarea
                      type='text'
                    >
                      {ReactDOMServer.renderToString(getIframeSnippet())}
                    </TextInput>
                  </Col>
                </Row>
                <Row gutters>
                  <Col n='12 md-6'>
                    <CopyToClipboard
                      text={ReactDOMServer.renderToString(getIframeSnippet())}
                    >
                      <Button icon='ri-clipboard-fill' iconPosition='right'>
                        Copier le code
                      </Button>
                    </CopyToClipboard>
                  </Col>
                </Row>
                <Row gutters>
                  <Col n='12 md-6'>
                    <Button
                      icon='ri-download-fill'
                      iconPosition='right'
                      onClick={() => downloadFile({
                        content: csvContent,
                        name: 'bso_urls.csv',
                        type: 'octet/stream',
                      })}
                    >
                      Télécharger la liste des urls des graphiques (.csv)
                    </Button>
                  </Col>
                  <Col n='12 md-6'>
                    <Button
                      icon='ri-download-fill'
                      iconPosition='right'
                      onClick={() => downloadFile({
                        content: htmlContent,
                        name: 'bso_graphs.html',
                        type: 'octet/stream',
                      })}
                    >
                      Télécharger la liste des graphiques (.html)
                    </Button>
                  </Col>
                </Row>
              </section>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default HowTo;
