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
                  label: 'La dynamique d’ouverture en santé',
                  href: '/publications/general#dynamique',
                },
                {
                  label: "Les voies d'ouverture",
                  href: '/publications/general#voies',
                },
                {
                  label: 'Les genres les plus ouverts',
                  href: '/publications/general#genres',
                },
                {
                  label: 'Les langues des productions',
                  href: '/publications/general#langues',
                },
                {
                  label: 'Le financement',
                  href: '/publications/general#financement',
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-publi.general.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='dynamique'
                >
                  <ChartTauxOuverture />
                  <ChartEvolutionProportion />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-publi.general.voies-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='voies'
                >
                  <ChartRepartitionTaux />
                  <ChartEvolutionTaux />
                  <ChartRepartitionPublications />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-publi.general.genres-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='genres'
                >
                  <ChartGenreOuverture />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-publi.general.langues-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='langues'
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
                  href: '/publications/disciplines#dynamique',
                  label: "La dynamique d'ouverture par discipline",
                },
                {
                  href: '/publications/disciplines#voies',
                  label: "Les voies d'ouverture par discipline",
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-publi.disciplines.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='dynamique'
                >
                  <ChartTauxOuvertureDisciplines />
                  <ChartEvolutionTauxOuvertureDisciplines />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.disciplines.voies-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='voies'
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
                  href: '/publications/editeurs#dynamique',
                  label: "La dynamique d'ouverture des éditeurs et plateformes",
                },
                {
                  href: '/publications/editeurs#type',
                  label: 'Les modèles économiques',
                },
                {
                  href: '/publications/editeurs#politique',
                  label: "Les politiques d'ouverture",
                },
                {
                  href: '/publications/editeurs#predatory',
                  label: 'Les revues prédatrices',
                },
                {
                  href: '/publications/editeurs#licences',
                  label: 'Les licences ouvertes',
                },
                {
                  href: '/publications/editeurs#apc',
                  label: 'Les frais de publication',
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-publi.publishers.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='dynamique'
                >
                  <ChartTauxOuverturePublishers />
                  <ChartEvolutionProportionPublishers />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.publishers.type-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='type'
                >
                  <ChartEvolutionRepartitionPublishers />
                  <ChartRepartitionModelesPublishers />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.publishers.politiques-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='politique'
                >
                  <ChartClassementPublishers />
                  <ChartComparaisonPublishers />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.publishers.poids-revues'
                  backgroundColor={bluesoft25}
                  anchorId='predatory'
                >
                  <ChartRepartitionPublishers />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.publishers.repartition-licences'
                  backgroundColor={bluesoft50}
                  anchorId='licences'
                >
                  <ChartRepartitionLicencesPublishers />
                  <ChartClassementLicencesPublishers />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.publishers.couts-publication'
                  backgroundColor={bluesoft25}
                  anchorId='apc'
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
                  href: '/publications/archives#dynamique',
                  label: "La dynamique d'ouverture sur archives ouvertes",
                },
                {
                  href: '/publications/archives#plus-utilisees',
                  label: 'Les archives ouvertes les plus utilisées',
                },
                {
                  href: '/publications/archives#depots',
                  label: 'La dynamique de dépôts par archive',
                },
                {
                  href: '/publications/archives#hal',
                  label: 'La place de HAL',
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.national-publi.repositories.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='dynamique'
                >
                  <ChartTauxOuvertureArchives />
                  <ChartTauxPresenceRepositories />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.repositories.plus-utilisees'
                  backgroundColor={bluesoft25}
                  anchorId='plus-utilisees'
                >
                  <ChartNombreDocumentsRepositories />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.repositories.dynamique-depot'
                  backgroundColor={bluesoft50}
                  anchorId='depots'
                >
                  <ChartNombreDocumentsDepotsRepositories />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.repositories.dynamique-hal'
                  backgroundColor={bluesoft25}
                  anchorId='hal'
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
