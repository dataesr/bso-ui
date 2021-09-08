import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import Banner from '../../../components/Banner';
import BSOChart from '../../../components/Charts';
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
                  <BSOChart id='publi.general.dynamique-ouverture.chart-taux-ouverture' />
                  <BSOChart id='publi.general.dynamique-ouverture.chart-evolution-proportion' />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-publi.general.voies-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='general.voies-ouverture'
                >
                  <BSOChart id='publi.general.voies-ouverture.chart-repartition-taux' />
                  <BSOChart id='publi.general.voies-ouverture.chart-evolution-taux' />
                  <BSOChart id='publi.general.voies-ouverture.chart-repartition-publications' />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-publi.general.genres-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='general.genres-ouverture'
                >
                  <BSOChart id='publi.general.genres-ouverture.chart-repartition-genres' />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.national-publi.general.langues-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='general.langues-ouverture'
                >
                  <BSOChart id='publi.general.langues-ouverture.chart-repartition-publications' />
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
                  <BSOChart id='publi.disciplines.dynamique-ouverture.chart-taux-ouverture' />
                  <BSOChart id='publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture' />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.disciplines.voies-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='disciplines.voies-ouverture'
                >
                  <BSOChart id='publi.disciplines.voies-ouverture.chart-repartition-publications' />
                  <BSOChart id='publi.disciplines.voies-ouverture.chart-evolution-comparaison-types-hebergement' />
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
                  <BSOChart id='publi.publishers.dynamique-ouverture.chart-taux-ouverture' />
                  <BSOChart id='publi.publishers.dynamique-ouverture.chart-evolution-proportion' />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.publishers.type-ouverture'
                  backgroundColor={bluesoft25}
                  anchorId='publishers.type-ouverture'
                >
                  <BSOChart id='publi.publishers.type-ouverture.chart-evolution-repartition' />
                  <BSOChart id='publi.publishers.type-ouverture.chart-repartition-modeles' />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.publishers.politiques-ouverture'
                  backgroundColor={bluesoft50}
                  anchorId='publishers.politiques-ouverture'
                >
                  <BSOChart id='publi.publishers.politiques-ouverture.chart-classement' />
                  <BSOChart id='publi.publishers.politiques-ouverture.chart-comparaison' />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.publishers.poids-revues'
                  backgroundColor={bluesoft25}
                  anchorId='publishers.poids-revues'
                >
                  <BSOChart id='publi.publishers.poids-revues.chart-repartition' />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.publishers.repartition-licences'
                  backgroundColor={bluesoft50}
                  anchorId='publishers.repartition-licences'
                >
                  <BSOChart id='publi.publishers.repartition-licences.chart-repartition' />
                  <BSOChart id='publi.publishers.repartition-licences.chart-classement' />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.publishers.couts-publication'
                  backgroundColor={bluesoft25}
                  anchorId='publishers.couts-publication'
                >
                  <BSOChart id='publi.publishers.couts-publication.chart-depenses-estimees' />
                  <BSOChart id='publi.publishers.couts-publication.chart-distribution' />
                  <BSOChart id='publi.publishers.couts-publication.chart-distribution-par-annee' />
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
                  <BSOChart id='publi.repositories.dynamique-ouverture.chart-taux-ouverture' />
                  <BSOChart id='publi.repositories.dynamique-ouverture.chart-evolution-proportion' />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.repositories.plus-utilisees'
                  backgroundColor={bluesoft25}
                  anchorId='repositories.plus-utilisees'
                >
                  <BSOChart id='publi.repositories.plus-utilisees.chart-nombre-documents' />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.repositories.dynamique-depot'
                  backgroundColor={bluesoft50}
                  anchorId='repositories.dynamique-depot'
                >
                  <BSOChart id='publi.repositories.dynamique-depot.chart-nombre-documents-depots' />
                </QuestionSection>

                <QuestionSection
                  intlKey='app.national-publi.repositories.dynamique-hal'
                  backgroundColor={bluesoft25}
                  anchorId='repositories.dynamique-hal'
                >
                  <BSOChart id='publi.repositories.dynamique-hal.chart-couverture-hal' />
                </QuestionSection>
              </GraphContent>
            </GraphItem>
          </GraphNavigation>
        </Row>
      </section>
    </Container>
  );
}
