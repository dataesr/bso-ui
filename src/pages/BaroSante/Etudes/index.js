/* eslint-disable no-unused-vars */
import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import BannerHealth from '../../../components/BannerHealth';
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

function EtudesObservationnelles() {
  const { lang } = useLang();
  const location = useLocation();
  const intl = useIntl();
  const blueSoft25 = getCSSValue('--blue-soft-25');
  const blueSoft50 = getCSSValue('--blue-soft-50');

  return (
    <Container fluid>
      <BannerHealth
        selected='url.sante.etudes'
        title='app.header.nav.baro-sante-etudes'
      />
      <ScrollTop />
      <section className='content'>
        <Row>
          <Container>
            <Row>
              <Col n='12'>
                <h1 className='contentTitle marianne-bold mb-32'>
                  <FormattedMessage id='app.baro-sante.studies.main-title' />
                </h1>
                <p>
                  <GlossaryFormattedMessage
                    intlKey='app.baro-sante.studies-intro'
                    glossaryKey='acces-ouvert'
                  />
                </p>
              </Col>
            </Row>
          </Container>
          <Glossary entries={GlossaryEntries} />
        </Row>
        <GraphNavigation
          mobileTitleIntl={mobileButtonLabel[lang][location.pathname]}
        >
          <GraphItem
            mainLabel={intl.formatMessage({
              id: 'app.health-observational.general',
              default: 'mainLabel',
            })}
            paths={[
              '/sante/etudes-observationnelles/general',
              '/health/observational-studies/general',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.navigation.general.dynamique',
                  default: 'dynamique',
                }),
                href: '/sante/etudes-observationnelles/general?id=general.dynamique',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.navigation.general.trajectoires',
                  default: 'trajectoires',
                }),
                href: '/sante/etudes-observationnelles/general?id=general.directions',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.health-observational.general.dynamique'
                backgroundColor={blueSoft50}
                anchorId='general.dynamique'
              >
                <BSOChart
                  id='general.dynamique.chart-evolution'
                  domain='health'
                  studyType='Observational'
                />
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-observational.general.trajectoires'
                backgroundColor={blueSoft25}
                anchorId='general.directions'
              >
                <BSOChart
                  id='general.trajectoires.chart-repartition'
                  domain='health'
                  studyType='Observational'
                />
              </QuestionSection>
            </GraphContent>
          </GraphItem>

          {/* Leurs caractéristiques */}
          <GraphItem
            mainLabel={intl.formatMessage({
              id: 'app.health-observational.caracteristiques',
            })}
            paths={[
              '/sante/etudes-observationnelles/caracteristiques',
              '/health/observational-studies/specifications',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.navigation.caracteristiques.quand',
                }),
                href: '/sante/etudes-observationnelles/caracteristiques?id=caracteristiques.quand',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.navigation.caracteristiques.duree',
                }),
                href: '/sante/etudes-observationnelles/caracteristiques?id=caracteristiques.duree',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.navigation.caracteristiques.combien',
                }),
                href: '/sante/etudes-observationnelles/caracteristiques?id=caracteristiques.combien',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.navigation.caracteristiques.types',
                }),
                href: '/sante/etudes-observationnelles/caracteristiques?id=caracteristiques.types',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.health-observational.caracteristiques.quand'
                backgroundColor={blueSoft50}
                anchorId='caracteristiques.quand'
              >
                <BSOChart
                  id='caracteristiques.quand.chart-evolution-temporalites'
                  domain='health'
                  studyType='Observational'
                />
                <BSOChart
                  id='caracteristiques.quand.chart-repartition-avant-apres'
                  domain='health'
                  studyType='Observational'
                />
                <BSOChart
                  id='caracteristiques.quand.chart-distribution-declarations'
                  domain='health'
                  studyType='Observational'
                />
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-observational.caracteristiques.duree'
                backgroundColor={blueSoft25}
                anchorId='caracteristiques.duree'
              >
                <BSOChart
                  id='caracteristiques.duree.chart-nombre'
                  domain='health'
                  studyType='Observational'
                />
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-observational.caracteristiques.combien'
                backgroundColor={blueSoft50}
                anchorId='caracteristiques.combien'
              >
                <BSOChart
                  id='caracteristiques.combien.chart-groupes-patients'
                  domain='health'
                  studyType='Observational'
                />
              </QuestionSection>
            </GraphContent>
          </GraphItem>

          {/* Les promoteurs */}
          <GraphItem
            mainLabel={intl.formatMessage({
              id: 'app.health-observational.promoteurs',
            })}
            paths={[
              '/sante/etudes-observationnelles/promoteurs',
              '/health/observational-studies/lead-sponsors',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.navigation.promoteurs.dynamique-ouverture',
                }),
                href: '/sante/etudes-observationnelles/promoteurs?id=promoteurs.dynamique-ouverture',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.navigation.promoteurs.impact',
                }),
                href: '/sante/etudes-observationnelles/promoteurs?id=promoteurs.impact',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.health-observational.promoteurs.dynamique-ouverture'
                backgroundColor={blueSoft50}
                anchorId='promoteurs.dynamique-ouverture'
              >
                <BSOChart
                  id='promoteurs.dynamique-ouverture.chart-part'
                  domain='health'
                  studyType='Observational'
                />
                <BSOChart
                  id='promoteurs.dynamique-ouverture.chart-evolution-nombre'
                  domain='health'
                  studyType='Observational'
                />
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-observational.promoteurs.impact'
                backgroundColor={blueSoft25}
                anchorId='promoteurs.impact'
              >
                <BSOChart
                  id='promoteurs.impact.chart-repartition'
                  domain='health'
                  studyType='Observational'
                />
                { /*
                <BSOChart
                  id='promoteurs.impact.chart-classement-pays'
                  domain='health'
                  studyType='Observational'
                />
                */ }
              </QuestionSection>
            </GraphContent>
          </GraphItem>

          {/* Les resultats/publications */}
          <GraphItem
            mainLabel={intl.formatMessage({
              id: 'app.health-observational.resultats',
            })}
            paths={[
              '/sante/etudes-observationnelles/resultats',
              '/health/observational-studies/results',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.navigation.resultats.type-diffusion',
                }),
                href: '/sante/etudes-observationnelles/resultats?id=resultats.type-diffusion',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.navigation.resultats.plan-partage',
                }),
                href: '/sante/etudes-observationnelles/resultats?id=resultats.plan-partage',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.navigation.resultats.delai-diffusion',
                }),
                href: '/sante/etudes-observationnelles/resultats?id=resultats.delai-diffusion',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.navigation.resultats.publication',
                }),
                href: '/sante/etudes-observationnelles/resultats?id=resultats.publication',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.health-observational.resultats.type-diffusion'
                backgroundColor={blueSoft50}
                anchorId='resultats.type-diffusion'
              >
                <BSOChart
                  id='resultats.type-diffusion.chart-repartition'
                  domain='health'
                  studyType='Observational'
                />
                <BSOChart
                  id='resultats.type-diffusion.chart-repartition-par-type'
                  domain='health'
                  studyType='Observational'
                />
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-observational.resultats.plan-partage'
                backgroundColor={blueSoft25}
                anchorId='resultats.plan-partage'
              >
                <BSOChart
                  id='resultats.plan-partage.chart-repartition'
                  domain='health'
                  studyType='Observational'
                />
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-observational.resultats.delai-diffusion'
                backgroundColor={blueSoft50}
                anchorId='resultats.delai-diffusion'
              >
                <BSOChart
                  id='resultats.delai-diffusion.chart-repartition'
                  domain='health'
                  studyType='Observational'
                />
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-observational.resultats.publication'
                backgroundColor={blueSoft25}
                anchorId='resultats.publication'
              >
                <BSOChart
                  id='resultats.publication.chart-repartition'
                  domain='health'
                  studyType='Observational'
                />
              </QuestionSection>
            </GraphContent>
          </GraphItem>
        </GraphNavigation>
      </section>
    </Container>
  );
}

export default EtudesObservationnelles;
