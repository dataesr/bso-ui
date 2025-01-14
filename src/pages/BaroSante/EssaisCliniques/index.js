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
import { getCSSValue, isInProduction } from '../../../utils/helpers';
import useLang from '../../../utils/Hooks/useLang';

function EssaisCliniques() {
  const { lang } = useLang();
  const { pathname } = useLocation();
  const intl = useIntl();
  const blueSoft25 = getCSSValue('--blue-soft-25');
  const blueSoft50 = getCSSValue('--blue-soft-50');

  return (
    <Container fluid className='page essais'>
      <BannerHealth
        selected='url.sante.essais'
        title='app.header.nav.baro-sante-essais'
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
                    glossaryKeys={['essai-clinique', 'promoteur']}
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
              mainLabel={intl.formatMessage({
                id: 'app.health-interventional.general',
              })}
              paths={[
                '/sante/essais-cliniques/general',
                '/health/clinical-trials/general',
              ]}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/health/clinical-trials/general?id=general.dynamique',
                    fr: '/sante/essais-cliniques/general?id=general.dynamique',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.health-interventional.navigation.general.dynamique',
                  }),
                  href: {
                    en: '/health/clinical-trials/general?id=general.dynamique',
                    fr: '/sante/essais-cliniques/general?id=general.dynamique',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.health-interventional.navigation.general.trajectoires',
                  }),
                  href: {
                    en: '/health/clinical-trials/general?id=general.directions',
                    fr: '/sante/essais-cliniques/general?id=general.directions',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  ctas={[
                    'https://www.wma.net/fr/policies-post/declaration-dhelsinki-de-lamm-principes-ethiques-applicables-a-la-recherche-medicale-impliquant-des-etres-humains/',
                    'https://clinicaltrials.gov/',
                    'https://euclinicaltrials.eu/',
                    'https://www.clinicaltrialsregister.eu/',
                  ]}
                  intlKey='app.health-interventional.general.dynamique'
                  backgroundColor={blueSoft50}
                  anchorId='general.dynamique'
                >
                  <BSOChart
                    id='general.dynamique.chart-evolution-within-3-years'
                    domain='health'
                    studyType='Interventional'
                  />
                  <BSOChart
                    id='general.dynamique.chart-evolution'
                    domain='health'
                    studyType='Interventional'
                  />
                  <BSOChart
                    id='general.dynamique.chart-evolution-within-3-years-by-year'
                    domain='health'
                    studyType='Interventional'
                  />
                  <BSOChart
                    id='general.dynamique.chart-evolution-within-1-year'
                    domain='health'
                    studyType='Interventional'
                  />
                  <BSOChart
                    id='general.dynamique.chart-evolution-within-1-year-by-year'
                    domain='health'
                    studyType='Interventional'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-interventional.general.trajectoires'
                  backgroundColor={blueSoft25}
                  anchorId='general.directions'
                >
                  <BSOChart
                    id='general.trajectoires.chart-repartition'
                    domain='health'
                    studyType='Interventional'
                  />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            {/* Caractéristiques */}
            <GraphItem
              mainLabel={intl.formatMessage({
                id: 'app.health-interventional.caracteristiques',
              })}
              paths={[
                '/sante/essais-cliniques/caracteristiques',
                '/health/clinical-trials/characteristics',
              ]}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/health/clinical-trials/characteristics?id=caracteristiques.quand',
                    fr: '/sante/essais-cliniques/caracteristiques?id=caracteristiques.quand',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.health-interventional.navigation.caracteristiques.quand',
                  }),
                  href: {
                    en: '/health/clinical-trials/characteristics?id=caracteristiques.quand',
                    fr: '/sante/essais-cliniques/caracteristiques?id=caracteristiques.quand',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.health-interventional.navigation.caracteristiques.duree',
                  }),
                  href: {
                    en: '/health/clinical-trials/characteristics?id=caracteristiques.duree',
                    fr: '/sante/essais-cliniques/caracteristiques?id=caracteristiques.duree',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.health-interventional.navigation.caracteristiques.combien',
                  }),
                  href: {
                    en: '/health/clinical-trials/characteristics?id=caracteristiques.combien',
                    fr: '/sante/essais-cliniques/caracteristiques?id=caracteristiques.combien',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.health-interventional.navigation.caracteristiques.types',
                  }),
                  href: {
                    en: '/health/clinical-trials/characteristics?id=caracteristiques.types',
                    fr: '/sante/essais-cliniques/caracteristiques?id=caracteristiques.types',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.health-interventional.caracteristiques.quand'
                  backgroundColor={blueSoft50}
                  anchorId='caracteristiques.quand'
                >
                  <BSOChart
                    id='caracteristiques.quand.chart-evolution-temporalites'
                    domain='health'
                    studyType='Interventional'
                  />
                  <BSOChart
                    id='caracteristiques.quand.chart-repartition-avant-apres'
                    domain='health'
                    studyType='Interventional'
                  />
                  <BSOChart
                    id='caracteristiques.quand.chart-distribution-declarations'
                    domain='health'
                    studyType='Interventional'
                    isDisplayed={!isInProduction()}
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-interventional.caracteristiques.duree'
                  backgroundColor={blueSoft25}
                  anchorId='caracteristiques.duree'
                >
                  <BSOChart
                    id='caracteristiques.duree.chart-nombre'
                    domain='health'
                    studyType='Interventional'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-interventional.caracteristiques.combien'
                  backgroundColor={blueSoft50}
                  anchorId='caracteristiques.combien'
                >
                  <BSOChart
                    id='caracteristiques.combien.chart-groupes-patients'
                    domain='health'
                    studyType='Interventional'
                  />
                  <BSOChart
                    id='caracteristiques.combien.chart-proportion-modes-repartition'
                    domain='health'
                    studyType='Interventional'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-interventional.caracteristiques.types'
                  backgroundColor={blueSoft25}
                  anchorId='caracteristiques.types'
                  ctas={[
                    'https://clinicaltrials.gov/policy/protocol-definitions#InterventionType',
                  ]}
                >
                  <BSOChart
                    id='caracteristiques.types.chart-evolution-nombre'
                    domain='health'
                    studyType='Interventional'
                  />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            {/* Les promoteurs [MASQUE] */}
            <GraphItem
              mainLabel={intl.formatMessage({
                id: 'app.health-interventional.promoteurs',
              })}
              paths={[
                '/sante/essais-cliniques/promoteurs',
                '/health/clinical-trials/lead-sponsors',
              ]}
              isDisplayed={!isInProduction()}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/health/clinical-trials/lead-sponsors?id=promoteurs.dynamique-ouverture',
                    fr: '/sante/essais-cliniques/promoteurs?id=promoteurs.dynamique-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.health-interventional.navigation.promoteurs.dynamique-ouverture',
                  }),
                  href: {
                    en: '/health/clinical-trials/lead-sponsors?id=promoteurs.dynamique-ouverture',
                    fr: '/sante/essais-cliniques/promoteurs?id=promoteurs.dynamique-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.health-interventional.navigation.promoteurs.impact',
                  }),
                  href: {
                    en: '/health/clinical-trials/lead-sponsors?id=promoteurs.impact',
                    fr: '/sante/essais-cliniques/promoteurs?id=promoteurs.impact',
                  },
                },
              ]}
            >
              <GraphContent isDisplayed={!isInProduction()}>
                <QuestionSection
                  intlKey='app.health-interventional.promoteurs.dynamique-ouverture'
                  backgroundColor={blueSoft50}
                  anchorId='promoteurs.dynamique-ouverture'
                >
                  <BSOChart
                    id='promoteurs.dynamique-ouverture.chart-part'
                    domain='health'
                    studyType='Interventional'
                  />
                  <BSOChart
                    id='promoteurs.dynamique-ouverture.chart-evolution-nombre'
                    domain='health'
                    studyType='Interventional'
                  />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.health-interventional.promoteurs.impact'
                  backgroundColor={blueSoft25}
                  anchorId='promoteurs.impact'
                >
                  <BSOChart
                    id='promoteurs.impact.chart-repartition'
                    domain='health'
                    studyType='Interventional'
                  />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            {/* La communication des résultats */}
            <GraphItem
              mainLabel={intl.formatMessage({
                id: 'app.health-interventional.resultats',
              })}
              paths={[
                '/sante/essais-cliniques/resultats',
                '/health/clinical-trials/results',
              ]}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/health/clinical-trials/results?id=resultats.type-diffusion',
                    fr: '/sante/essais-cliniques/resultats?id=resultats.type-diffusion',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.health-interventional.navigation.resultats.type-diffusion',
                  }),
                  href: {
                    en: '/health/clinical-trials/results?id=resultats.type-diffusion',
                    fr: '/sante/essais-cliniques/resultats?id=resultats.type-diffusion',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.health-interventional.navigation.resultats.plan-partage',
                  }),
                  href: {
                    en: '/health/clinical-trials/results?id=resultats.plan-partage',
                    fr: '/sante/essais-cliniques/resultats?id=resultats.plan-partage',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.health-interventional.navigation.resultats.delai-diffusion',
                  }),
                  href: {
                    en: '/health/clinical-trials/results?id=resultats.delai-diffusion',
                    fr: '/sante/essais-cliniques/resultats?id=resultats.delai-diffusion',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.health-interventional.navigation.resultats.publication',
                  }),
                  href: {
                    en: '/health/clinical-trials/results?id=resultats.publication',
                    fr: '/sante/essais-cliniques/resultats?id=resultats.publication',
                  },
                  isDisplayed: !isInProduction(),
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.health-interventional.resultats.type-diffusion'
                  backgroundColor={blueSoft50}
                  anchorId='resultats.type-diffusion'
                >
                  <BSOChart
                    id='resultats.type-diffusion.chart-repartition'
                    domain='health'
                    studyType='Interventional'
                  />
                  <BSOChart
                    id='resultats.type-diffusion.chart-repartition-par-type'
                    domain='health'
                    studyType='Interventional'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-interventional.resultats.plan-partage'
                  backgroundColor={blueSoft25}
                  anchorId='resultats.plan-partage'
                  ctas={['http://www.icmje.org/']}
                >
                  <BSOChart
                    id='resultats.plan-partage.chart-repartition'
                    domain='health'
                    studyType='Interventional'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-interventional.resultats.delai-diffusion'
                  backgroundColor={blueSoft50}
                  anchorId='resultats.delai-diffusion'
                >
                  <BSOChart
                    id='resultats.delai-diffusion.chart-repartition'
                    domain='health'
                    studyType='Interventional'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-interventional.resultats.publication'
                  backgroundColor={blueSoft25}
                  anchorId='resultats.publication'
                  isDisplayed={!isInProduction()}
                >
                  <BSOChart
                    id='resultats.publication.chart-repartition'
                    domain='health'
                    studyType='Interventional'
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

export default EssaisCliniques;
