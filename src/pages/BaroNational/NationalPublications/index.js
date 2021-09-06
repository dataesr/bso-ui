import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import Banner from '../../../components/Banner';
import ChartNombreDocumentsDepotsRepositories from '../../../components/charts/publications/archives/dynamique-depot/chart-nombre-documents-depots';
import ChartTauxCouvertureHAL from '../../../components/charts/publications/archives/dynamique-hal/chart-couverture-hal';
import ChartTauxOuvertureArchives from '../../../components/charts/publications/archives/dynamique-ouverture/chart-taux-ouverture';
import ChartTauxPresenceRepositories from '../../../components/charts/publications/archives/dynamique-ouverture/chart-taux-presence';
import ChartNombreDocumentsRepositories from '../../../components/charts/publications/archives/plus-utilisees/chart-nombre-documents';
import ChartEvolutionTauxOuvertureDisciplines from '../../../components/charts/publications/disciplines/dynamique-ouverture/chart-evolution-taux-ouverture';
import ChartTauxOuvertureDisciplines from '../../../components/charts/publications/disciplines/dynamique-ouverture/chart-taux-ouverture';
import ChartEvolutionComparaisonTypesHebergementDisciplines from '../../../components/charts/publications/disciplines/voies-ouverture/chart-evolution-comparaison-types-hebergement';
import ChartRepartitionPublicationsDisciplines from '../../../components/charts/publications/disciplines/voies-ouverture/chart-repartition-publications';
import ChartDepensesEstimeesPublishers from '../../../components/charts/publications/editeurs/couts-publication/chart-depenses-estimees';
import ChartDistributionPublishers from '../../../components/charts/publications/editeurs/couts-publication/chart-distribution';
import ChartDistributionParAnnee from '../../../components/charts/publications/editeurs/couts-publication/chart-distribution-par-annee';
import ChartEvolutionProportionPublishers from '../../../components/charts/publications/editeurs/dynamique-ouverture/chart-evolution-proportion';
import ChartTauxOuverturePublishers from '../../../components/charts/publications/editeurs/dynamique-ouverture/chart-taux-ouverture';
import ChartRepartitionPublishers from '../../../components/charts/publications/editeurs/poids-revues/chart-repartition';
import ChartClassementPublishers from '../../../components/charts/publications/editeurs/politiques-ouverture/chart-classement';
import ChartComparaisonPublishers from '../../../components/charts/publications/editeurs/politiques-ouverture/chart-comparaison';
import ChartClassementLicencesPublishers from '../../../components/charts/publications/editeurs/repartition-licences/chart-classement';
import ChartRepartitionLicencesPublishers from '../../../components/charts/publications/editeurs/repartition-licences/chart-repartition';
import ChartEvolutionRepartitionPublishers from '../../../components/charts/publications/editeurs/type-ouverture/chart-evolution-repartition';
import ChartRepartitionModelesPublishers from '../../../components/charts/publications/editeurs/type-ouverture/chart-repartition-modeles';
import ChartEvolutionProportion from '../../../components/charts/publications/general/dynamique-ouverture/chart-evolution-proportion';
import ChartTauxOuverture from '../../../components/charts/publications/general/dynamique-ouverture/chart-taux-ouverture';
import ChartGenreOuverture from '../../../components/charts/publications/general/genres-ouverture/genres-ouverture';
import ChartLanguesOuverture from '../../../components/charts/publications/general/langues-ouverture/langues-ouverture';
import ChartEvolutionTaux from '../../../components/charts/publications/general/voies-ouverture/chart-evolution-taux';
import ChartRepartitionPublications from '../../../components/charts/publications/general/voies-ouverture/chart-repartition-publications';
import ChartRepartitionTaux from '../../../components/charts/publications/general/voies-ouverture/chart-repartition-taux';
import Chip from '../../../components/Chip';
import DataCardSection from '../../../components/DataCardsSection';
import Glossary from '../../../components/Glossary';
import GlossaryFormattedMessage from '../../../components/Glossary/GlossaryFormattedMessage';
import GraphNavigation from '../../../components/GraphNavigation';
import GraphContent from '../../../components/GraphNavigation/GraphContent';
import GraphItem from '../../../components/GraphNavigation/GraphItem';
import Icon from '../../../components/Icon';
import QuestionSection from '../../../components/question-section';
import ScrollTop from '../../../components/ScrollTop';
import urls from '../../../config/urls';
import { bluesoft25, bluesoft50 } from '../../../style/colours.module.scss';
import GlossaryEntries from '../../../translations/glossary.json';
import { mobileButtonLabel } from '../../../utils/constants';
import useLang from '../../../utils/Hooks/useLang';

export default function NationalPublications() {
  const { lang } = useLang();
  const location = useLocation();
  const intl = useIntl();

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-28'
          color1='blue-soft-125'
          color2='publication-25'
        />
      </Col>
    </Row>
  );

  return (
    <Container fluid className='page'>
      <Banner
        backgroundColor='blue-dark-100'
        homeLink={urls.national[lang]}
        supTitle={<FormattedMessage id='app.header.title-national' />}
        title={<FormattedMessage id='app.baro-national.title' />}
        chip={<Chip />}
        icons={renderIcons}
      />
      <ScrollTop />
      <section className='content'>
        <Row>
          <Container>
            <Row>
              <Col n='12'>
                <h1 className='contentTitle marianne-bold mb-32'>
                  <FormattedMessage id='app.baro-national.main-title' />
                </h1>
                <p>
                  <GlossaryFormattedMessage
                    intlKey='app.baro-national.intro'
                    glossaryKey='acces-ouvert'
                  />
                </p>
              </Col>
            </Row>
          </Container>
          <Glossary entries={GlossaryEntries} />
          <DataCardSection lang={lang} />
        </Row>
        <Row>
          <GraphNavigation
            mobileTitleIntl={mobileButtonLabel[lang][location.pathname]}
          >
            <GraphItem
              mainLabel={intl.formatMessage({ id: 'app.publi.general' })}
              paths={['/publications/general']}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.dynamique',
                  }),
                  href: '/publications/general?id=general.dynamique-ouverture',
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.voies',
                  }),
                  href: '/publications/general?id=general.voies-ouverture',
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.genres',
                  }),
                  href: '/publications/general?id=general.genres-ouverture',
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.langues',
                  }),
                  href: '/publications/general?id=general.langues-ouverture',
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-publi.general.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='general.dynamique-ouverture'
                >
                  <ChartTauxOuverture />
                  <ChartEvolutionProportion />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-publi.general.voies-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='general.voies-ouverture'
                >
                  <ChartRepartitionTaux />
                  <ChartEvolutionTaux />
                  <ChartRepartitionPublications />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-publi.general.genres-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='general.genres-ouverture'
                >
                  <ChartGenreOuverture />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-publi.general.langues-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='general.langues-ouverture'
                >
                  <ChartLanguesOuverture />
                </QuestionSection>
              </GraphContent>
            </GraphItem>
            <GraphItem
              paths={['/publications/disciplines']}
              mainLabel={intl.formatMessage({
                id: 'app.publi.disciplines',
              })}
              links={[
                {
                  href: '/publications/disciplines?id=disciplines.dynamique-ouverture',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.disciplines.dynamique',
                  }),
                },
                {
                  href: '/publications/disciplines?id=disciplines.voies-ouverture',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.disciplines.voies',
                  }),
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-publi.disciplines.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='disciplines.dynamique-ouverture'
                >
                  <ChartTauxOuvertureDisciplines />
                  <ChartEvolutionTauxOuvertureDisciplines />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.disciplines.voies-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='disciplines.voies-ouverture'
                >
                  <ChartRepartitionPublicationsDisciplines />
                  <ChartEvolutionComparaisonTypesHebergementDisciplines />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            <GraphItem
              paths={['/publications/editeurs']}
              mainLabel={intl.formatMessage({ id: 'app.publi.editeurs' })}
              links={[
                {
                  href: '/publications/editeurs?id=publishers.dynamique-ouverture',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.dynamique',
                  }),
                },
                {
                  href: '/publications/editeurs?id=publishers.type-ouverture',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.modele',
                  }),
                },
                {
                  href: '/publications/editeurs?id=publishers.politiques-ouverture',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.politique',
                  }),
                },
                {
                  href: '/publications/editeurs?id=publishers.poids-revues',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.revues',
                  }),
                },
                {
                  href: '/publications/editeurs?id=publishers.repartition-licences',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.licences',
                  }),
                },
                {
                  href: '/publications/editeurs?id=publishers.couts-publication',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.editeurs.frais',
                  }),
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-publi.publishers.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='publishers.dynamique-ouverture'
                >
                  <ChartTauxOuverturePublishers />
                  <ChartEvolutionProportionPublishers />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.publishers.type-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='publishers.type-ouverture'
                >
                  <ChartEvolutionRepartitionPublishers />
                  <ChartRepartitionModelesPublishers />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.publishers.politiques-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='publishers.politiques-ouverture'
                >
                  <ChartClassementPublishers />
                  <ChartComparaisonPublishers />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.publishers.poids-revues'
                  backgroundColor={bluesoft25}
                  anchorId='publishers.poids-revues'
                >
                  <ChartRepartitionPublishers />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.publishers.repartition-licences'
                  backgroundColor={bluesoft50}
                  anchorId='publishers.repartition-licences'
                >
                  <ChartRepartitionLicencesPublishers />
                  <ChartClassementLicencesPublishers />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.publishers.couts-publication'
                  backgroundColor={bluesoft25}
                  anchorId='publishers.couts-publication'
                >
                  <ChartDepensesEstimeesPublishers />
                  <ChartDistributionPublishers />
                  <ChartDistributionParAnnee />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            <GraphItem
              paths={['/publications/archives']}
              mainLabel={intl.formatMessage({ id: 'app.publi.archives' })}
              links={[
                {
                  href: '/publications/archives?id=repositories.dynamique-ouverture',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.archives.dynamique',
                  }),
                },
                {
                  href: '/publications/archives?id=repositories.plus-utilisees',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.archives.utilisees',
                  }),
                },
                {
                  href: '/publications/archives?id=repositories.dynamique-depot',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.archives.depot',
                  }),
                },
                {
                  href: '/publications/archives?id=repositories.dynamique-hal',
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.archives.hal',
                  }),
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-publi.repositories.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='repositories.dynamique-ouverture'
                >
                  <ChartTauxOuvertureArchives />
                  <ChartTauxPresenceRepositories />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.repositories.plus-utilisees'
                  backgroundColor={bluesoft25}
                  anchorId='repositories.plus-utilisees'
                >
                  <ChartNombreDocumentsRepositories />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.repositories.dynamique-depot'
                  backgroundColor={bluesoft50}
                  anchorId='repositories.dynamique-depot'
                >
                  <ChartNombreDocumentsDepotsRepositories />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.repositories.dynamique-hal'
                  backgroundColor={bluesoft25}
                  anchorId='repositories.dynamique-hal'
                >
                  <ChartTauxCouvertureHAL />
                </QuestionSection>
              </GraphContent>
            </GraphItem>
          </GraphNavigation>
        </Row>
      </section>
    </Container>
  );
}
