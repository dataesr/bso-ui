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

import BannerNational from '../../../components/BannerNational';
import BSOChart from '../../../components/Charts';
import GlossaryFormattedMessage from '../../../components/Glossary/GlossaryFormattedMessage';
import GraphNavigation from '../../../components/GraphNavigation';
import GraphContent from '../../../components/GraphNavigation/GraphContent';
import GraphItem from '../../../components/GraphNavigation/GraphItem';
import QuestionSection from '../../../components/question-section';
import ScrollTop from '../../../components/ScrollTop';
import { mobileButtonLabel } from '../../../utils/constants';
import { getCSSValue, isInProduction } from '../../../utils/helpers';
import useLang from '../../../utils/Hooks/useLang';

export default function NationalOrcid() {
  const { lang } = useLang();
  const { pathname } = useLocation();
  const blueSoft50 = getCSSValue('--blue-soft-50');
  const intl = useIntl();

  return (
    <Container fluid className='page'>
      <BannerNational
        selected='url.thesis'
        title='app.baro-national.orcid.title'
        iconId='icon-these'
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
                      id: 'app.header.nav.baro-national-accueil',
                    })}
                  </BreadcrumbItem>
                  <BreadcrumbItem href='#'>></BreadcrumbItem>
                  <BreadcrumbItem href='#' className='bold'>
                    {intl.formatMessage({
                      id: 'app.baro-national.orcid.title',
                    })}
                  </BreadcrumbItem>
                </Breadcrumb>
                <h1 className='contentTitle marianne-bold mb-32'>
                  <FormattedMessage id='app.baro-national.orcid.title' />
                </h1>
                <p>
                  <GlossaryFormattedMessage
                    intlKey='app.orcid.intro'
                    glossaryKeys={[]}
                  />
                </p>
              </Col>
            </Row>
          </Container>
        </Row>
        <Row>
          <GraphNavigation mobileTitleIntl={mobileButtonLabel[lang][pathname]}>
            {/* Général */}
            <GraphItem
              mainLabel={intl.formatMessage({ id: 'app.orcid.general' })}
              paths={['/orcid/general']}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/orcid/general?id=general.users',
                    fr: '/orcid/general?id=general.users',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.orcid.navigation.users',
                  }),
                  href: {
                    en: '/orcid/general?id=general.users',
                    fr: '/orcid/general?id=general.users',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.orcid.navigation.publications',
                  }),
                  href: {
                    en: '/orcid/general?id=general.publications',
                    fr: '/orcid/general?id=general.publications',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.orcid.navigation.affiliations',
                  }),
                  href: {
                    en: '/orcid/general?id=general.affiliations',
                    fr: '/orcid/general?id=general.affiliations',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-orcid.general.users'
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  backgroundColor={blueSoft50}
                  anchorId='general.users'
                >
                  <BSOChart
                    id='orcid.general.present.chart-indicator-these-year'
                    isDisplayed={!isInProduction()}
                  />
                  <BSOChart
                    id='orcid.general.present.chart-indicator-these-discipline'
                    isDisplayed={!isInProduction()}
                  />
                  <BSOChart
                    id='orcid.general.present.chart-evolution'
                    isDisplayed={!isInProduction()}
                  />
                  <BSOChart
                    id='orcid.general.present.chart-indicator-active'
                    isDisplayed={!isInProduction()}
                  />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-orcid.general.publications'
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  backgroundColor={blueSoft50}
                  anchorId='general.publications'
                >
                  <BSOChart
                    id='orcid.general.present.chart-indicator-work'
                    isDisplayed={!isInProduction()}
                  />
                  <BSOChart
                    id='orcid.general.present.chart-indicator-hal'
                    isDisplayed={!isInProduction()}
                  />
                  <BSOChart
                    id='orcid.general.present.chart-indicator-worksource'
                    isDisplayed={!isInProduction()}
                  />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-orcid.general.affiliations'
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  backgroundColor={blueSoft50}
                  anchorId='general.affiliations'
                >
                  <BSOChart
                    id='orcid.general.present.chart-indicator-affiliationsource'
                    isDisplayed={!isInProduction()}
                  />
                </QuestionSection>
              </GraphContent>
            </GraphItem>
            {/* Référentiels */}
            <GraphItem
              mainLabel={intl.formatMessage({ id: 'app.orcid.referentiels' })}
              paths={['/orcid/referentiels']}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/orcid/referentiels?id=referentiel.idref',
                    fr: '/orcid/referentiels?id=referentiel.idref',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.orcid.navigation.idref',
                  }),
                  href: {
                    en: '/orcid/referentiels?id=referentiel.idref',
                    fr: '/orcid/referentiels?id=referentiel.idref',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.orcid.navigation.idhal',
                  }),
                  href: {
                    en: '/orcid/referentiels?id=referentiel.idhal',
                    fr: '/orcid/referentiels?id=referentiel.idhal',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-orcid.referentiel.idref'
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  backgroundColor={blueSoft50}
                  anchorId='referentiel.idref'
                >
                  <BSOChart
                    id='orcid.general.present.chart-indicator-idref-abes'
                    isDisplayed={!isInProduction()}
                  />
                  <BSOChart
                    id='orcid.general.present.chart-indicator-idref-hal'
                    isDisplayed={!isInProduction()}
                  />
                  <BSOChart
                    id='orcid.general.present.chart-indicator-idref-same'
                    isDisplayed={!isInProduction()}
                  />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-orcid.referentiel.idhal'
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  backgroundColor={blueSoft50}
                  anchorId='referentiel.idhal'
                >
                  <BSOChart
                    id='orcid.general.present.chart-indicator-idhal-abes'
                    isDisplayed={!isInProduction()}
                  />
                  <BSOChart
                    id='orcid.general.present.chart-indicator-idhal-hal'
                    isDisplayed={!isInProduction()}
                  />
                  <BSOChart
                    id='orcid.general.present.chart-indicator-idhal-same'
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
