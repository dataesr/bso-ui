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

export default function NationalSoftwareCode() {
  const { lang } = useLang();
  const { pathname } = useLocation();
  const intl = useIntl();
  const blueSoft25 = getCSSValue('--blue-soft-25');
  const blueSoft50 = getCSSValue('--blue-soft-50');

  return (
    <Container fluid className='page'>
      <BannerData
        iconId='icon-code'
        selected='url.software.general'
        title='app.baro-national.software.title.beta'
      />
      <ScrollTop />
      <section className='content'>
        <Row>
          <Container>
            <Row>
              <Col n='12'>
                <Breadcrumb>
                  <BreadcrumbItem href='/' className='underline'>
                    {intl.formatMessage({ id: 'app.header.nav.data-code' })}
                  </BreadcrumbItem>
                  <BreadcrumbItem href='#' className='bold'>
                    {intl.formatMessage({
                      id: 'app.baro-national.software.title.beta',
                    })}
                  </BreadcrumbItem>
                </Breadcrumb>
                <h1 className='contentTitle marianne-bold mb-32'>
                  <FormattedMessage id='app.baro-national.software.title' />
                  <span> </span>
                  <span className='beta-title'>
                    <FormattedMessage id='app.beta' />
                  </span>
                </h1>
                <p>
                  <GlossaryFormattedMessage
                    intlKey='app.baro-national.software.intro'
                    glossaryKeys={['grobid', 'softcite']}
                    ctas={[
                      'https://cloud.science-miner.com/software_kb_bso/frontend/index.html',
                    ]}
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
              mainLabel={intl.formatMessage({ id: 'app.software.general' })}
              paths={['/codes-et-logiciels/general', '/software/general']}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/software/general?id=general.partage',
                    fr: '/codes-et-logiciels/general?id=general.partage',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.software.navigation.partage',
                  }),
                  href: {
                    en: '/software/general?id=general.partage',
                    fr: '/codes-et-logiciels/general?id=general.partage',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.software.navigation.utilisation',
                  }),
                  href: {
                    en: '/software/general?id=general.utilisation',
                    fr: '/codes-et-logiciels/general?id=general.utilisation',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.software.navigation.creation',
                  }),
                  href: {
                    en: '/software/general?id=general.creation',
                    fr: '/codes-et-logiciels/general?id=general.creation',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-software.general.partage'
                  glossaryKeys={['grobid', 'softcite']}
                  backgroundColor={blueSoft50}
                  anchorId='general.partage'
                >
                  <BSOChart id='software.general.voies-ouverture.chart-software-shared' />
                  <BSOChart id='software.general.voies-ouverture.chart-software-shared-among-all' />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-software.general.utilisation'
                  glossaryKeys={['grobid', 'softcite']}
                  backgroundColor={blueSoft50}
                  anchorId='general.utilisation'
                >
                  <BSOChart id='software.general.voies-ouverture.chart-software-used' />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-software.general.creation'
                  glossaryKeys={['grobid', 'softcite']}
                  backgroundColor={blueSoft25}
                  anchorId='general.creation'
                >
                  <BSOChart id='software.general.voies-ouverture.chart-software-created' />
                </QuestionSection>
                <QuestionSection
                  anchorId='general.mentions'
                  backgroundColor={blueSoft50}
                  intlKey='app.national-software.general.mentions'
                  isDisplayed={!isInProduction()}
                >
                  <BSOChart id='software.general.mentions.software-with-at-least-one-explicit-mention' />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            {/* Les disciplines */}
            <GraphItem
              paths={['/codes-et-logiciels/disciplines', '/software/fields']}
              mainLabel={intl.formatMessage({
                id: 'app.software.disciplines',
              })}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/software/fields?id=disciplines.utilisation',
                    fr: '/codes-et-logiciels/disciplines?id=disciplines.utilisation',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.software.navigation.disciplines.utilisation',
                  }),
                  href: {
                    en: '/software/fields?id=disciplines.utilisation',
                    fr: '/codes-et-logiciels/disciplines?id=disciplines.utilisation',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.software.navigation.disciplines.creation',
                  }),
                  href: {
                    en: '/software/fields?id=disciplines.creation',
                    fr: '/codes-et-logiciels/disciplines?id=disciplines.creation',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.software.navigation.disciplines.partage',
                  }),
                  href: {
                    en: '/software/fields?id=disciplines.partage',
                    fr: '/codes-et-logiciels/disciplines?id=disciplines.partage',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-software.disciplines.utilisation'
                  backgroundColor={blueSoft50}
                  anchorId='disciplines.utilisation'
                >
                  <BSOChart id='software.disciplines.voies-ouverture.chart-software-used' />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-software.disciplines.creation'
                  backgroundColor={blueSoft25}
                  anchorId='disciplines.creation'
                >
                  <BSOChart id='software.disciplines.voies-ouverture.chart-software-created' />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-software.disciplines.partage'
                  backgroundColor={blueSoft50}
                  anchorId='disciplines.partage'
                >
                  <BSOChart id='software.disciplines.voies-ouverture.chart-software-shared' />
                  <BSOChart id='software.disciplines.voies-ouverture.chart-software-shared-among-all' />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            {/* Type OA */}
            {/*
            <GraphItem
              paths={['/codes-et-logiciels/oa', '/software/oa']}
              mainLabel={intl.formatMessage({
                id: 'app.software.oa',
              })}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/software/oa?id=disciplines.partage',
                    fr: '/codes-et-logiciels/oa?id=disciplines.partage',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.software.navigation.oa.partage',
                  }),
                  href: {
                    en: '/software/oa?id=disciplines.partage',
                    fr: '/codes-et-logiciels/oa?id=disciplines.partage',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-software.oa.partage'
                  backgroundColor={blueSoft50}
                  anchorId='oa.partage'
                >
                  <BSOChart
                    id='software.oa.voies-ouverture.chart-software-shared'
                    isDisplayed={!isInProduction()}
                  />
                </QuestionSection>
              </GraphContent>
            </GraphItem>
            */}
          </GraphNavigation>
        </Row>
      </section>
    </Container>
  );
}
