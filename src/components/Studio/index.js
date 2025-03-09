import {
  Button,
  Col,
  Row,
  Select,
  TextInput,
  Toggle,
} from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useIntl } from 'react-intl';

import downloadFile from '../../utils/files';
import {
  getCSSValue,
  getObservationLabel,
  isInProduction,
} from '../../utils/helpers';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import tree from './tree';

const Studio = () => {
  const intl = useIntl();
  const { lastObservationSnap } = useGlobals();
  const [bsoLocalAffiliation, setBsoLocalAffiliation] = useState('130015506'); // University of Lorraine
  const [displayComment, setDisplayComment] = useState(true);
  const [displayFooter, setDisplayFooter] = useState(true);
  const [displayTitle, setDisplayTitle] = useState(false);
  const [endYear, setEndYear] = useState();
  const [lang, setLang] = useState('fr');
  const [object, setObject] = useState('publi');
  const [observationYearFirst, setObservationYearFirst] = useState('2018');
  const [observationYearLast, setObservationYearLast] = useState();
  const [observationYears, setObservationYears] = useState([]);
  const [publicationYears, setPublicationYears] = useState([]);
  const [startYear, setStartYear] = useState('2013');
  const [tab, setTab] = useState('general');
  const [useHalId, setUseHalId] = useState(false);

  useEffect(() => {
    const lastObservationYearTmp = getObservationLabel(
      lastObservationSnap > process.env.REACT_APP_LAST_OBSERVATION
        ? process.env.REACT_APP_LAST_OBSERVATION
        : lastObservationSnap,
    );
    setObservationYearLast(lastObservationYearTmp);
    const observationYearsTmp = [
      ...Array(
        // Number(lastObservationYearTmp) - Number(observationYearFirst) + 1,
        2024 - Number(observationYearFirst) + 1,
      ).keys(),
    ].map((item) => ({
      label: `${item + Number(observationYearFirst)}`,
      value: `${item + Number(observationYearFirst)}`,
    }));
    observationYearsTmp.push({
      label: "Date d'observation utilisée dans le baromètre national",
      value: 'latest',
    });
    setObservationYears(observationYearsTmp);
    const publicationYearsTmp = [
      // ...Array(Number(lastObservationYearTmp) - Number(startYear)).keys(),
      ...Array(2024 - Number(startYear)).keys(),
    ].map((item) => ({
      label: `${item + Number(startYear)}`,
      value: `${item + Number(startYear)}`,
    }));
    publicationYearsTmp.push({
      label: 'Date de publication utilisée dans le baromètre national',
      value: 'latest',
    });
    setEndYear(publicationYearsTmp[publicationYearsTmp.length - 2].value);
    setPublicationYears(publicationYearsTmp);
  }, [observationYearFirst, lastObservationSnap, startYear]);

  const commentsName = intl.formatMessage({
    id: 'app.french',
    defaultMessage: 'françaises',
  });
  const langs = [
    { label: 'Français', value: 'fr' },
    { label: 'Anglais', value: 'en' },
  ];
  const values = {
    archiveTitle: '',
    commentsName,
    observationYear: observationYearLast,
    publicationYear: endYear,
    publisherTitle: '',
  };

  const objects = tree
    .filter((item) => !isInProduction() || (item?.isInProduction ?? true))
    .map((item) => ({
      ...item,
      label: intl.formatMessage({ id: item.key }, values),
    }));
  let tabs = objects?.find((item) => item.value === object)?.children || [];
  tabs = tabs.map((item) => ({
    ...item,
    label: intl.formatMessage({ id: item.key }, values),
  }));
  let graphs = tabs?.find((item) => item.value === tab)?.children || [];
  graphs = graphs.map((item) => ({
    ...item,
    label: intl.formatMessage({ id: item.key }, values),
  }));
  const [graph, setGraph] = useState(graphs[0].value || null);
  const changeObject = (o) => {
    setObject(o);
    const currentTabs = objects?.find((item) => item.value === o)?.children || [];
    setTab(currentTabs[0].value || []);
    const currentGraphs = currentTabs?.find((item) => item.value === currentTabs[0].value)
      ?.children || [];
    setGraph(currentGraphs[0].value || null);
  };
  const changeTab = (t) => {
    setTab(t);
    const currentTabs = objects?.find((item) => item.value === object)?.children || [];
    const currentGraphs = currentTabs?.find((item) => item.value === t)?.children || [];
    setGraph(currentGraphs[0].value || null);
  };
  const changeGraph = (g) => {
    setGraph(g);
  };

  const getGraphUrl = (graphId = null) => `${window.location.origin}/integration/${lang}/${
      graphId || graph
    }?bsoLocalAffiliation=${bsoLocalAffiliation}&displayComment=${displayComment}&displayTitle=${displayTitle}&displayFooter=${displayFooter}&endYear=${endYear}&lastObservationYear=${observationYearLast}&startYear=${startYear}&firstObservationYear=${observationYearFirst}&useHalId=${useHalId}`;

  const getIframeSnippet = (graphId = null) => (
    <iframe
      height='860'
      id={graphId || graph}
      src={getGraphUrl(graphId)}
      title={graphId || graph}
      width='800'
    />
  );

  const getIframeText = (graphId = null) => `<iframe height="860" id="${graphId || graph}" src="${getGraphUrl(
    graphId,
  ).replace(/&/g, '&amp;')}" title="${
      graphId || graph
    }" width="800"></iframe>`;

  const csvContent = objects
    .reduce((acc, curr) => acc.concat(curr.children), [])
    .reduce((acc, curr) => acc.concat(curr.children), [])
    .map((item) => [item.label, getGraphUrl(item.value)].join(';'))
    .join('\n');

  const htmlContent = objects
    .reduce((acc, curr) => acc.concat(curr.children), [])
    .reduce((acc, curr) => acc.concat(curr.children), [])
    .map((item) => getIframeText(item.value));

  return (
    <section
      style={{
        backgroundColor: getCSSValue('--blue-soft-25'),
        padding: '28px',
      }}
    >
      <Row gutters>
        <Col n='12 md-6'>
          <TextInput
            hint="Si périmètre ad-hoc, identifiant communiqué par l'équipe BSO ou RoR. Dans tous les cas, identifiant de structure HAL, ou code collection HAL"
            label="Identifiant de l'établissement (ou de structure ou collection HAL)"
            message='Merci de saisir un identifiant'
            messageType={bsoLocalAffiliation === '' ? 'error' : null}
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
              marginTop: '71px',
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
              marginTop: '51px',
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
            disabled={object !== 'publi'}
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
            disabled={object !== 'publi'}
            hint="Filtre sur l'année de publication inférieure ou égale"
            label='Dernière année de publication'
            message='Attention, la dernière année de publication doit être inférieure à la première année de publication'
            messageType={endYear < startYear ? 'error' : null}
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
            disabled={object !== 'publi'}
            hint="Filtre sur l'année d'observation inférieure ou égale"
            label="Première année d'observation"
            onChange={(e) => setObservationYearFirst(e.target.value)}
            options={observationYears}
            selected={observationYearFirst}
            style={{ backgroundColor: getCSSValue('--white') }}
          />
        </Col>
        <Col n='12 md-6'>
          <Select
            disabled={object !== 'publi'}
            hint="Filtre sur l'année d'observation supérieure ou égale"
            label="Dernière année d'observation"
            message="Attention, la dernière année d'observation doit être inférieure à la première année d'observation"
            messageType={
              observationYearLast < observationYearFirst ? 'error' : null
            }
            onChange={(e) => setObservationYearLast(e.target.value)}
            options={observationYears}
            selected={observationYearLast}
            style={{ backgroundColor: getCSSValue('--white') }}
          />
        </Col>
      </Row>
      <hr />
      <Row gutters>
        <Col n='12 md-6'>
          <Toggle
            checked={displayTitle}
            hasLabelLeft
            label='Afficher "Baromètre français de la Science Ouverte"'
            onChange={() => setDisplayTitle(!displayTitle)}
          />
        </Col>
        <Col n='12 md-6'>
          <Toggle
            checked={displayComment}
            hasLabelLeft
            label='Afficher le commentaire du graphique'
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
            label='Afficher le footer du graphique'
            onChange={() => setDisplayFooter(!displayFooter)}
          />
        </Col>
        {object === 'publi' && (
          <Col n='12 md-6'>
            <Toggle
              checked={useHalId}
              hasLabelLeft
              label='Inclure les identifiants de HAL'
              onChange={() => setUseHalId(!useHalId)}
            />
          </Col>
        )}
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
            value={getIframeText()}
          />
        </Col>
      </Row>
      <Row gutters>
        <Col n='12 md-6'>
          <CopyToClipboard text={getIframeText()}>
            <Button icon='ri-clipboard-fill' iconPosition='right'>
              Copier le code de l'iframe
            </Button>
          </CopyToClipboard>
        </Col>
        <Col n='12 md-6'>
          <CopyToClipboard text={getGraphUrl()}>
            <Button icon='ri-clipboard-fill' iconPosition='right'>
              Copier l'url
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
  );
};

export default Studio;
