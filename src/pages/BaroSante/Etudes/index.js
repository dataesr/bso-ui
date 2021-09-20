import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import Banner from '../../../components/Banner';
// import DataCardSection from '../../../components/DataCardsSection';
import BSOChart from '../../../components/Charts';
import Chip from '../../../components/Chip';
import Glossary from '../../../components/Glossary';
import GlossaryFormattedMessage from '../../../components/Glossary/GlossaryFormattedMessage';
import GraphNavigation from '../../../components/GraphNavigation';
import GraphContent from '../../../components/GraphNavigation/GraphContent';
import GraphItem from '../../../components/GraphNavigation/GraphItem';
import Icon from '../../../components/Icon';
import QuestionSection from '../../../components/question-section';
import ScrollTop from '../../../components/ScrollTop';
import { bluesoft25, bluesoft50 } from '../../../style/colours.module.scss';
import GlossaryEntries from '../../../translations/glossary.json';
import { mobileButtonLabel } from '../../../utils/constants';
import useLang from '../../../utils/Hooks/useLang';

function EtudesObservationnelles() {
  const { lang } = useLang();
  const location = useLocation();
  const intl = useIntl();

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-17'
          color1='blue-soft-125'
          color2='orange-medium-75'
        />
      </Col>
    </Row>
  );

  return (
    <Container fluid>
      <Banner
        backgroundColor='blue-soft-100'
        supTitle={<FormattedMessage id='app.baro-sante.sub-title' />}
        title={<FormattedMessage id='app.header.nav.baro-sante-etudes' />}
        chip={<Chip />}
        icons={renderIcons}
        selectNavigation={{
          title: <FormattedMessage id='app.navigation.objet-recherche' />,
          selected: intl.formatMessage({ id: 'url.sante.etudes' }),
          options: [
            {
              label: intl.formatMessage({ id: 'app.baro-sante.title' }),
              value: intl.formatMessage({
                id: 'url.sante.publications.general',
              }),
            },
            {
              label: intl.formatMessage({
                id: 'app.baro-sante.trials.main-title',
              }),
              value: intl.formatMessage({ id: 'url.sante.essais' }),
            },
            {
              label: intl.formatMessage({
                id: 'app.baro-sante.studies.main-title',
              }),
              value: intl.formatMessage({ id: 'url.sante.etudes' }),
            },
          ],
        }}
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
          {/* <DataCardSection lang={lang} domain='health' /> */}
        </Row>
        <GraphNavigation
          mobileTitleIntl={mobileButtonLabel[lang][location.pathname]}
        >
          <GraphItem
            mainLabel={intl.formatMessage({
              id: 'app.health-observational.studies.general',
            })}
            paths={[
              '/sante/etudes-observationnelles/general',
              '/health/observational-studies/general',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.studies.navigation.general.dynamique',
                }),
                href: '/sante/etudes-observationnelles/general?id=general.dynamique',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.studies.navigation.general.trajectoires',
                }),
                href: '/sante/etudes-observationnelles/general?id=general.directions',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.health-observational.studies.general.dynamique'
                backgroundColor={bluesoft50}
                anchorId='general.dynamique'
              >
                <BSOChart
                  id='studies.general.dynamique.chart-evolution'
                  domain='health'
                  studyType='Observational'
                />

                <BSOChart
                  id='studies.general.trajectoires.chart-repartition'
                  domain='health'
                  studyType='Observational'
                />
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-observational.studies.general.trajectoires'
                backgroundColor={bluesoft25}
                anchorId='general.directions'
              >
                app.health-observational.studies.general.trajectoires.chart-repartition
              </QuestionSection>
            </GraphContent>
          </GraphItem>

          {/* Leurs caractéristiques */}
          <GraphItem
            mainLabel={intl.formatMessage({
              id: 'app.health-observational.studies.caracteristiques',
            })}
            paths={[
              '/sante/etudes-observationnelles/caracteristiques',
              '/health/observational-studies/specifications',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.studies.navigation.caracteristiques.quand',
                }),
                href: '/sante/etudes-observationnelles/caracteristiques?id=caracteristiques.quand',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.studies.navigation.caracteristiques.duree',
                }),
                href: '/sante/etudes-observationnelles/caracteristiques?id=caracteristiques.duree',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.studies.navigation.caracteristiques.combien',
                }),
                href: '/sante/etudes-observationnelles/caracteristiques?id=caracteristiques.combien',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.studies.navigation.caracteristiques.types',
                }),
                href: '/sante/etudes-observationnelles/caracteristiques?id=caracteristiques.types',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.health-observational.studies.caracteristiques.quand'
                backgroundColor={bluesoft50}
                anchorId='caracteristiques.quand'
              >
                app.health-observational.studies.caracteristiques.quand.chart-evolution-temporalites
                <br />
                app.health-observational.studies.caracteristiques.quand.chart-repartition-avant-apres
                <br />
                app.health-observational.studies.caracteristiques.quand.chart-distribution-declarations
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-observational.studies.caracteristiques.duree'
                backgroundColor={bluesoft25}
                anchorId='caracteristiques.duree'
              >
                app.health-observational.studies.caracteristiques.duree.chart-nombre
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-observational.studies.caracteristiques.combien'
                backgroundColor={bluesoft50}
                anchorId='caracteristiques.combien'
              >
                app.health-observational.studies.caracteristiques.combien.chart-groupes-patients
                <br />
                app.health-observational.studies.caracteristiques.combien.chart-proportion-modes-repartition
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-observational.studies.caracteristiques.types'
                backgroundColor={bluesoft25}
                anchorId='caracteristiques.types'
              >
                app.health-observational.studies.caracteristiques.types.chart-evolution-nombre
              </QuestionSection>
            </GraphContent>
          </GraphItem>

          {/* Les promoteurs */}
          <GraphItem
            mainLabel={intl.formatMessage({
              id: 'app.health-observational.studies.promoteurs',
            })}
            paths={[
              '/sante/etudes-observationnelles/promoteurs',
              '/health/observational-studies/lead-sponsors',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.studies.navigation.promoteurs.dynamique-ouverture',
                }),
                href: '/sante/etudes-observationnelles/promoteurs?id=promoteurs.dynamique-ouverture',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.studies.navigation.promoteurs.impact',
                }),
                href: '/sante/etudes-observationnelles/promoteurs?id=promoteurs.impact',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.health-observational.studies.promoteurs.dynamique-ouverture'
                backgroundColor={bluesoft50}
                anchorId='promoteurs.dynamique-ouverture'
              >
                app.health-observational.studies.promoteurs.dynamique-ouverture.chart-part
                <br />
                app.health-observational.studies.promoteurs.dynamique-ouverture.chart-evolution-nombre
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-observational.studies.promoteurs.impact'
                backgroundColor={bluesoft25}
                anchorId='promoteurs.impact'
              >
                app.health-observational.studies.promoteurs.impact.chart-repartition
                <br />
                app.health-observational.studies.promoteurs.impact.chart-classement-pays
              </QuestionSection>
            </GraphContent>
          </GraphItem>

          {/* Les resultats/publications */}
          <GraphItem
            mainLabel={intl.formatMessage({
              id: 'app.health-observational.studies.resultats',
            })}
            paths={[
              '/sante/etudes-observationnelles/resultats',
              '/health/observational-studies/results',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.studies.navigation.resultats.type-diffusion',
                }),
                href: '/sante/etudes-observationnelles/resultats?id=resultats.type-diffusion',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.studies.navigation.resultats.plan-partage',
                }),
                href: '/sante/etudes-observationnelles/resultats?id=resultats.plan-partage',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.studies.navigation.resultats.delai-diffusion',
                }),
                href: '/sante/etudes-observationnelles/resultats?id=resultats.delai-diffusion',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-observational.studies.navigation.resultats.publication',
                }),
                href: '/sante/etudes-observationnelles/resultats?id=resultats.publication',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.health-observational.studies.resultats.type-diffusion'
                backgroundColor={bluesoft50}
                anchorId='resultats.type-diffusion'
              >
                app.health-observational.studies.resultats.type-diffusion.chart-repartition
                <br />
                app.health-observational.studies.resultats.type-diffusion.chart-repartition-par-type
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-observational.studies.resultats.plan-partage'
                backgroundColor={bluesoft25}
                anchorId='resultats.plan-partage'
              >
                app.health-observational.studies.resultats.plan-partage.chart-repartition
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-observational.studies.resultats.delai-diffusion'
                backgroundColor={bluesoft50}
                anchorId='resultats.delai-diffusion'
              >
                app.health-observational.studies.resultats.delai-diffusion.chart-repartition
                <br />
                app.health-observational.studies.resultats.delai-diffusion.chart-distribution
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-observational.studies.resultats.publication'
                backgroundColor={bluesoft25}
                anchorId='resultats.publication'
              >
                app.health-observational.studies.resultats.publication.chart-repartition
                <br />
                app.health-observational.studies.resultats.publication.chart-repartition-icmje
              </QuestionSection>
            </GraphContent>
          </GraphItem>
        </GraphNavigation>
      </section>
    </Container>
  );
}

export default EtudesObservationnelles;
