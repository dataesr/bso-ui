import { Col, Container, Row } from '@dataesr/react-dsfr';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

import Banner from '../../../components/Banner';
import ChartsDynamiqueOuverture from '../../../components/charts/publications/general/dynamique-ouverture';
import ChartsVoiesOuverture from '../../../components/charts/publications/general/voies-ouverture';
import Chip from '../../../components/Chip';
import DataCard from '../../../components/DataCard';
import Glossary from '../../../components/Glossary';
import GraphSection from '../../../components/GraphNavigation';
import GraphContent from '../../../components/GraphNavigation/GraphContent';
import GraphItem from '../../../components/GraphNavigation/GraphItem';
import Icon from '../../../components/Icon';
import QuestionSection from '../../../components/question-section';
import GlossaryEntries from '../../../translations/glossary.json';
import { GetPublicationRateFrom } from '../../../utils/dataFetchHelper';
import useGlobals from '../../../utils/Hooks/useGetGlobals';

const objLocation = {
  '/sante/publications/discipline': 'app.sante-publi.disciplines',
  '/sante/publications/general': 'app.sante-publi.general',
};

function SantePublications() {
  const [rate, setRate] = useState(null);
  const location = useLocation();
  const { observationDates } = useGlobals();

  GetPublicationRateFrom(observationDates[1]).then((resp) => {
    const { rateByYear } = resp;

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
        supTitle='baromètre de la Science ouverte en Santé'
        title='Les publications en santé'
        chip={<Chip />}
        icons={renderIcons}
        selectNavigation={{
          title: 'Navigation par objet de recherche',
          onChange: () => {},
          options: [
            { label: 'Label', value: 'value1' },
            { label: 'Label', value: 'value1' },
          ],
        }}
      />
      <section className='content'>
        <Row>
          <Container>
            <Row>
              <Col n='12'>
                <h1 className='contentTitle marianne-bold mb-32'>
                  Publications en santé
                </h1>
              </Col>
              <Col n='12 md-6'>
                <p>
                  Lorem ipsum dolor sit amet,
                  {' '}
                  <span
                    className='glossary-entry'
                    data-glossary-key='essai_clinique'
                  >
                    Essais cliniques déclarés
                  </span>
                  {' '}
                  consectetur adipisicing elit. Adipisci dignissimos dolorem ex
                  ipsum libero! Ad asperiores at dicta ducimus laboriosam magni,
                  maiores minima natus neque odit quibusdam rem voluptatum.
                  Officiis.
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
          <GraphSection
            buttonLabel={(
              <FormattedMessage
                id={objLocation[location.pathname]}
                defaultMessage='General'
              />
            )}
          >
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
                  title='Quelle est la dynamique d’ouverture de la santé en France ?'
                  info='info text'
                  description='description text'
                  backgroundColor='#D5DBEF'
                >
                  <ChartsDynamiqueOuverture />
                </QuestionSection>
                <QuestionSection
                  title="Quelles sont les voies d'ouverture choisies pour les publications en santé ?"
                  info='info text'
                  description='description text'
                  backgroundColor='#D5DBEF'
                >
                  <ChartsVoiesOuverture />
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
