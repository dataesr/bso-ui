import {
  Breadcrumb,
  BreadcrumbItem,
  Col,
  Container,
  Row,
} from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import BannerData from '../../../components/BannerData';
import BSOChart from '../../../components/Charts';
import Glossary from '../../../components/Glossary';
import GlossaryFormattedMessage from '../../../components/Glossary/GlossaryFormattedMessage';
import GraphNavigation from '../../../components/GraphNavigation';
import GraphContent from '../../../components/GraphNavigation/GraphContent';
import GraphItem from '../../../components/GraphNavigation/GraphItem';
import QuestionSection from '../../../components/question-section';
import ScrollTop from '../../../components/ScrollTop';
import GlossaryEntries from '../../../translations/glossary.json';
import { mobileButtonLabel } from '../../../utils/constants';
import { getCSSValue, isInProduction } from '../../../utils/helpers';
import useLang from '../../../utils/Hooks/useLang';

export default function NationalResearchData() {
  const { lang } = useLang();
  const { pathname } = useLocation();
  const intl = useIntl();
  const blueSoft25 = getCSSValue('--blue-soft-25');
  const blueSoft50 = getCSSValue('--blue-soft-50');

  return (
    <Container fluid className='page'>
      <BannerData
        iconId='icon-data'
        selected='url.data.general'
        title='app.baro-national.data.title.beta'
      />
      <ScrollTop />
      <section className='content'>
        <Row>
          <Container>
            <Row>
              <Col n='12'>
                <Breadcrumb>
                  <BreadcrumbItem href='/' className='underline'>
                    {intl.formatMessage({
                      id: 'app.header.nav.about.data-and-code',
                    })}
                  </BreadcrumbItem>
                  <BreadcrumbItem href='#' className='bold'>
                    {intl.formatMessage({ id: 'app.baro-national.data.title' })}
                  </BreadcrumbItem>
                </Breadcrumb>
                <h1 className='contentTitle marianne-bold mb-32'>
                  <FormattedMessage id='app.baro-national.data.title' />
                  <span> </span>
                  <span className='beta-title'>
                    <FormattedMessage id='app.beta' />
                  </span>
                </h1>
                <p>
                  <GlossaryFormattedMessage
                    intlKey='app.baro-national.data.intro'
                    glossaryKeys={['grobid', 'datastet']}
                  />
                </p>
              </Col>
            </Row>
          </Container>
          <Glossary entries={GlossaryEntries} />
        </Row>
        <Row>
          <GraphNavigation mobileTitleIntl={mobileButtonLabel[lang][pathname]}>
            {/* Général */}
            <GraphItem
              mainLabel={intl.formatMessage({ id: 'app.data.general' })}
              paths={[
                '/donnees-de-la-recherche/general',
                '/research-data/general',
              ]}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/research-data/general?id=general.partage',
                    fr: '/donnees-de-la-recherche/general?id=general.partage',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.data.navigation.partage',
                  }),
                  href: {
                    en: '/research-data/general?id=general.partage',
                    fr: '/donnees-de-la-recherche/general?id=general.partage',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.data.navigation.utilisation',
                  }),
                  href: {
                    en: '/research-data/general?id=general.utilisation',
                    fr: '/donnees-de-la-recherche/general?id=general.utilisation',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.data.navigation.creation',
                  }),
                  href: {
                    en: '/research-data/general?id=general.creation',
                    fr: '/donnees-de-la-recherche/general?id=general.creation',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.data.navigation.statement',
                  }),
                  href: {
                    en: '/research-data/general?id=general.statement',
                    fr: '/donnees-de-la-recherche/general?id=general.statement',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  anchorId='general.partage'
                  backgroundColor={blueSoft50}
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  intlKey='app.national-data.general.partage'
                >
                  <BSOChart id='data.general.voies-ouverture.chart-data-shared' />
                  <BSOChart id='data.general.voies-ouverture.chart-data-shared-among-all' />
                </QuestionSection>
                <QuestionSection
                  anchorId='general.utilisation'
                  backgroundColor={blueSoft25}
                  glossaryKeys={['archive-ouverte']}
                  intlKey='app.national-data.general.utilisation'
                >
                  <BSOChart id='data.general.voies-ouverture.chart-data-used' />
                </QuestionSection>
                <QuestionSection
                  anchorId='general.creation'
                  backgroundColor={blueSoft50}
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  intlKey='app.national-data.general.creation'
                >
                  <BSOChart id='data.general.voies-ouverture.chart-data-created' />
                </QuestionSection>
                <QuestionSection
                  anchorId='general.statement'
                  backgroundColor={blueSoft25}
                  intlKey='app.national-data.general.statement'
                >
                  <BSOChart id='data.general.voies-ouverture.chart-availibility' />
                </QuestionSection>
                <QuestionSection
                  anchorId='general.mentions'
                  backgroundColor={blueSoft50}
                  intlKey='app.national-data.general.mentions'
                  isDisplayed={!isInProduction()}
                >
                  <BSOChart id='data.general.mentions.datasets-with-at-least-one-explicit-mention' />
                </QuestionSection>
                <QuestionSection
                  anchorId='general.repositories'
                  backgroundColor={blueSoft25}
                  intlKey='app.national-data.general.repositories'
                  isDisplayed={!isInProduction()}
                >
                  <BSOChart id='data.general.repositories.datasets-by-publisher' />
                  <BSOChart id='data.general.repositories.datasets-by-size' />
                  <BSOChart id='data.general.repositories.datasets-by-format' />
                  <BSOChart id='data.general.repositories.datasets-by-license' />
                  <BSOChart id='data.general.repositories.datasets-by-client-id' />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            {/* Les disciplines */}
            <GraphItem
              paths={[
                '/donnees-de-la-recherche/disciplines',
                '/research-data/fields',
              ]}
              mainLabel={intl.formatMessage({
                id: 'app.data.disciplines',
              })}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/research-data/fields?id=disciplines.utilisation',
                    fr: '/donnees-de-la-recherche/disciplines?id=disciplines.utilisation',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.data.navigation.disciplines.utilisation',
                  }),
                  href: {
                    en: '/research-data/fields?id=disciplines.utilisation',
                    fr: '/donnees-de-la-recherche/disciplines?id=disciplines.utilisation',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.data.navigation.disciplines.creation',
                  }),
                  href: {
                    en: '/research-data/fields?id=disciplines.creation',
                    fr: '/donnees-de-la-recherche/disciplines?id=disciplines.creation',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.data.navigation.disciplines.partage',
                  }),
                  href: {
                    en: '/research-data/fields?id=disciplines.partage',
                    fr: '/donnees-de-la-recherche/disciplines?id=disciplines.partage',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.data.navigation.disciplines.statement',
                  }),
                  href: {
                    en: '/research-data/fields?id=disciplines.statement',
                    fr: '/donnees-de-la-recherche/disciplines?id=disciplines.statement',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  anchorId='disciplines.utilisation'
                  backgroundColor={blueSoft50}
                  intlKey='app.national-data.disciplines.utilisation'
                >
                  <BSOChart id='data.disciplines.voies-ouverture.chart-data-used' />
                </QuestionSection>
                <QuestionSection
                  anchorId='disciplines.creation'
                  backgroundColor={blueSoft25}
                  intlKey='app.national-data.disciplines.creation'
                >
                  <BSOChart id='data.disciplines.voies-ouverture.chart-data-created' />
                </QuestionSection>
                <QuestionSection
                  anchorId='disciplines.partage'
                  backgroundColor={blueSoft50}
                  intlKey='app.national-data.disciplines.partage'
                >
                  <BSOChart id='data.disciplines.voies-ouverture.chart-data-shared' />
                  <BSOChart id='data.disciplines.voies-ouverture.chart-data-shared-among-all' />
                </QuestionSection>
                <QuestionSection
                  anchorId='disciplines.statement'
                  backgroundColor={blueSoft25}
                  glossaryKeys={['archive-ouverte']}
                  intlKey='app.national-data.disciplines.statement'
                >
                  <BSOChart id='data.disciplines.voies-ouverture.chart-availibility' />
                </QuestionSection>
                <QuestionSection
                  anchorId='disciplines.mentions'
                  backgroundColor={blueSoft50}
                  glossaryKeys={['archive-ouverte']}
                  intlKey='app.national-data.general.mentions'
                  isDisplayed={!isInProduction()}
                >
                  <BSOChart id='data.disciplines.mentions.datasets-with-at-least-one-explicit-mention' />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            {/* Les éditeurs */}
            <GraphItem
              paths={[
                '/donnees-de-la-recherche/editeurs',
                '/research-data/publishers',
              ]}
              mainLabel={intl.formatMessage({
                id: 'app.data.editeurs',
              })}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/research-data/publishers?id=editeurs.availibility',
                    fr: '/donnees-de-la-recherche/editeurs?id=editeurs.availibility',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.data.navigation.editeurs.statement',
                  }),
                  href: {
                    en: '/research-data/publishers?id=editeurs.availibility',
                    fr: '/donnees-de-la-recherche/editeurs?id=editeurs.availibility',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-data.editeurs.statement'
                  backgroundColor={blueSoft50}
                  anchorId='editeurs.availibility'
                >
                  <BSOChart id='data.editeurs.voies-ouverture.chart-availibility' />
                </QuestionSection>
              </GraphContent>
            </GraphItem>
          </GraphNavigation>
        </Row>
      </section>
    </Container>
  );
}
