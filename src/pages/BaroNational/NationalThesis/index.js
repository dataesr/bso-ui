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
import Glossary from '../../../components/Glossary';
import GlossaryFormattedMessage from '../../../components/Glossary/GlossaryFormattedMessage';
import GraphNavigation from '../../../components/GraphNavigation';
import GraphContent from '../../../components/GraphNavigation/GraphContent';
import GraphItem from '../../../components/GraphNavigation/GraphItem';
import QuestionSection from '../../../components/question-section';
import ScrollTop from '../../../components/ScrollTop';
import GlossaryEntries from '../../../translations/glossary.json';
import { mobileButtonLabel } from '../../../utils/constants';
import { getCSSValue } from '../../../utils/helpers';
import useLang from '../../../utils/Hooks/useLang';

export default function NationalThesis() {
  const { lang } = useLang();
  const { pathname } = useLocation();
  const intl = useIntl();
  const blueSoft50 = getCSSValue('--blue-soft-50');

  return (
    <Container fluid className='page'>
      <BannerNational
        selected='url.thesis.general'
        title='app.baro-national.thesis.title'
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
                  <BreadcrumbItem href='#' className='bold'>
                    {intl.formatMessage({
                      id: 'app.baro-national.thesis.title',
                    })}
                  </BreadcrumbItem>
                </Breadcrumb>
                <h1 className='contentTitle marianne-bold mb-32'>
                  <FormattedMessage id='app.baro-national.thesis.title' />
                </h1>
                <p>
                  <GlossaryFormattedMessage
                    intlKey='app.thesis.intro'
                    glossaryKeys={[]}
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
              mainLabel={intl.formatMessage({ id: 'app.thesis.general' })}
              paths={['/theses-de-doctorat/general', '/thesis/general']}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/thesis/general?id=general.dynamique',
                    fr: '/theses-de-doctorat/general?id=general.dynamique',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.thesis.navigation.dynamique',
                  }),
                  href: {
                    en: '/thesis/general?id=general.dynamique',
                    fr: '/theses-de-doctorat/general?id=general.dynamique',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.thesis.navigation.discipline',
                  }),
                  href: {
                    en: '/thesis/general?id=general.discipline',
                    fr: '/theses-de-doctorat/general?id=general.discipline',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-thesis.general.dynamique-ouverture'
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  backgroundColor={blueSoft50}
                  anchorId='general.dynamique'
                >
                  <BSOChart id='thesis.general.voies-ouverture.chart-repartition-taux' />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-thesis.general.discipline'
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  backgroundColor={blueSoft50}
                  anchorId='general.discipline'
                >
                  <BSOChart id='thesis.disciplines.voies-ouverture.chart-repartition-thesis' />
                </QuestionSection>
              </GraphContent>
            </GraphItem>
          </GraphNavigation>
        </Row>
      </section>
    </Container>
  );
}
