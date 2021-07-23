import { Col, Container, Row } from '@dataesr/react-dsfr';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

import Banner from '../../../components/Banner';
import ChartGenreOuverture from '../../../components/charts/publications/general/genres-ouverture/genres-ouverture';
import ChartEvolutionTaux from '../../../components/charts/publications/general/voies-ouverture/chart-evolution-taux';
import ChartRepartitionPublications from '../../../components/charts/publications/general/voies-ouverture/chart-repartition-publications';
import ChartRepartitionTaux from '../../../components/charts/publications/general/voies-ouverture/chart-repartition-taux';
import Chip from '../../../components/Chip';
import DataCard from '../../../components/DataCard';
import Glossary from '../../../components/Glossary';
import GlossaryFormattedMessage from '../../../components/Glossary/GlossaryFormattedMessage';
import GraphSection from '../../../components/GraphNavigation';
import GraphContent from '../../../components/GraphNavigation/GraphContent';
import GraphItem from '../../../components/GraphNavigation/GraphItem';
import Icon from '../../../components/Icon';
import QuestionSection from '../../../components/question-section';
import { bluesoft50 } from '../../../style/colours.module.scss';
import GlossaryEntries from '../../../translations/glossary.json';
import useGlobals from '../../../utils/Hooks/useGetGlobals';
import useGetPublicationRateFrom from '../../../utils/Hooks/useGetPublicationRateFrom';
import useLang from '../../../utils/Hooks/useLang';

const objButtonLabel = {
  fr: {
    '/sante/publications/discipline': 'app.sante-publi.disciplines',
    '/sante/publications/general': 'app.sante-publi.general',
  },
  en: {
    '/health/publications/discipline': 'app.sante-publi.disciplines',
    '/health/publications/general': 'app.sante-publi.general',
  },
};

function SantePublications() {
  const { lang } = useLang();
  const [rate, setRate] = useState(null);
  const location = useLocation();
  const { observationDates } = useGlobals();

  useGetPublicationRateFrom(observationDates[1] || '2021Q1').then((resp) => {
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
        supTitle={<FormattedMessage id='app.baro-sante.sub-title' />}
        title={<FormattedMessage id='app.baro-sante.title' />}
        chip={<Chip />}
        icons={renderIcons}
        selectNavigation={{
          title: 'Navigation par objet de recherche',
          onChange: () => {},
          options: [
            { label: 'Label', value: 'value1' },
            { label: 'Label', value: 'value2' },
          ],
        }}
      />
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
                    glossaryKey='acces_ouvert'
                  />
                </p>
              </Col>
            </Row>
          </Container>
          <Glossary entries={GlossaryEntries} />
          <Container>
            <section className='pb-32'>
              <Row gutters>
                <Col n='12 md-4'>
                  <DataCard
                    percentage={rate}
                    buttonLabel='Voir en détail'
                    sentence={
                      "Taux d'ouverture des publications françaises dans le domaine de la santé millésime 2020"
                    }
                    background='yellow'
                  />
                </Col>
                <Col n='12 md-4'>
                  <DataCard
                    percentage={rate}
                    buttonLabel='Voir en détail'
                    background='aqua'
                    sentence={
                      "Taux d'ouverture des publications françaises dans le domaine de la santé millésime 2020"
                    }
                  />
                </Col>
                <Col n='12 md-4'>
                  <DataCard
                    background='pink'
                    percentage={rate}
                    buttonLabel='Voir en détail'
                    sentence={
                      "Taux d'ouverture des publications françaises dans le domaine de la santé millésime 2020"
                    }
                  />
                </Col>
              </Row>
            </section>
          </Container>
        </Row>
        <Row>
          <GraphSection buttonLabel={objButtonLabel[lang][location.pathname]}>
            <GraphItem
              mainLabel='Général'
              paths={[
                '/sante/publications/general',
                '/health/publications/general',
              ]}
              links={[
                {
                  anchor: 'general',
                  label: 'Les publications en santé',
                  href: '/sante/publications/general#general',
                },
                {
                  anchor: 'dynamic',
                  label: 'La dynamique d’ouverture en santé',
                  href: '/sante/publications/general#dynamic',
                },
              ]}
            >
              <GraphContent>
                <QuestionSection
                  intlKey='app.sante-publi.general.voies-ouverture'
                  backgroundColor={bluesoft50}
                >
                  <ChartRepartitionTaux />
                  <ChartEvolutionTaux />
                  <ChartRepartitionPublications />
                </QuestionSection>
                <QuestionSection
                  intlKey='app.sante-publi.general.genres-ouverture'
                  backgroundColor={bluesoft50}
                >
                  <ChartGenreOuverture />
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
                <div id='#discipline'>
                  <p>Disciplines</p>
                </div>
              </GraphContent>
            </GraphItem>
          </GraphSection>
        </Row>
      </section>
    </Container>
  );
}

export default SantePublications;
