import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import Banner from '../../../components/Banner';
import ChartEvolutionProportionAffiliations from '../../../components/charts/publications/affiliations/dynamique-ouverture/chart-evolution-proportion';
import ChartTauxOuvertureAffiliations from '../../../components/charts/publications/affiliations/dynamique-ouverture/chart-taux-ouverture';
import ChartClassementPays from '../../../components/charts/publications/affiliations/pays/chart-classement-pays';
import ChartEvolutionTauxOuvertureRangUtile from '../../../components/charts/publications/affiliations/pays/chart-taux-rang-utile';
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
import ChartRepartitionDeclarations from '../../../components/charts/publications/general/impact-financement/chart-repartition-declarations';
import ChartTauxOuvertureFinancement from '../../../components/charts/publications/general/impact-financement/chart-taux-ouverture';
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

function SantePublications() {
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
        backgroundColor='blue-soft-100'
        homeLink={urls.sante[lang]}
        supTitle={<FormattedMessage id='app.header.title-health' />}
        title={<FormattedMessage id='app.baro-sante.title' />}
        chip={<Chip />}
        icons={renderIcons}
        selectNavigation={{
          title: intl.formatMessage({ id: 'app.navigation.objet-recherche' }),
          selected: intl.formatMessage({
            id: 'url.sante.publications.general',
          }),
          options: [
            {
              label: intl.formatMessage({ id: 'app.baro-sante.title' }),
              value: intl.formatMessage({
                id: 'url.sante.publications.general',
              }),
            },
            {
              label: intl.formatMessage({
                id: 'app.header.nav.baro-sante-essais',
              }),
              value: intl.formatMessage({ id: 'url.sante.essais' }),
            },
            {
              label: intl.formatMessage({ id: 'app.baro-sante.etudes.title' }),
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
                  label: 'La dynamique d’ouverture en santé',
                  href: '/sante/publications/general#dynamique',
                },
                {
                  label: "Les voies d'ouverture",
                  href: '/sante/publications/general#voies',
                },
                {
                  label: 'Les genres les plus ouverts',
                  href: '/sante/publications/general#genres',
                },
                {
                  label: 'Les langues des productions',
                  href: '/sante/publications/general#langues',
                },
                {
                  label: 'Le financement',
                  href: '/sante/publications/general#financement',
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.sante-publi.general.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='dynamique'
                >
                  <ChartTauxOuverture
                    id='app.sante-publi.general.dynamique-ouverture.chart-taux-ouverture'
                    domain='health'
                  />
                  <ChartEvolutionProportion
                    id='app.sante-publi.general.dynamique-ouverture.chart-evolution-proportion'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.general.voies-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='voies'
                >
                  <ChartRepartitionTaux
                    id='app.sante-publi.general.voies-ouverture.chart-repartition-taux'
                    domain='health'
                  />
                  <ChartEvolutionTaux
                    id='app.sante-publi.general.voies-ouverture.chart-evolution-taux'
                    domain='health'
                  />
                  <ChartRepartitionPublications
                    id='app.sante-publi.general.voies-ouverture.chart-repartition-publications'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.general.genres-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='genres'
                >
                  <ChartGenreOuverture
                    id='app.sante-publi.general.genres-ouverture.chart-repartition-genres'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.general.langues-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='langues'
                >
                  <ChartLanguesOuverture
                    id='app.sante-publi.general.langues-ouverture.chart-repartition-publications'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.general.impact-financement'
                  backgroundColor={bluesoft50}
                  anchorId='financement'
                >
                  <ChartTauxOuvertureFinancement
                    id='app.sante-publi.general.impact-financement.chart-taux-ouverture'
                    domain='health'
                  />
                  <ChartRepartitionDeclarations
                    id='app.sante-publi.general.impact-financement.chart-repartition-financements'
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
                  href: '/sante/publications/disciplines#dynamique',
                  label: "La dynamique d'ouverture par discipline",
                },
                {
                  href: '/sante/publications/disciplines#voies',
                  label: "Les voies d'ouverture par discipline",
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.sante-publi.disciplines.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='dynamique'
                >
                  <ChartTauxOuvertureDisciplines
                    id='app.sante-publi.disciplines.dynamique-ouverture.chart-taux-ouverture'
                    domain='health'
                  />
                  <ChartEvolutionTauxOuvertureDisciplines id='app.sante-publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture' />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.disciplines.voies-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='voies'
                >
                  <ChartRepartitionPublicationsDisciplines id='app.sante-publi.disciplines.voies-ouverture.chart-repartition-publications' />
                  <ChartEvolutionComparaisonTypesHebergementDisciplines id='app.sante-publi.disciplines.voies-ouverture.chart-evolution-comparaison-types-hebergement' />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            <GraphItem
              paths={['/sante/publications/editeurs']}
              mainLabel={intl.formatMessage({ id: 'app.publi.editeurs' })}
              links={[
                {
                  href: '/sante/publications/editeurs#dynamique',
                  label: "La dynamique d'ouverture des éditeurs et plateformes",
                },
                {
                  href: '/sante/publications/editeurs#type',
                  label: 'Les modèles économiques',
                },
                {
                  href: '/sante/publications/editeurs#politique',
                  label: "Les politiques d'ouverture",
                },
                {
                  href: '/sante/publications/editeurs#predatory',
                  label: 'Les revues prédatrices',
                },
                {
                  href: '/sante/publications/editeurs#licences',
                  label: 'Les licences ouvertes',
                },
                {
                  href: '/sante/publications/editeurs#apc',
                  label: 'Les frais de publication',
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.sante-publi.publishers.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='dynamique'
                >
                  <ChartTauxOuverturePublishers
                    id='app.sante-publi.publishers.dynamique-ouverture.chart-taux-ouverture'
                    domain='health'
                  />
                  <ChartEvolutionProportionPublishers
                    id='app.sante-publi.publishers.dynamique-ouverture.chart-evolution-proportion'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.publishers.type-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='type'
                >
                  <ChartEvolutionRepartitionPublishers
                    id='app.sante-publi.publishers.type-ouverture.chart-evolution-repartition'
                    domain='health'
                  />
                  <ChartRepartitionModelesPublishers
                    id='app.sante-publi.publishers.type-ouverture.chart-repartition-modeles'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.publishers.politiques-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='politique'
                >
                  <ChartClassementPublishers
                    id='app.sante-publi.publishers.politiques-ouverture.chart-classement'
                    domain='health'
                  />
                  <ChartComparaisonPublishers
                    id='app.sante-publi.publishers.politiques-ouverture.chart-classement'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.publishers.poids-revues'
                  backgroundColor={bluesoft25}
                  anchorId='predatory'
                >
                  <ChartRepartitionPublishers id='app.national-publi.publishers.poids-revues.chart-repartition' />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.publishers.repartition-licences'
                  backgroundColor={bluesoft50}
                  anchorId='licences'
                >
                  <ChartRepartitionLicencesPublishers
                    domain='health'
                    id='app.sante-publi.publishers.repartition-licences.chart-repartition'
                  />
                  <ChartClassementLicencesPublishers
                    domain='health'
                    id='app.sante-publi.publishers.repartition-licences.chart-classement'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.publishers.couts-publication'
                  backgroundColor={bluesoft25}
                  anchorId='apc'
                >
                  <ChartDepensesEstimeesPublishers
                    id='app.sante-publi.publishers.couts-publication.chart-depenses-estimees'
                    domain='health'
                  />
                  <ChartDistributionPublishers
                    id='app.sante-publi.publishers.couts-publication.chart-distribution'
                    domain='health'
                  />
                  <ChartDistributionParAnnee
                    id='app.sante-publi.publishers.couts-publication.chart-distribution-par-annee'
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
                  href: '/sante/publications/archives#dynamique',
                  label: "La dynamique d'ouverture sur archives ouvertes",
                },
                {
                  href: '/sante/publications/archives#plus-utilisees',
                  label: 'Les archives ouvertes les plus utilisées',
                },
                {
                  href: '/sante/publications/archives#depots',
                  label: 'La dynamique de dépôts par archive',
                },
                {
                  href: '/sante/publications/archives#hal',
                  label: 'La place de HAL',
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.sante-publi.repositories.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='dynamique'
                >
                  <ChartTauxOuvertureArchives
                    id='app.sante-publi.repositories.dynamique-ouverture.chart-taux-ouverture'
                    domain='health'
                  />
                  <ChartTauxPresenceRepositories
                    id='app.sante-publi.repositories.dynamique-ouverture.chart-evolution-proportion'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.repositories.plus-utilisees'
                  backgroundColor={bluesoft25}
                  anchorId='plus-utilisees'
                >
                  <ChartNombreDocumentsRepositories
                    id='app.sante-publi.repositories.plus-utilisees.chart-nombre-documents'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.repositories.dynamique-depot'
                  backgroundColor={bluesoft50}
                  anchorId='depots'
                >
                  <ChartNombreDocumentsDepotsRepositories
                    id='app.sante-publi.repositories.dynamique-depot.chart-nombre-documents-depots'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.repositories.dynamique-hal'
                  backgroundColor={bluesoft25}
                  anchorId='hal'
                >
                  <ChartTauxCouvertureHAL
                    id='app.sante-publi.repositories.dynamique-hal.chart-couverture-hal'
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
                  href: '/sante/publications/affiliations#dynamique',
                  label: "La dynamique d'ouverture par type d'affiliation",
                },
                {
                  href: '/sante/publications/affiliations#pays',
                  label: "Impact des pays d'affiliation",
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.sante-publi.affiliations.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='dynamique'
                >
                  <ChartTauxOuvertureAffiliations
                    id='app.sante-publi.affiliations.dynamique-ouverture.chart-taux-ouverture'
                    domain='health'
                  />
                  <ChartEvolutionProportionAffiliations
                    id='app.sante-publi.affiliations.dynamique-ouverture.chart-evolution-proportion'
                    domain='health'
                  />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.affiliations.pays'
                  backgroundColor={bluesoft50}
                  anchorId='pays'
                >
                  <ChartEvolutionTauxOuvertureRangUtile
                    id='app.sante-publi.affiliations.pays.chart-taux-rang-utile'
                    domain='health'
                  />
                  <ChartClassementPays
                    id='app.sante-publi.affiliations.pays.chart-classement-pays'
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
