import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import Banner from '../../../components/Banner';
// import ChartEvolutionStudies from '../../../components/Charts/studies/general/dynamique-ouverture/chart-evolution';
// import ChartRepartitionStudies from '../../../components/Charts/studies/general/trajectoires/chart-repartition';
import Chip from '../../../components/Chip';
// import DataCardSection from '../../../components/DataCardsSection';
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

function EssaisCliniques() {
  const { lang } = useLang();
  const location = useLocation();
  const intl = useIntl();

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-15'
          color1='blue-soft-125'
          color2='green-soft-50'
        />
      </Col>
    </Row>
  );

  return (
    <Container fluid className='page essais'>
      <Banner
        backgroundColor='blue-soft-100'
        supTitle={<FormattedMessage id='app.baro-sante.sub-title' />}
        title={<FormattedMessage id='app.header.nav.baro-sante-essais' />}
        chip={<Chip />}
        icons={renderIcons}
        selectNavigation={{
          title: <FormattedMessage id='app.navigation.objet-recherche' />,
          selected: intl.formatMessage({ id: 'url.sante.essais' }),
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
                  <FormattedMessage id='app.baro-sante.trials.main-title' />
                </h1>
                <p>
                  <GlossaryFormattedMessage
                    intlKey='app.baro-sante.trials-intro'
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
              id: 'app.health-trials.studies.general',
            })}
            paths={[
              '/sante/essais-cliniques/general',
              '/health/clinical-trials/general',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.health-trials.studies.navigation.general.dynamique',
                }),
                href: '/sante/essais-cliniques/general?id=general.dynamique',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-trials.studies.navigation.general.trajectoires',
                }),
                href: '/sante/essais-cliniques/general?id=general.directions',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.health-trials.studies.general.dynamique'
                backgroundColor={bluesoft50}
                anchorId='general.dynamique'
              >
                {/* <ChartGeneralEvolution
                  id='app.sante-trials.general.dynamique.chart-evolution'
                  domain='health'
                /> */}
                vide ---------
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-trials.studies.general.trajectoires'
                backgroundColor={bluesoft25}
                anchorId='general.directions'
              >
                {/* <ChartGeneralRepartition
                  id='app.sante-trials.general.directions.chart-repartition'
                  domain='health'
                /> */}
                vide
              </QuestionSection>
            </GraphContent>
          </GraphItem>

          {/* Leurs caractéristiques */}
          <GraphItem
            mainLabel={intl.formatMessage({
              id: 'app.health-trials.studies.caracteristiques',
            })}
            paths={[
              '/sante/essais-cliniques/caracteristiques',
              '/health/clinical-trials/specifications',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.health-trials.studies.navigation.caracteristiques.quand',
                }),
                href: '/sante/essais-cliniques/caracteristiques?id=caracteristiques.quand',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-trials.studies.navigation.caracteristiques.quand',
                }),
                href: '/sante/essais-cliniques/caracteristiques?id=caracteristiques.quand',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.sante-essays.general.dynamique-ouverture'
                backgroundColor={bluesoft50}
                anchorId='general.dynamique-ouverture'
              >
                {/* <ChartGeneralEvolution
                  id='app.sante-essays.general.dynamique-ouverture.chart-evolution'
                  domain='health'
                /> */}
                vide
              </QuestionSection>

              <QuestionSection
                intlKey='app.sante-essays.general.directions'
                backgroundColor={bluesoft25}
                anchorId='general.directions'
              >
                {/* <ChartGeneralRepartition
                  id='app.sante-essays.general.directions.chart-repartition'
                  domain='health'
                /> */}
                vide
              </QuestionSection>
            </GraphContent>
          </GraphItem>

          {/* Les lead sponsors */}
          <GraphItem
            mainLabel={intl.formatMessage({ id: 'app.publi.general' })}
            paths={[
              '/sante/essais-cliniques/general',
              '/health/clinical-trials/general',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.publi.navigation.essays.dynamique',
                }),
                href: '/sante/essais-cliniques/general?id=general.dynamique-ouverture',
              },
              {
                label: intl.formatMessage({
                  id: 'app.publi.navigation.essays.directions',
                }),
                href: '/sante/essais-cliniques/general?id=general.directions',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.sante-essays.general.dynamique-ouverture'
                backgroundColor={bluesoft50}
                anchorId='general.dynamique-ouverture'
              >
                {/* <ChartGeneralEvolution
                  id='app.sante-essays.general.dynamique-ouverture.chart-evolution'
                  domain='health'
                /> */}
                vide
              </QuestionSection>

              <QuestionSection
                intlKey='app.sante-essays.general.directions'
                backgroundColor={bluesoft25}
                anchorId='general.directions'
              >
                {/* <ChartGeneralRepartition
                  id='app.sante-essays.general.directions.chart-repartition'
                  domain='health'
                /> */}
                vide
              </QuestionSection>
            </GraphContent>
          </GraphItem>

          {/* Les resultats/publications */}
          <GraphItem
            mainLabel={intl.formatMessage({ id: 'app.publi.general' })}
            paths={[
              '/sante/essais-cliniques/general',
              '/health/clinical-trials/general',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.publi.navigation.essays.dynamique',
                }),
                href: '/sante/essais-cliniques/general?id=general.dynamique-ouverture',
              },
              {
                label: intl.formatMessage({
                  id: 'app.publi.navigation.essays.directions',
                }),
                href: '/sante/essais-cliniques/general?id=general.directions',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.sante-trials.general.dynamique-ouverture'
                backgroundColor={bluesoft50}
                anchorId='general.dynamique-ouverture'
              >
                {/* <ChartEvolutionStudies
                  id='studies.general.dynamique-ouverture.chart-evolution-studies'
                  studyType='Interventional'
                /> */}
              </QuestionSection>

              <QuestionSection
                intlKey='app.sante-essays.general.directions'
                backgroundColor={bluesoft25}
                anchorId='general.directions'
              >
                vide
                {/* <ChartRepartitionStudies
                  id='studies.general.trajectoires.chart-repartition-studies'
                  studyType='Interventional'
                /> */}
              </QuestionSection>
            </GraphContent>
          </GraphItem>
        </GraphNavigation>
      </section>
    </Container>
  );
}

export default EssaisCliniques;
