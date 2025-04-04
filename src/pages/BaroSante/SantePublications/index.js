import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import BannerHealth from '../../../components/BannerHealth';
import BSOChart from '../../../components/Charts';
import DataCardSection from '../../../components/DataCardsSection';
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

function SantePublications() {
  const { lang } = useLang();
  const { pathname } = useLocation();
  const intl = useIntl();
  const blueSoft25 = getCSSValue('--blue-soft-25');
  const blueSoft50 = getCSSValue('--blue-soft-50');

  return (
    <Container fluid className='page'>
      <BannerHealth
        selected='url.sante.publications.general'
        title='app.baro-sante.title'
      />
      <ScrollTop />
      <section className='content'>
        <Row>
          <Container>
            <Row>
              <Col n='12'>
                <h1 className='contentTitle marianne-bold mb-32'>
                  <FormattedMessage id='app.baro-sante.main-title' />
                </h1>
                <p>
                  <GlossaryFormattedMessage
                    intlKey='app.baro-sante.intro'
                    glossaryKeys={['acces-ouvert', 'publication-fr', 'pubmed']}
                  />
                </p>
              </Col>
            </Row>
          </Container>
          <Glossary entries={GlossaryEntries} />
          <DataCardSection lang={lang} domain='health' />
        </Row>
        <Row>
          <GraphNavigation mobileTitleIntl={mobileButtonLabel[lang][pathname]}>
            {/* Général */}
            <GraphItem
              mainLabel={intl.formatMessage({ id: 'app.publi.general' })}
              paths={[
                '/sante/publications/general',
                '/health/publications/general',
              ]}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/health/publications/general?id=general.dynamique-ouverture',
                    fr: '/sante/publications/general?id=general.dynamique-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.dynamique',
                  }),
                  href: {
                    en: '/health/publications/general?id=general.dynamique-ouverture',
                    fr: '/sante/publications/general?id=general.dynamique-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.voies',
                  }),
                  href: {
                    en: '/health/publications/general?id=general.voies-ouverture',
                    fr: '/sante/publications/general?id=general.voies-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.genres',
                  }),
                  href: {
                    en: '/health/publications/general?id=general.genres-ouverture',
                    fr: '/sante/publications/general?id=general.genres-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.langues',
                  }),
                  href: {
                    en: '/health/publications/general?id=general.langues-ouverture',
                    fr: '/sante/publications/general?id=general.langues-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.financement',
                  }),
                  href: {
                    en: '/health/publications/general?id=general.impact-financement',
                    fr: '/sante/publications/general?id=general.impact-financement',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.affiliation.impact',
                  }),
                  href: {
                    en: '/health/publications/general?id=affiliations.pays',
                    fr: '/sante/publications/general?id=affiliations.pays',
                  },
                  isDisplayed: !isInProduction(),
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.health-publi.general.dynamique-ouverture'
                  glossaryKeys={['embargo', 'barriere-mobile']}
                  backgroundColor={blueSoft50}
                  anchorId='general.dynamique-ouverture'
                >
                  <BSOChart
                    id='publi.general.dynamique-ouverture.chart-taux-ouverture'
                    domain='health'
                  />
                  <BSOChart
                    id='publi.general.dynamique-ouverture.chart-evolution-proportion'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.general.voies-ouverture'
                  glossaryKeys={['archive-ouverte']}
                  backgroundColor={blueSoft25}
                  anchorId='general.voies-ouverture'
                >
                  <BSOChart
                    id='publi.general.voies-ouverture.chart-repartition-publications'
                    domain='health'
                  />
                  <BSOChart
                    id='publi.general.voies-ouverture.chart-repartition-taux'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.general.genres-ouverture'
                  glossaryKeys={['preprints']}
                  backgroundColor={blueSoft50}
                  anchorId='general.genres-ouverture'
                >
                  <BSOChart
                    id='publi.general.genres-ouverture.chart-repartition-genres'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.general.langues-ouverture'
                  backgroundColor={blueSoft25}
                  anchorId='general.langues-ouverture'
                >
                  <BSOChart
                    id='publi.general.langues-ouverture.chart-repartition-publications'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.general.impact-financement'
                  backgroundColor={blueSoft50}
                  anchorId='general.impact-financement'
                >
                  <BSOChart
                    id='publi.general.impact-financement.chart-taux-ouverture'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.affiliations.pays'
                  backgroundColor={blueSoft50}
                  anchorId='affiliations.pays'
                  isDisplayed={!isInProduction()}
                >
                  <BSOChart
                    id='publi.affiliations.pays.chart-taux-rang-utile'
                    domain='health'
                  />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            {/* Les disciplines */}
            <GraphItem
              paths={[
                '/sante/publications/disciplines',
                '/health/publications/fields',
              ]}
              mainLabel={intl.formatMessage({
                id: 'app.publi.disciplines',
              })}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/health/publications/fields?id=disciplines.dynamique-ouverture',
                    fr: '/sante/publications/disciplines?id=disciplines.dynamique-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.disciplines.dynamique',
                  }),
                  href: {
                    en: '/health/publications/fields?id=disciplines.dynamique-ouverture',
                    fr: '/sante/publications/disciplines?id=disciplines.dynamique-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.disciplines.voies',
                  }),
                  href: {
                    en: '/health/publications/fields?id=disciplines.voies-ouverture',
                    fr: '/sante/publications/disciplines?id=disciplines.voies-ouverture',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.health-publi.disciplines.dynamique-ouverture'
                  backgroundColor={blueSoft50}
                  anchorId='disciplines.dynamique-ouverture'
                >
                  <BSOChart
                    id='publi.disciplines.dynamique-ouverture.chart-taux-ouverture'
                    domain='health'
                  />
                  <BSOChart
                    id='publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.disciplines.voies-ouverture'
                  glossaryKeys={['archive-ouverte', 'pmc']}
                  backgroundColor={blueSoft50}
                  anchorId='disciplines.voies-ouverture'
                >
                  <BSOChart
                    id='publi.disciplines.voies-ouverture.chart-repartition-publications'
                    domain='health'
                  />
                  <BSOChart
                    id='publi.disciplines.voies-ouverture.chart-evolution-comparaison-types-hebergement'
                    domain='health'
                  />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            {/* Les éditeurs */}
            <GraphItem
              paths={[
                '/sante/publications/editeurs',
                '/health/publications/publishers',
              ]}
              mainLabel={intl.formatMessage({ id: 'app.publi.editeurs' })}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/health/publications/publishers?id=publishers.dynamique-ouverture',
                    fr: '/sante/publications/editeurs?id=publishers.dynamique-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.dynamique',
                  }),
                  href: {
                    en: '/health/publications/publishers?id=publishers.dynamique-ouverture',
                    fr: '/sante/publications/editeurs?id=publishers.dynamique-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.modele',
                  }),
                  href: {
                    en: '/health/publications/publishers?id=publishers.type-ouverture',
                    fr: '/sante/publications/editeurs?id=publishers.type-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.politique',
                  }),
                  href: {
                    en: '/health/publications/publishers?id=publishers.politiques-ouverture',
                    fr: '/sante/publications/editeurs?id=publishers.politiques-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.revues',
                  }),
                  href: {
                    en: '/health/publications/publishers?id=publishers.poids-revues',
                    fr: '/sante/publications/editeurs?id=publishers.poids-revues',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.licences',
                  }),
                  href: {
                    en: '/health/publications/publishers?id=publishers.repartition-licences',
                    fr: '/sante/publications/editeurs?id=publishers.repartition-licences',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.frais',
                  }),
                  href: {
                    en: '/health/publications/publishers?id=publishers.couts-publication',
                    fr: '/sante/publications/editeurs?id=publishers.couts-publication',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.health-publi.publishers.dynamique-ouverture'
                  backgroundColor={blueSoft50}
                  anchorId='publishers.dynamique-ouverture'
                >
                  <BSOChart
                    id='publi.publishers.dynamique-ouverture.chart-taux-ouverture'
                    domain='health'
                  />
                  <BSOChart
                    id='publi.publishers.dynamique-ouverture.chart-evolution-proportion'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.publishers.type-ouverture'
                  glossaryKeys={[
                    'apc',
                    'gold-full-apc',
                    'hybrid',
                    'diamond',
                    'barriere-mobile',
                  ]}
                  backgroundColor={blueSoft25}
                  anchorId='publishers.type-ouverture'
                >
                  <BSOChart
                    id='publi.publishers.type-ouverture.chart-evolution-repartition'
                    domain='health'
                  />
                  <BSOChart
                    id='publi.publishers.type-ouverture.chart-repartition-modeles'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.publishers.politiques-ouverture'
                  glossaryKeys={[
                    'loi-republique-numerique',
                    'archive-ouverte',
                    'embargo',
                    'hal',
                  ]}
                  backgroundColor={blueSoft50}
                  anchorId='publishers.politiques-ouverture'
                >
                  <BSOChart
                    id='publi.publishers.politiques-ouverture.chart-classement'
                    domain='health'
                  />
                  <BSOChart
                    id='publi.publishers.politiques-ouverture.chart-comparaison'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.publishers.poids-revues'
                  glossaryKeys={['predatory', 'list-beall']}
                  backgroundColor={blueSoft25}
                  anchorId='publishers.poids-revues'
                >
                  <BSOChart
                    id='publi.publishers.poids-revues.chart-repartition'
                    domain='health'
                    isDisplayed={!isInProduction()}
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.publishers.repartition-licences'
                  glossaryKeys={['licence']}
                  backgroundColor={blueSoft50}
                  anchorId='publishers.repartition-licences'
                >
                  <BSOChart
                    id='publi.publishers.repartition-licences.chart-repartition'
                    domain='health'
                  />
                  <BSOChart
                    id='publi.publishers.repartition-licences.chart-classement'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.publishers.couts-publication'
                  glossaryKeys={['apc', 'diamond']}
                  backgroundColor={blueSoft25}
                  anchorId='publishers.couts-publication'
                >
                  <BSOChart
                    id='publi.publishers.couts-publication.chart-depenses-estimees'
                    domain='health'
                    isDisplayed={!isInProduction()}
                  />
                  <BSOChart
                    id='publi.publishers.couts-publication.chart-distribution'
                    domain='health'
                  />
                  <BSOChart
                    id='publi.publishers.couts-publication.chart-distribution-par-annee'
                    domain='health'
                    isDisplayed={!isInProduction()}
                  />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            {/* Les archives ouvertes */}
            <GraphItem
              paths={[
                '/sante/publications/archives',
                '/health/publications/repositories',
              ]}
              mainLabel={intl.formatMessage({ id: 'app.publi.archives' })}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/health/publications/repositories?id=repositories.dynamique-ouverture',
                    fr: '/sante/publications/archives?id=repositories.dynamique-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.archives.dynamique',
                  }),
                  href: {
                    en: '/health/publications/repositories?id=repositories.dynamique-ouverture',
                    fr: '/sante/publications/archives?id=repositories.dynamique-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.archives.utilisees',
                  }),
                  href: {
                    en: '/health/publications/repositories?id=repositories.plus-utilisees',
                    fr: '/sante/publications/archives?id=repositories.plus-utilisees',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.archives.depot',
                  }),
                  href: {
                    en: '/health/publications/repositories?id=repositories.dynamique-depot',
                    fr: '/sante/publications/archives?id=repositories.dynamique-depot',
                  },
                  isDisplayed: !isInProduction(),
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.archives.hal',
                  }),
                  href: {
                    en: '/health/publications/repositories?id=repositories.dynamique-hal',
                    fr: '/sante/publications/archives?id=repositories.dynamique-hal',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.health-publi.repositories.dynamique-ouverture'
                  glossaryKeys={['archive-ouverte', 'anr', 'preprints']}
                  backgroundColor={blueSoft50}
                  anchorId='repositories.dynamique-ouverture'
                >
                  <BSOChart
                    id='publi.repositories.dynamique-ouverture.chart-taux-ouverture'
                    domain='health'
                  />
                  <BSOChart
                    id='publi.repositories.dynamique-ouverture.chart-evolution-proportion'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.repositories.plus-utilisees'
                  glossaryKeys={['pmc', 'hal']}
                  backgroundColor={blueSoft25}
                  anchorId='repositories.plus-utilisees'
                >
                  <BSOChart
                    id='publi.repositories.plus-utilisees.chart-nombre-documents'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.repositories.dynamique-depot'
                  backgroundColor={blueSoft50}
                  anchorId='repositories.dynamique-depot'
                  isDisplayed={!isInProduction()}
                >
                  <BSOChart
                    id='publi.repositories.dynamique-depot.chart-nombre-documents-depots'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.repositories.dynamique-hal'
                  glossaryKeys={['hal']}
                  backgroundColor={blueSoft25}
                  anchorId='repositories.dynamique-hal'
                >
                  <BSOChart
                    id='publi.repositories.dynamique-hal.chart-couverture-hal'
                    domain='health'
                  />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            {/* Les affiliations */}
            <GraphItem
              paths={[
                '/sante/publications/affiliations',
                '/health/publications/affiliations',
              ]}
              isDisplayed={!isInProduction()}
              mainLabel={intl.formatMessage({
                id: 'app.publi.affiliations',
              })}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/health/publications/affiliations?id=affiliations.dynamique-ouverture',
                    fr: '/sante/publications/affiliations?id=affiliations.dynamique-ouverture',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.affiliation.dynamique',
                  }),
                  href: {
                    en: '/health/publications/affiliations?id=affiliations.dynamique-ouverture',
                    fr: '/sante/publications/affiliations?id=affiliations.dynamique-ouverture',
                  },
                },
              ]}
            >
              <GraphContent isDisplayed={!isInProduction()}>
                <QuestionSection
                  intlKey='app.health-publi.affiliations.dynamique-ouverture'
                  backgroundColor={blueSoft50}
                  anchorId='affiliations.dynamique-ouverture'
                >
                  <BSOChart
                    id='publi.affiliations.dynamique-ouverture.chart-taux-ouverture'
                    domain='health'
                  />
                  <BSOChart
                    id='publi.affiliations.dynamique-ouverture.chart-evolution-proportion'
                    domain='health'
                  />
                  <BSOChart
                    id='publi.affiliations.dynamique-ouverture.chart-evolution-taux'
                    domain='health'
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

export default SantePublications;
