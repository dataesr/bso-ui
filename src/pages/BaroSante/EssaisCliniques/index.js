import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import Banner from '../../../components/Banner';
import BSOChart from '../../../components/Charts';
import Chip from '../../../components/Chip';
// import DataCardSection from '../../../components/DataCardsSection';
// import Glossary from '../../../components/Glossary';
import GlossaryFormattedMessage from '../../../components/Glossary/GlossaryFormattedMessage';
import GraphNavigation from '../../../components/GraphNavigation';
import GraphContent from '../../../components/GraphNavigation/GraphContent';
import GraphItem from '../../../components/GraphNavigation/GraphItem';
import Icon from '../../../components/Icon';
import QuestionSection from '../../../components/question-section';
import ScrollTop from '../../../components/ScrollTop';
// import GlossaryEntries from '../../../translations/glossary.json';
import { mobileButtonLabel } from '../../../utils/constants';
import { getCSSValue } from '../../../utils/helpers';
import useLang from '../../../utils/Hooks/useLang';

function EssaisCliniques() {
  const { lang } = useLang();
  const location = useLocation();
  const intl = useIntl();
  const blueSoft25 = getCSSValue('--blue-soft-25');
  const blueSoft50 = getCSSValue('--blue-soft-50');

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
        supTitle={<FormattedMessage id='app.header.title-health' />}
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
          {/* <Glossary entries={GlossaryEntries} /> */}
          {/* <DataCardSection lang={lang} domain='health' /> */}
        </Row>
        <GraphNavigation
          mobileTitleIntl={mobileButtonLabel[lang][location.pathname]}
        >
          <GraphItem
            mainLabel={intl.formatMessage({
              id: 'app.health-interventional.studies.general',
            })}
            paths={[
              '/sante/essais-cliniques/general',
              '/health/clinical-trials/general',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.health-interventional.studies.navigation.general.dynamique',
                }),
                href: '/sante/essais-cliniques/general?id=general.dynamique',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-interventional.studies.navigation.general.trajectoires',
                }),
                href: '/sante/essais-cliniques/general?id=general.directions',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.health-interventional.studies.general.dynamique'
                backgroundColor={blueSoft50}
                anchorId='general.dynamique'
              >
                <BSOChart
                  id='studies.general.dynamique.chart-evolution'
                  domain='health'
                  studyType='Interventional'
                />

              </QuestionSection>

              <QuestionSection
                intlKey='app.health-interventional.studies.general.trajectoires'
                backgroundColor={blueSoft25}
                anchorId='general.directions'
              >
                <BSOChart
                  id='studies.general.trajectoires.chart-repartition'
                  domain='health'
                  studyType='Interventional'
                />
              </QuestionSection>
            </GraphContent>
          </GraphItem>

          {/* Leurs caractéristiques */}
          <GraphItem
            mainLabel={intl.formatMessage({
              id: 'app.health-interventional.studies.caracteristiques',
            })}
            paths={[
              '/sante/essais-cliniques/caracteristiques',
              '/health/clinical-trials/specifications',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.health-interventional.studies.navigation.caracteristiques.quand',
                }),
                href: '/sante/essais-cliniques/caracteristiques?id=caracteristiques.quand',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-interventional.studies.navigation.caracteristiques.duree',
                }),
                href: '/sante/essais-cliniques/caracteristiques?id=caracteristiques.duree',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-interventional.studies.navigation.caracteristiques.combien',
                }),
                href: '/sante/essais-cliniques/caracteristiques?id=caracteristiques.combien',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-interventional.studies.navigation.caracteristiques.types',
                }),
                href: '/sante/essais-cliniques/caracteristiques?id=caracteristiques.types',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.health-interventional.studies.caracteristiques.quand'
                backgroundColor={blueSoft50}
                anchorId='caracteristiques.quand'
              >
                <BSOChart
                  id='studies.caracteristiques.quand.chart-evolution-temporalites'
                  domain='health'
                  studyType='Interventional'
                />

                <BSOChart
                  id='studies.caracteristiques.quand.chart-repartition-avant-apres'
                  domain='health'
                  studyType='Interventional'
                />

                <BSOChart
                  id='studies.caracteristiques.quand.chart-distribution-declarations'
                  domain='health'
                  studyType='Interventional'
                />
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-interventional.studies.caracteristiques.duree'
                backgroundColor={blueSoft25}
                anchorId='caracteristiques.duree'
              >
                app.health-interventional.studies.caracteristiques.duree.chart-nombre
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-interventional.studies.caracteristiques.combien'
                backgroundColor={blueSoft50}
                anchorId='caracteristiques.combien'
              >
                app.health-interventional.studies.caracteristiques.combien.chart-groupes-patients
                <br />
                app.health-interventional.studies.caracteristiques.combien.chart-proportion-modes-repartition
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-interventional.studies.caracteristiques.types'
                backgroundColor={blueSoft25}
                anchorId='caracteristiques.types'
              >
                app.health-interventional.studies.caracteristiques.types.chart-evolution-nombre
              </QuestionSection>
            </GraphContent>
          </GraphItem>

          {/* Les promoteurs */}
          <GraphItem
            mainLabel={intl.formatMessage({
              id: 'app.health-interventional.studies.promoteurs',
            })}
            paths={[
              '/sante/essais-cliniques/promoteurs',
              '/health/clinical-trials/lead-sponsors',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.health-interventional.studies.navigation.promoteurs.dynamique-ouverture',
                }),
                href: '/sante/essais-cliniques/promoteurs?id=promoteurs.dynamique-ouverture',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-interventional.studies.navigation.promoteurs.impact',
                }),
                href: '/sante/essais-cliniques/promoteurs?id=promoteurs.impact',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.health-interventional.studies.promoteurs.dynamique-ouverture'
                backgroundColor={blueSoft50}
                anchorId='promoteurs.dynamique-ouverture'
              >
                <BSOChart
                  id='studies.promoteurs.dynamique-ouverture.chart-part'
                  domain='health'
                  studyType='Interventional'
                />
                <br />
                <BSOChart
                  id='studies.promoteurs.dynamique-ouverture.chart-evolution-nombre'
                  domain='health'
                  studyType='Interventional'
                />
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-interventional.studies.promoteurs.impact'
                backgroundColor={blueSoft25}
                anchorId='promoteurs.impact'
              >
                <BSOChart
                  id='studies.promoteurs.impact.chart-repartition'
                  domain='health'
                  studyType='Interventional'
                />
                <br />
                <BSOChart
                  id='studies.promoteurs.impact.chart-classement-pays'
                  domain='health'
                  studyType='Interventional'
                />
              </QuestionSection>
            </GraphContent>
          </GraphItem>

          {/* Les resultats/publications */}
          <GraphItem
            mainLabel={intl.formatMessage({
              id: 'app.health-interventional.studies.resultats',
            })}
            paths={[
              '/sante/essais-cliniques/resultats',
              '/health/clinical-trials/results',
            ]}
            links={[
              {
                label: intl.formatMessage({
                  id: 'app.health-interventional.studies.navigation.resultats.type-diffusion',
                }),
                href: '/sante/essais-cliniques/resultats?id=resultats.type-diffusion',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-interventional.studies.navigation.resultats.plan-partage',
                }),
                href: '/sante/essais-cliniques/resultats?id=resultats.plan-partage',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-interventional.studies.navigation.resultats.delai-diffusion',
                }),
                href: '/sante/essais-cliniques/resultats?id=resultats.delai-diffusion',
              },
              {
                label: intl.formatMessage({
                  id: 'app.health-interventional.studies.navigation.resultats.publication',
                }),
                href: '/sante/essais-cliniques/resultats?id=resultats.publication',
              },
            ]}
          >
            <GraphContent>
              <QuestionSection
                intlKey='app.health-interventional.studies.resultats.type-diffusion'
                backgroundColor={blueSoft50}
                anchorId='resultats.type-diffusion'
              >
                <BSOChart
                  id='studies.resultats.type-diffusion.chart-repartition'
                  domain='health'
                  studyType='Interventional'
                />
                <br />
                <BSOChart
                  id='studies.resultats.type-diffusion.chart-repartition-par-type'
                  domain='health'
                  studyType='Interventional'
                />
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-interventional.studies.resultats.plan-partage'
                backgroundColor={blueSoft25}
                anchorId='resultats.plan-partage'
              >
                <BSOChart
                  id='studies.resultats.plan-partage.chart-repartition'
                  domain='health'
                  studyType='Interventional'
                />
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-interventional.studies.resultats.delai-diffusion'
                backgroundColor={blueSoft50}
                anchorId='resultats.delai-diffusion'
              >
                app.health-interventional.studies.resultats.delai-diffusion.chart-repartition
                <br />
                app.health-interventional.studies.resultats.delai-diffusion.chart-distribution
              </QuestionSection>

              <QuestionSection
                intlKey='app.health-interventional.studies.resultats.publication'
                backgroundColor={blueSoft25}
                anchorId='resultats.publication'
              >
                app.health-interventional.studies.resultats.publication.chart-repartition
                <BSOChart
                  id='studies.resultats.publication.chart-repartition'
                  domain='health'
                  studyType='Interventional'
                />
              </QuestionSection>
            </GraphContent>
          </GraphItem>
        </GraphNavigation>
      </section>
    </Container>
  );
}

export default EssaisCliniques;
