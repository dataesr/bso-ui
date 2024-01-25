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

import Banner from '../../../components/Banner';
import BSOChart from '../../../components/Charts';
import Chip from '../../../components/Chip';
import GlossaryFormattedMessage from '../../../components/Glossary/GlossaryFormattedMessage';
import GraphNavigation from '../../../components/GraphNavigation';
import GraphContent from '../../../components/GraphNavigation/GraphContent';
import GraphItem from '../../../components/GraphNavigation/GraphItem';
import Icon from '../../../components/Icon';
import QuestionSection from '../../../components/question-section';
import ScrollTop from '../../../components/ScrollTop';
import { mobileButtonLabel } from '../../../utils/constants';
import { getCSSValue, isInProduction } from '../../../utils/helpers';
import useLang from '../../../utils/Hooks/useLang';

export default function NationalOrcid() {
  const intl = useIntl();
  const { lang, urls } = useLang();
  const { pathname, search } = useLocation();
  const blueSoft25 = getCSSValue('--blue-soft-25');
  const blueSoft50 = getCSSValue('--blue-soft-50');

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters className='mb-32'>
      <Col n='12'>
        <Icon
          name='icon-these'
          color1='blue-soft-125'
          color2='publication-25'
        />
      </Col>
    </Row>
  );

  return (
    <Container fluid className='page'>
      <Banner
        backgroundColor='blue-soft-150'
        chip={<Chip />}
        homeLink={urls.national[lang] + search}
        icons={renderIcons}
        supTitle={<FormattedMessage id='app.header.title-national' />}
        title={<FormattedMessage id='app.baro-national.orcid.title' />}
      />
      <ScrollTop />
      <section className='content'>
        <Row>
          <Container>
            <Row>
              <Col n='12'>
                <Breadcrumb>
                  <BreadcrumbItem href='/' className='underline'>
                    {intl.formatMessage({ id: 'app.header.nav.orcid' })}
                  </BreadcrumbItem>
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
              ]}
            >
              <GraphContent>
                <QuestionSection
                  anchorId='general.users'
                  backgroundColor={blueSoft50}
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  intlKey='app.national-orcid.general.users'
                >
                  <BSOChart id='orcid.general.present.chart-indicator-these-year' />
                  <BSOChart id='orcid.general.present.chart-indicator-these-discipline' />
                  <BSOChart id='orcid.general.present.chart-evolution' />
                  <BSOChart id='orcid.general.creation-by-year' />
                  <BSOChart id='orcid.general.present.chart-indicator-active' />
                </QuestionSection>
                <QuestionSection
                  anchorId='general.publications'
                  backgroundColor={blueSoft25}
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  intlKey='app.national-orcid.general.publications'
                >
                  <BSOChart id='orcid.general.present.chart-indicator-work' />
                  <BSOChart id='orcid.general.present.chart-indicator-hal' />
                  <BSOChart id='orcid.general.present.chart-indicator-worksource' />
                </QuestionSection>
                <QuestionSection
                  anchorId='general.affiliations'
                  backgroundColor={blueSoft50}
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  intlKey='app.national-orcid.general.affiliations'
                >
                  <BSOChart id='orcid.general.present.chart-indicator-affiliationsource' />
                </QuestionSection>
              </GraphContent>
            </GraphItem>
            {/* Référentiels */}
            <GraphItem
              isDisplayed={!isInProduction()}
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
                  anchorId='referentiel.idref'
                  backgroundColor={blueSoft50}
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  intlKey='app.national-orcid.referentiel.idref'
                  isDisplayed={!isInProduction()}
                >
                  <BSOChart id='orcid.general.present.chart-indicator-idref-abes' />
                  <BSOChart id='orcid.general.present.chart-indicator-idref-hal' />
                  <BSOChart id='orcid.general.present.chart-indicator-idref-same' />
                </QuestionSection>
                <QuestionSection
                  anchorId='referentiel.idhal'
                  backgroundColor={blueSoft25}
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  intlKey='app.national-orcid.referentiel.idhal'
                  isDisplayed={!isInProduction()}
                >
                  <BSOChart id='orcid.general.present.chart-indicator-idhal-abes' />
                  <BSOChart id='orcid.general.present.chart-indicator-idhal-hal' />
                  <BSOChart id='orcid.general.present.chart-indicator-idhal-same' />
                </QuestionSection>
              </GraphContent>
            </GraphItem>
          </GraphNavigation>
        </Row>
      </section>
    </Container>
  );
}
