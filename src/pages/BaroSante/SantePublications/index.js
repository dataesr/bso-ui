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
import { getCSSValue } from '../../../utils/helpers';
import useLang from '../../../utils/Hooks/useLang';

function SantePublications() {
  const { lang } = useLang();
  const location = useLocation();
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
                    glossaryKey='acces-ouvert'
                  />
                </p>
              </Col>
            </Row>
          </Container>
          <Glossary entries={GlossaryEntries} />
          <DataCardSection lang={lang} domain='health' />
        </Row>
        <Row>
          <GraphNavigation
            mobileTitleIntl={mobileButtonLabel[lang][location.pathname]}
          >
            <GraphItem
              mainLabel={intl.formatMessage({ id: 'app.publi.general' })}
              paths={[
                '/sante/publications/general',
                '/health/publications/general',
              ]}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.disciplines.dynamique',
                  }),
                  href: '/sante/publications/general?id=general.dynamique-ouverture',
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.disciplines.voies',
                  }),
                  href: '/sante/publications/general?id=general.voies-ouverture',
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.genres',
                  }),
                  href: '/sante/publications/general?id=general.genres-ouverture',
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.langues',
                  }),
                  href: '/sante/publications/general?id=general.langues-ouverture',
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.financement',
                  }),
                  href: '/sante/publications/general?id=general.impact-financement',
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.health-publi.general.dynamique-ouverture'
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
                    hasComments={false}
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.general.voies-ouverture'
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
              </GraphContent>
            </GraphItem>

            <GraphItem
              paths={['/sante/publications/disciplines']}
              mainLabel={intl.formatMessage({
                id: 'app.publi.disciplines',
              })}
              links={[
                {
                  href: '/sante/publications/disciplines?id=disciplines.dynamique-ouverture',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.disciplines.dynamique',
                  }),
                },
                {
                  href: '/sante/publications/disciplines?id=disciplines.voies-ouverture',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.disciplines.voies',
                  }),
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

            <GraphItem
              paths={['/sante/publications/editeurs']}
              mainLabel={intl.formatMessage({ id: 'app.publi.editeurs' })}
              links={[
                {
                  href: '/sante/publications/editeurs?id=publishers.dynamique-ouverture',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.dynamique',
                  }),
                },
                {
                  href: '/sante/publications/editeurs?id=publishers.type-ouverture',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.modele',
                  }),
                },
                {
                  href: '/sante/publications/editeurs?id=publishers.politiques-ouverture',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.politique',
                  }),
                },
                {
                  href: '/sante/publications/editeurs?id=publishers.poids-revues',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.revues',
                  }),
                },
                {
                  href: '/sante/publications/editeurs?id=publishers.repartition-licences',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.licences',
                  }),
                },
                {
                  href: '/sante/publications/editeurs?id=publishers.couts-publication',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.frais',
                  }),
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
                  backgroundColor={blueSoft25}
                  anchorId='publishers.poids-revues'
                >
                  <BSOChart
                    id='publi.publishers.poids-revues.chart-repartition'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.publishers.repartition-licences'
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
                  backgroundColor={blueSoft25}
                  anchorId='publishers.couts-publication'
                >
                  <BSOChart
                    id='publi.publishers.couts-publication.chart-depenses-estimees'
                    domain='health'
                  />
                  <BSOChart
                    id='publi.publishers.couts-publication.chart-distribution'
                    domain='health'
                  />
                  <BSOChart
                    id='publi.publishers.couts-publication.chart-distribution-par-annee'
                    domain='health'
                  />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            <GraphItem
              paths={['/sante/publications/archives']}
              mainLabel={intl.formatMessage({ id: 'app.publi.archives' })}
              links={[
                {
                  href: '/sante/publications/archives?id=repositories.dynamique-ouverture',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.archives.dynamique',
                  }),
                },
                {
                  href: '/sante/publications/archives?id=repositories.plus-utilisees',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.archives.utilisees',
                  }),
                },
                {
                  href: '/sante/publications/archives?id=repositories.dynamique-depot',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.archives.depot',
                  }),
                },
                {
                  href: '/sante/publications/archives?id=repositories.dynamique-hal',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.archives.hal',
                  }),
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.health-publi.repositories.dynamique-ouverture'
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
                >
                  <BSOChart
                    id='publi.repositories.dynamique-depot.chart-nombre-documents-depots'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.health-publi.repositories.dynamique-hal'
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

            <GraphItem
              paths={['/sante/publications/affiliations']}
              mainLabel={intl.formatMessage({
                id: 'app.publi.affiliations',
              })}
              links={[
                {
                  href: '/sante/publications/affiliations?id=affiliations.dynamique-ouverture',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.affiliation.dynamique',
                  }),
                },
                {
                  href: '/sante/publications/affiliations?id=affiliations.pays',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.affiliation.impact',
                  }),
                },
              ]}
            >
              <GraphContent>
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

                <QuestionSection
                  intlKey='app.health-publi.affiliations.pays'
                  backgroundColor={blueSoft50}
                  anchorId='affiliations.pays'
                >
                  <BSOChart
                    id='publi.affiliations.pays.chart-taux-rang-utile'
                    domain='health'
                  />
                  { /*
                  <BSOChart
                    id='publi.affiliations.pays.chart-classement-pays'
                    domain='health'
                  />
                  */ }
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
