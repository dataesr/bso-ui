import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useSearchParams } from 'react-router-dom';

import Banner from '../../components/Banner';
import BSOChart from '../../components/Charts';
import GlossaryFormattedMessage from '../../components/Glossary/GlossaryFormattedMessage';
import GraphNavigation from '../../components/GraphNavigation';
import GraphContent from '../../components/GraphNavigation/GraphContent';
import GraphItem from '../../components/GraphNavigation/GraphItem';
import Icon from '../../components/Icon';
import QuestionSection from '../../components/question-section';
import ScrollTop from '../../components/ScrollTop';
import { mobileButtonLabel } from '../../utils/constants';
import { getCSSValue } from '../../utils/helpers';
import useLang from '../../utils/Hooks/useLang';

function Publishing() {
  const intl = useIntl();
  const { lang } = useLang();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const blueSoft25 = getCSSValue('--blue-soft-25');
  const blueSoft50 = getCSSValue('--blue-soft-50');

  useEffect(() => {
    searchParams.set('bsoLocalAffiliation', 'bsoedition');
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='4 md-2'>
        <Icon
          name='icon-bsso-3'
          color1='blue-soft-125'
          color2='yellow-medium-50'
        />
      </Col>
      <Col n='4 md-2'>
        <Icon
          name='icon-bsso-4'
          color1='blue-soft-125'
          color2='orange-medium-75'
        />
      </Col>
      <Col n='4 md-2'>
        <Icon
          name='icon-bsso-1'
          color1='blue-soft-125'
          color2='green-soft-50'
        />
      </Col>
      <Col n='4 md-2'>
        <Icon name='icon-bsso-5' color1='blue-soft-125' color2='blue-soft-50' />
      </Col>
      <Col n='4 md-2'>
        <Icon
          name='icon-bsso-2'
          color1='blue-soft-125'
          color2='pink-light-75'
        />
      </Col>
      <Col n='4 md-2'>
        <Icon
          name='icon-bsso-6'
          color1='blue-soft-125'
          color2='green-medium-50'
        />
      </Col>
    </Row>
  );

  return (
    <Container fluid className='page'>
      <Banner
        backgroundColor='blue-soft-150'
        icons={renderIcons}
        subTitle={<FormattedMessage id='app.publishing.header.subtitle' />}
        title={<FormattedMessage id='app.publishing.header' />}
      />
      <ScrollTop />
      <section className='content'>
        <Row>
          <Container>
            <Row>
              <Col n='12'>
                <h1 className='contentTitle marianne-bold mb-32'>
                  <FormattedMessage id='app.publishing.title' />
                </h1>
                <p>
                  <GlossaryFormattedMessage
                    intlKey='app.publishing.intro'
                    glossaryKeys={[]}
                  />
                </p>
              </Col>
            </Row>
          </Container>
        </Row>
        <Row>
          <GraphNavigation mobileTitleIntl={mobileButtonLabel[lang][pathname]}>
            {/* Général */}
            <GraphItem
              mainLabel={intl.formatMessage({ id: 'app.publi.general' })}
              paths={['/publishing/general', '/edition/general']}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/publishing/general',
                    fr: '/edition/general',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publishing.publications',
                  }),
                  href: {
                    en: '/publishing/general?id=general.publications',
                    fr: '/edition/general?id=general.publications',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publishing.title',
                  }),
                  href: {
                    en: '/publishing/general?id=general.journals',
                    fr: '/edition/general?id=general.journals',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  anchorId='general.publications'
                  backgroundColor={blueSoft50}
                  intlKey='app.publishing.publications'
                >
                  <BSOChart id='publi.general.dynamique-ouverture.chart-taux-ouverture' />
                </QuestionSection>
                <QuestionSection
                  anchorId='general.journals'
                  backgroundColor={blueSoft25}
                  intlKey='app.publishing'
                >
                  <BSOChart id='publishing.journals.sources' />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            {/* Publications */}
            <GraphItem
              mainLabel={intl.formatMessage({ id: 'app.publishing.publications' })}
              paths={['/publishing/publications', '/edition/publications']}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/publishing/publications',
                    fr: '/edition/publications',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publishing.publications.general.title',
                  }),
                  href: {
                    en: '/publishing/publications?id=publications.general',
                    fr: '/edition/publications?id=publications.general',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publishing.publications.disciplines.title',
                  }),
                  href: {
                    en: '/publishing/publications?id=publications.disciplines',
                    fr: '/edition/publications?id=publications.disciplines',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publishing.publications.publishers.title',
                  }),
                  href: {
                    en: '/publishing/publications?id=publications.publishers',
                    fr: '/edition/publications?id=publications.publishers',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  anchorId='publications.general'
                  backgroundColor={blueSoft50}
                  intlKey='app.publishing.publications.general'
                >
                  <BSOChart id='publi.general.dynamique-ouverture.chart-taux-ouverture' />
                  <BSOChart id='publi.general.dynamique-ouverture.chart-evolution-proportion' />
                  <BSOChart id='publi.general.voies-ouverture.chart-repartition-publications' />
                  <BSOChart id='publi.general.voies-ouverture.chart-repartition-taux' />
                  <BSOChart id='publi.general.langues-ouverture.chart-repartition-publications' />
                  <BSOChart id='publi.general.dynamique-ouverture.chart-taux-ouverture-article' />
                </QuestionSection>
                <QuestionSection
                  anchorId='publications.disciplines'
                  backgroundColor={blueSoft25}
                  intlKey='app.publishing.publications.disciplines'
                >
                  <BSOChart id='publi.disciplines.dynamique-ouverture.chart-taux-ouverture' />
                  <BSOChart id='publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture' />
                  <BSOChart id='publi.disciplines.voies-ouverture.chart-repartition-publications' />
                  <BSOChart id='publi.disciplines.voies-ouverture.chart-evolution-comparaison-types-hebergement' />
                </QuestionSection>
                <QuestionSection
                  anchorId='publications.publishers'
                  backgroundColor={blueSoft50}
                  intlKey='app.publishing.publications.publishers'
                >
                  <BSOChart id='publi.publishers.dynamique-ouverture.chart-taux-ouverture' />
                  <BSOChart id='publi.publishers.dynamique-ouverture.chart-evolution-proportion' />
                  <BSOChart id='publi.publishers.type-ouverture.chart-repartition-modeles' />
                  <BSOChart id='publi.publishers.type-ouverture.chart-evolution-repartition' />
                  <BSOChart id='publi.publishers.politiques-ouverture.chart-classement' />
                  <BSOChart id='publi.publishers.politiques-ouverture.chart-comparaison' />
                  <BSOChart id='publi.publishers.repartition-licences.chart-repartition' />
                  <BSOChart id='publi.publishers.repartition-licences.chart-classement' />
                  <BSOChart id='publi.publishers.couts-publication.chart-distribution' />
                </QuestionSection>
              </GraphContent>
            </GraphItem>

            {/* Journals */}
            <GraphItem
              mainLabel={intl.formatMessage({ id: 'app.publishing.journals' })}
              paths={['/publishing/journals', '/edition/revues']}
              links={[
                {
                  label: intl.formatMessage({
                    id: 'app.publi.navigation.go-to-page',
                  }),
                  href: {
                    en: '/publishing/journals',
                    fr: '/edition/revues',
                  },
                },
                {
                  label: intl.formatMessage({
                    id: 'app.publishing.journals.sources.title',
                  }),
                  href: {
                    en: '/publishing/journals?id=journals.sources',
                    fr: '/edition/revues?id=journals.sources',
                  },
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  anchorId='journals.sources'
                  backgroundColor={blueSoft50}
                  intlKey='app.publishing.journals.sources'
                >
                  <BSOChart id='publishing.journals.sources' />
                  <BSOChart id='publishing.journals.years' />
                </QuestionSection>
              </GraphContent>
            </GraphItem>
          </GraphNavigation>
        </Row>
      </section>
    </Container>
  );
}

export default Publishing;
