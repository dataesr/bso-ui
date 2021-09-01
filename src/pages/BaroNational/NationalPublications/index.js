import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import Banner from '../../../components/Banner';
import ChartEvolutionProportion from '../../../components/charts/publications/general/dynamique-ouverture/chart-evolution-proportion';
import ChartTauxOuverture from '../../../components/charts/publications/general/dynamique-ouverture/chart-taux-ouverture';
import ChartGenreOuverture from '../../../components/charts/publications/general/genres-ouverture/genres-ouverture';
import ChartRepartitionDeclarations from '../../../components/charts/publications/general/impact-financement/chart-repartition-declarations';
import ChartTauxOuvertureFinancement from '../../../components/charts/publications/general/impact-financement/chart-taux-ouverture';
import ChartLanguesOuverture from '../../../components/charts/publications/general/langues-ouverture/langues-ouverture';
import ChartEvolutionTaux from '../../../components/charts/publications/general/voies-ouverture/chart-evolution-taux';
import ChartRepartitionPublications from '../../../components/charts/publications/general/voies-ouverture/chart-repartition-publications';
import ChartRepartitionTaux from '../../../components/charts/publications/general/voies-ouverture/chart-repartition-taux';
import Chip from '../../../components/Chip';
import DataCardSection from '../../../components/DataCardsSection';
import Glossary from '../../../components/Glossary';
import GlossaryFormattedMessage from '../../../components/Glossary/GlossaryFormattedMessage';
import GraphNavigation from '../../../components/GraphNavigation';
import GraphContent from '../../../components/GraphNavigation/GraphContent';
import GraphItem from '../../../components/GraphNavigation/GraphItem';
import Icon from '../../../components/Icon';
import QuestionSection from '../../../components/question-section';
import ScrollTop from '../../../components/ScrollTop';
import urls from '../../../config/urls';
import { bluesoft25, bluesoft50 } from '../../../style/colours.module.scss';
import GlossaryEntries from '../../../translations/glossary.json';
import useLang from '../../../utils/Hooks/useLang';

const objButtonLabel = {
  fr: {
    '/publications/disciplines': 'app.publi.disciplines',
    '/publications/affiliations': 'app.publi.affiliations',
    '/publications/editeurs': 'app.publi.editeurs',
    '/publications/general': 'app.publi.general',
    '/publications/archives': 'app.publi.archives',
  },
  en: {
    '/publications/disciplines': 'app.publi.disciplines',
    '/publications/affiliations': 'app.publi.affiliations',
    '/publications/archives': 'app.publi.archives',
    '/publications/editeurs': 'app.publi.editeurs',
    '/publications/general': 'app.publi.general',
  },
};

export default function NationalPublications() {
  const { lang } = useLang();
  const location = useLocation();
  const intl = useIntl();

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-28'
          color1='blue-soft-125'
          color2='publication-25'
        />
      </Col>
    </Row>
  );

  return (
    <Container fluid className='page'>
      <Banner
        backgroundColor='blue-dark-100'
        homeLink={urls.sante[lang]}
        supTitle={<FormattedMessage id='app.header.title-national' />}
        title={<FormattedMessage id='app.baro-national.title' />}
        chip={<Chip />}
        icons={renderIcons}
      />
      <ScrollTop />
      <section className='content'>
        <Row>
          <Container>
            <Row>
              <Col n='12'>
                <h1 className='contentTitle marianne-bold mb-32'>
                  <FormattedMessage id='app.baro-national.main-title' />
                </h1>
                <p>
                  <GlossaryFormattedMessage
                    intlKey='app.baro-national.intro'
                    glossaryKey='acces-ouvert'
                  />
                </p>
              </Col>
            </Row>
          </Container>
          <Glossary entries={GlossaryEntries} />
          <Container>
            <DataCardSection lang={lang} />
          </Container>
        </Row>
        <Row>
          <GraphNavigation
            mobileTitleIntl={objButtonLabel[lang][location.pathname]}
          >
            <GraphItem
              mainLabel={intl.formatMessage({ id: 'app.publi.general' })}
              paths={['/publications/general', '/publications/general']}
              links={[
                {
                  label: 'La dynamique d’ouverture en santé',
                  href: '/publications/general#dynamique',
                },
                {
                  label: "Les voies d'ouverture",
                  href: '/publications/general#voies',
                },
                {
                  label: 'Les genres les plus ouverts',
                  href: '/publications/general#genres',
                },
                {
                  label: 'Les langues des productions',
                  href: '/publications/general#langues',
                },
                {
                  label: 'Le financement',
                  href: '/publications/general#financement',
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-publi.general.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='dynamique'
                >
                  <ChartTauxOuverture />
                  <ChartEvolutionProportion />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-publi.general.voies-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='voies'
                >
                  <ChartRepartitionTaux />
                  <ChartEvolutionTaux />
                  <ChartRepartitionPublications />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-publi.general.genres-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='genres'
                >
                  <ChartGenreOuverture />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-publi.general.langues-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='langues'
                >
                  <ChartLanguesOuverture />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.general.impact-financement'
                  backgroundColor={bluesoft50}
                  anchorId='financement'
                >
                  <ChartTauxOuvertureFinancement />
                  <ChartRepartitionDeclarations />
                </QuestionSection>
              </GraphContent>
            </GraphItem>
          </GraphNavigation>
        </Row>
      </section>
    </Container>
  );
}
