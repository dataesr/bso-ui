import { Col, Container, Row } from '@dataesr/react-dsfr';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import Banner from '../../../components/Banner';
import ChartEvolutionProportionAffiliations from '../../../components/charts/publications/affiliations/dynamique-ouverture/chart-evolution-proportion';
import ChartTauxOuvertureAffiliations from '../../../components/charts/publications/affiliations/dynamique-ouverture/chart-taux-ouverture';
import ChartNombreDocumentsDepotsRepositories from '../../../components/charts/publications/archives/dynamique-depot/chart-nombre-documents-depots';
import ChartTauxExhaustiviteRepositories from '../../../components/charts/publications/archives/dynamique-hal/chart-taux exhaustivite';
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
import useGlobals from '../../../utils/Hooks/useGetGlobals';
import useGetPublicationRateFrom from '../../../utils/Hooks/useGetPublicationRateFrom';
import useLang from '../../../utils/Hooks/useLang';
import DataCardSection from './dataCardSection';

const objButtonLabel = {
  fr: {
    '/sante/publications/discipline': 'app.sante-publi.disciplines',
    '/sante/publications/editeurs': 'app.sante-publi.editeurs',
    '/sante/publications/general': 'app.sante-publi.general',
    '/sante/essais-cliniques': 'app.sante-publi.general',
  },
  en: {
    '/health/publications/discipline': 'app.sante-publi.disciplines',
    '/health/publications/editeurs': 'app.sante-publi.editeurs',
    '/health/publications/general': 'app.sante-publi.general',
  },
};

function SantePublications() {
  const { lang } = useLang();
  const [rate, setRate] = useState(null);
  const location = useLocation();
  const { observationDates } = useGlobals();
  const intl = useIntl();

  useGetPublicationRateFrom(observationDates[1] || '2021Q2').then((resp) => {
    const { rate: rateByYear } = resp;
    if (!rate) {
      setRate(rateByYear);
    }
  });

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
        supTitle={<FormattedMessage id='app.header.title-health' />}
        title={<FormattedMessage id='app.baro-sante.title' />}
        chip={<Chip />}
        icons={renderIcons}
        selectNavigation={{
          title: <FormattedMessage id='app.navigation.objet-recherche' />,
          selected: <FormattedMessage id='url.sante.publications.general' />,
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
          <Container>
            <DataCardSection lang={lang} />
          </Container>
        </Row>
        <Row>
          <GraphNavigation
            buttonLabel={objButtonLabel[lang][location.pathname]}
          >
            <GraphItem
              mainLabel='Général'
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
                  <ChartTauxOuverture />
                  <ChartEvolutionProportion />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.general.voies-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='voies'
                >
                  <ChartRepartitionTaux />
                  <ChartEvolutionTaux />
                  <ChartRepartitionPublications />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.general.genres-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='genres'
                >
                  <ChartGenreOuverture />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.general.langues-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='langues'
                >
                  <ChartLanguesOuverture />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.general.impact-financement'
                  backgroundColor={bluesoft50}
                  anchorId='financement'
                >
                  <ChartTauxOuvertureFinancement />
                  <ChartRepartitionDeclarations />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            <GraphItem
              paths={['/sante/publications/discipline']}
              mainLabel='Les disciplines'
              links={[
                {
                  href: '/sante/publications/discipline',
                  label: 'Les disciplines',
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.sante-publi.disciplines.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                >
                  <ChartTauxOuvertureDisciplines />
                  <ChartEvolutionTauxOuvertureDisciplines />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.disciplines.voies-ouverture'
                  backgroundColor={bluesoft50}
                >
                  <ChartRepartitionPublicationsDisciplines />
                  <ChartEvolutionComparaisonTypesHebergementDisciplines />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            <GraphItem
              paths={['/sante/publications/editeurs']}
              mainLabel='Editeurs/Plateformes'
              links={[
                {
                  href: '/sante/publications/editeurs',
                  label: 'Les éditeurs/plateformes',
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.sante-publi.publishers.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                >
                  <ChartTauxOuverturePublishers />
                  <ChartEvolutionProportionPublishers />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.publishers.type-ouverture'
                  backgroundColor={bluesoft25}
                >
                  <ChartEvolutionRepartitionPublishers />
                  <ChartRepartitionModelesPublishers />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.publishers.politiques-ouverture'
                  backgroundColor={bluesoft50}
                >
                  <ChartClassementPublishers />
                  <ChartComparaisonPublishers />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.publishers.poids-revues'
                  backgroundColor={bluesoft25}
                >
                  <ChartRepartitionPublishers />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.publishers.repartition-licences'
                  backgroundColor={bluesoft50}
                >
                  <ChartRepartitionLicencesPublishers />
                  <ChartClassementLicencesPublishers />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.publishers.couts-publication'
                  backgroundColor={bluesoft25}
                >
                  <ChartDepensesEstimeesPublishers />
                  <ChartDistributionPublishers />
                  <ChartDistributionParAnnee />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            <GraphItem
              paths={['/sante/publications/archives']}
              mainLabel='Archives'
              links={[
                {
                  href: '/sante/publications/archives',
                  label: 'Les archives',
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.sante-publi.repositories.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                >
                  <ChartTauxOuvertureArchives />
                  <ChartTauxPresenceRepositories />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.repositories.plus-utilisees'
                  backgroundColor={bluesoft25}
                >
                  <ChartNombreDocumentsRepositories />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.repositories.dynamique-depot'
                  backgroundColor={bluesoft50}
                >
                  <ChartNombreDocumentsDepotsRepositories />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.sante-publi.repositories.dynamique-hal'
                  backgroundColor={bluesoft25}
                >
                  <ChartTauxExhaustiviteRepositories />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            <GraphItem
              paths={['/sante/publications/affiliations']}
              mainLabel='Affiliations'
              links={[
                {
                  href: '/sante/publications/affiliations',
                  label: 'Les affiliations',
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.sante-publi.repositories.dynamique-ouverture'
                  backgroundColor={bluesoft50}
                >
                  <ChartTauxOuvertureAffiliations />
                  <ChartEvolutionProportionAffiliations />
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
