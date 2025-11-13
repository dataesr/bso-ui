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
                '/health/clinical-trials/general',
                '/sante/essais-cliniques/general',
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
                  anchorId='general.dynamique'
                  backgroundColor={blueSoft50}
                  ctas={[
                    'https://www.wma.net/fr/policies-post/declaration-dhelsinki-de-lamm-principes-ethiques-applicables-a-la-recherche-medicale-impliquant-des-etres-humains/',
                    'https://clinicaltrials.gov/',
                    'https://euclinicaltrials.eu/',
                    'https://www.clinicaltrialsregister.eu/',
                  ]}
                  intlKey='app.health-interventional.general.dynamique'
                >
                  <BSOChart
                    domain='health'
                    id='general.dynamique.chart-evolution-within-3-years'
                    studyType='Interventional'
                  />
                  <BSOChart
                    domain='health'
                    id='general.dynamique.chart-evolution'
                    studyType='Interventional'
                  />
                  <BSOChart
                    domain='health'
                    id='general.dynamique.chart-evolution-within-3-years-by-year'
                    studyType='Interventional'
                  />
                  <BSOChart
                    domain='health'
                    id='general.dynamique.chart-evolution-within-1-year'
                    studyType='Interventional'
                  />
                  <BSOChart
                    domain='health'
                    id='general.dynamique.chart-evolution-within-1-year-by-year'
                    studyType='Interventional'
                  />
                  <BSOChart
                    domain='health'
                    id='general.dynamique.chart-evolution-10-years-within-1-year'
                    isDisplayed={!isInProduction()}
                    studyType='Interventional'
                  />
                </QuestionSection>

                <QuestionSection
                  anchorId='general.directions'
                  backgroundColor={blueSoft25}
                  intlKey='app.health-interventional.general.trajectoires'
                >
                  <BSOChart
                    domain='health'
                    id='general.trajectoires.chart-repartition'
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
                '/health/clinical-trials/characteristics',
                '/sante/essais-cliniques/caracteristiques',
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
                  anchorId='caracteristiques.quand'
                  backgroundColor={blueSoft50}
                  intlKey='app.health-interventional.caracteristiques.quand'
                >
                  <BSOChart
                    domain='health'
                    id='caracteristiques.quand.chart-evolution-temporalites'
                    studyType='Interventional'
                  />
                  <BSOChart
                    domain='health'
                    id='caracteristiques.quand.chart-repartition-avant-apres'
                    studyType='Interventional'
                  />
                  <BSOChart
                    domain='health'
                    id='caracteristiques.quand.chart-distribution-declarations'
                    isDisplayed={!isInProduction()}
                    studyType='Interventional'
                  />
                </QuestionSection>

                <QuestionSection
                  anchorId='caracteristiques.duree'
                  backgroundColor={blueSoft25}
                  intlKey='app.health-interventional.caracteristiques.duree'
                >
                  <BSOChart
                    domain='health'
                    id='caracteristiques.duree.chart-nombre'
                    studyType='Interventional'
                  />
                </QuestionSection>

                <QuestionSection
                  anchorId='caracteristiques.combien'
                  backgroundColor={blueSoft50}
                  intlKey='app.health-interventional.caracteristiques.combien'
                >
                  <BSOChart
                    domain='health'
                    id='caracteristiques.combien.chart-groupes-patients'
                    studyType='Interventional'
                  />
                  <BSOChart
                    domain='health'
                    id='caracteristiques.combien.chart-proportion-modes-repartition'
                    studyType='Interventional'
                  />
                </QuestionSection>

                <QuestionSection
                  anchorId='caracteristiques.types'
                  backgroundColor={blueSoft25}
                  ctas={[
                    'https://clinicaltrials.gov/policy/protocol-definitions#InterventionType',
                  ]}
                  intlKey='app.health-interventional.caracteristiques.types'
                >
                  <BSOChart
                    domain='health'
                    id='caracteristiques.types.chart-evolution-nombre'
                    studyType='Interventional'
                  />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            {/* Les promoteurs [STAGING] */}
            <GraphItem
              mainLabel={intl.formatMessage({
                id: 'app.health-interventional.promoteurs',
              })}
              paths={[
                '/health/clinical-trials/lead-sponsors',
                '/sante/essais-cliniques/promoteurs',
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
                  anchorId='promoteurs.dynamique-ouverture'
                  backgroundColor={blueSoft50}
                  intlKey='app.health-interventional.promoteurs.dynamique-ouverture'
                >
                  <BSOChart
                    domain='health'
                    id='promoteurs.dynamique-ouverture.chart-part'
                    studyType='Interventional'
                  />
                  <BSOChart
                    domain='health'
                    id='promoteurs.dynamique-ouverture.chart-evolution-nombre'
                    studyType='Interventional'
                  />
                </QuestionSection>
                <QuestionSection
                  anchorId='promoteurs.impact'
                  backgroundColor={blueSoft25}
                  intlKey='app.health-interventional.promoteurs.impact'
                >
                  <BSOChart
                    domain='health'
                    id='promoteurs.impact.chart-repartition'
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
                '/health/clinical-trials/results',
                '/sante/essais-cliniques/resultats',
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
                  anchorId='resultats.type-diffusion'
                  backgroundColor={blueSoft50}
                  intlKey='app.health-interventional.resultats.type-diffusion'
                >
                  <BSOChart
                    domain='health'
                    id='resultats.type-diffusion.chart-repartition'
                    studyType='Interventional'
                  />
                  <BSOChart
                    domain='health'
                    id='resultats.type-diffusion.chart-repartition-par-type'
                    studyType='Interventional'
                  />
                </QuestionSection>

                <QuestionSection
                  anchorId='resultats.plan-partage'
                  backgroundColor={blueSoft25}
                  ctas={['http://www.icmje.org/']}
                  intlKey='app.health-interventional.resultats.plan-partage'
                >
                  <BSOChart
                    domain='health'
                    id='resultats.plan-partage.chart-repartition'
                    studyType='Interventional'
                  />
                </QuestionSection>

                <QuestionSection
                  anchorId='resultats.delai-diffusion'
                  backgroundColor={blueSoft50}
                  intlKey='app.health-interventional.resultats.delai-diffusion'
                >
                  <BSOChart
                    domain='health'
                    id='resultats.delai-diffusion.chart-repartition'
                    studyType='Interventional'
                  />
                </QuestionSection>

                <QuestionSection
                  anchorId='resultats.publication'
                  backgroundColor={blueSoft25}
                  intlKey='app.health-interventional.resultats.publication'
                  isDisplayed={!isInProduction()}
                >
                  <BSOChart
                    domain='health'
                    id='resultats.publication.chart-repartition'
                    studyType='Interventional'
                  />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            {/* Médicaments [STAGING] */}
            <GraphItem
              mainLabel={intl.formatMessage({
                id: 'app.health-interventional.navigation.drug',
                defaultMessage: 'Clinical trials on drug',
              })}
              paths={[
                '/health/clinical-trials/drug',
                '/sante/essais-cliniques/medicament',
              ]}
              isDisplayed={!isInProduction()}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/health/clinical-trials/drug?id=general.dynamique',
                    fr: '/sante/essais-cliniques/medicament?id=general.dynamique',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  anchorId='general.dynamique'
                  backgroundColor={blueSoft50}
                  intlKey='app.health-interventional.resultats.publication'
                  isDisplayed={!isInProduction()}
                >
                  <BSOChart
                    domain='health'
                    id='general.dynamique.chart-evolution-within-3-years-drug'
                    studyType='Interventional'
                  />
                  <BSOChart
                    domain='health'
                    id='general.dynamique.chart-evolution-drug'
                    studyType='Interventional'
                  />
                  <BSOChart
                    domain='health'
                    id='general.dynamique.chart-evolution-within-3-years-by-year-drug'
                    studyType='Interventional'
                  />
                  <BSOChart
                    domain='health'
                    id='general.dynamique.chart-evolution-within-1-year-drug'
                    studyType='Interventional'
                  />
                  <BSOChart
                    domain='health'
                    id='general.dynamique.chart-evolution-within-1-year-by-year-drug'
                    studyType='Interventional'
                  />
                  <BSOChart
                    domain='health'
                    id='general.dynamique.chart-evolution-10-years-within-1-year-drug'
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
