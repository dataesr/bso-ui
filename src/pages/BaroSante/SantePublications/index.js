import { Col, Container, Row } from '@dataesr/react-dsfr';
import Axios from 'axios';
import React, { useState } from 'react';
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
import { ES_API_URL, HEADERS } from '../../../config/config';
import GlossaryWords from '../../../translations/glossary.json';

const objLocation = {
  '/sante/publications/dynamique': 'La dynamique d’ouverture en santé',
  '/sante/publications/general': 'Général',
};
function SantePublications() {
  const [rate, setRate] = useState(null);
  const location = useLocation();

  const getOpenPublicationRate = async (mill) => {
    const publicationsSearch = await Axios.post(
      ES_API_URL,
      {
        size: 0,
        aggs: {
          by_publication_year: {
            terms: {
              field: 'publication_year',
            },
            aggs: {
              by_is_oa: {
                terms: {
                  field: `oa_details.${mill}.is_oa`,
                },
              },
            },
          },
        },
      },
      HEADERS,
    );
    const sortedData = publicationsSearch?.data?.aggregations.by_publication_year.buckets
      .sort((a, b) => a.key - b.key)
      .filter(
        (el) => el.key < parseInt(mill.substring(0, 4), 10)
            && el.by_is_oa.buckets.length > 0
            && el.doc_count
            && el.key > 2012,
      );

    const truncatedData = sortedData.map((elm) => Math.trunc((elm.by_is_oa.buckets[0].doc_count * 100) / elm.doc_count));
    if (!rate) {
      setTimeout(() => {
        setRate(truncatedData[truncatedData.length - 1]);
      }, 2000);
    }
  };
  getOpenPublicationRate('2020');
  const renderChip = (
    <Chip label='Site mis à jour le 2 février 2021 avec les données 2013 à 2020' />
  );
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
        chip={renderChip}
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
                  <span className='glossary-entry' data-glossary-key='essais'>
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
          <Glossary words={GlossaryWords} />
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
          <GraphSection buttonLabel={objLocation[location.pathname]}>
            <GraphItem
              paths={[
                '/sante/publications/general',
                '/health/publications/general',
              ]}
              mainLabel='Général'
              links={[
                {
                  label: 'Les publications en santé',
                  href: '/sante/publications/general',
                },
              ]}
            >
              <GraphContent>
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
              paths={['/sante/publications/dynamique']}
              mainLabel='La dynamique d’ouverture en santé'
              links={[
                {
                  label: 'La dynamique d’ouverture en santé',
                  href: '/sante/publications/dynamique',
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
              </GraphContent>
            </GraphItem>
          </GraphSection>
        </Row>
      </section>
    </Container>
  );
}

export default SantePublications;
