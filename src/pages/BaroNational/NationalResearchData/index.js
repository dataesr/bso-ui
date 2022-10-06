import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import BannerNational from '../../../components/BannerNational';
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
      <BannerNational
        selected='url.data.general'
        title='app.baro-national.data.title'
      />
      <ScrollTop />
      <section className='content'>
        <Row>
          <Container>
            <Row>
              <Col n='12'>
                <h1 className='contentTitle marianne-bold mb-32'>
                  <FormattedMessage id='app.baro-national.data.title' />
                </h1>
                <p>
                  <GlossaryFormattedMessage
                    intlKey='app.researchdata.intro'
                    glossaryKeys={['acces-ouvert', 'publication-fr']}
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
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-data.general.partage'
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  backgroundColor={blueSoft50}
                  anchorId='general.partage'
                >
                  <BSOChart
                    id='data.general.voies-ouverture.chart-data-shared'
                    isDisplayed={!isInProduction()}
                  />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-data.general.utilisation'
                  glossaryKeys={['archive-ouverte']}
                  backgroundColor={blueSoft25}
                  anchorId='general.utilisation'
                >
                  <BSOChart
                    id='data.general.voies-ouverture.chart-data-used'
                    isDisplayed={!isInProduction()}
                  />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-data.general.availibility'
                  glossaryKeys={['archive-ouverte']}
                  backgroundColor={blueSoft25}
                  anchorId='general.availibility'
                >
                  <BSOChart
                    id='data.general.voies-ouverture.chart-availibility'
                    isDisplayed={!isInProduction()}
                  />
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
                    en: '/research-data/fields?id=disciplines.partage',
                    fr: '/donnees-de-la-recherche/disciplines?id=disciplines.partage',
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
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-data.disciplines.partage'
                  backgroundColor={blueSoft50}
                  anchorId='disciplines.partage'
                >
                  <BSOChart
                    id='data.disciplines.voies-ouverture.chart-data-shared'
                    isDisplayed={!isInProduction()}
                  />
                  <BSOChart
                    id='data.disciplines.voies-ouverture.chart-data-used'
                    isDisplayed={!isInProduction()}
                  />
                </QuestionSection>
              </GraphContent>
            </GraphItem>
          </GraphNavigation>
        </Row>
      </section>
    </Container>
  );
}
