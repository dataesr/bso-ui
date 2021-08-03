import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Banner from '../../components/Banner';
import Chip from '../../components/Chip';
import DataCard from '../../components/DataCard';
import Glossary from '../../components/Glossary';
import Icon from '../../components/Icon';
import GlossaryEntries from '../../translations/glossary.json';

function Theme() {
  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='4 md-2'>
        <Icon name='icon-bsso-3' color1='blue-soft-125' color2='pink-dark-25' />
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
    <section className='themes'>
      <Banner
        backgroundColor='blue-soft-100'
        supTitle={<FormattedMessage id='app.header.title' />}
        title='Par thèmes d’actualité'
        subTitle='Il mesure l’évolution de l’accès ouvert de la recherche
en France à partir de données fiables, ouvertes et maîtrisées.'
        chip={<Chip />}
        icons={renderIcons}
        selectNavigation={{
          title: 'Title',
          onChange: () => {},
          options: [
            { label: 'Label', value: 'value1' },
            { label: 'Label', value: 'value1' },
          ],
        }}
      />
      <Container>
        <Glossary entries={GlossaryEntries} />
        <p>
          Lorem ipsum dolor sit amet,
          <span className='glossary-entry' data-glossary-key='hal'>
            Archive HAL
          </span>
          adipisicing elit. Alias, facere illum laborum maxime quo reiciendis
          tenetur vel. Aut blanditiis consectetur delectus, ducimus et eveniet
          ex libero maxime praesentium quae quod?
        </p>
        <p>
          Lorem
          <span className='glossary-entry' data-glossary-key='apc'>
            Frais de publications
          </span>
          ipsum dolor sit amet, consectetur adipisicing elit. Ad
          <span className='glossary-entry' data-glossary-key='unpaywall'>
            unpaywall
          </span>
          delectus ea ex fugiat hic, illum quibusdam repudiandae? Aut distinctio
          dolor dolorem eveniet id itaque iusto, sed ullam
          <span className='glossary-entry' data-glossary-key='doi'>
            les dois
          </span>
          vitae.
        </p>
        <Row gutters>
          <Col>
            <DataCard
              topData={"L'Allemagne"}
              buttonLabel='Voir en détail'
              sentence='elle a Merkel'
            />
          </Col>
          <Col>
            <DataCard
              topData={"L'Allemagne"}
              buttonLabel='Voir en détail'
              sentence='elle a Merkel'
            />
          </Col>
          <Col>
            <DataCard
              topData={"L'Allemagne"}
              buttonLabel='Voir en détail'
              sentence='elle a Merkel'
            />
          </Col>
          <Col>
            <DataCard
              topData={"L'Allemagne"}
              buttonLabel='Voir en détail'
              sentence='elle a Merkel'
            />
          </Col>
        </Row>
      </Container>
      <Container>
        <Row gutters>
          <Col>
            <DataCard
              topData={"L'Allemagne"}
              buttonLabel='Voir en détail'
              sentence='elle a Merkel'
            />
          </Col>
          <Col>
            <DataCard
              topData={"L'Allemagne"}
              buttonLabel='Voir en détail'
              sentence='elle a Merkel'
            />
          </Col>
          <Col>
            <DataCard
              topData={"L'Allemagne"}
              buttonLabel='Voir en détail'
              sentence='elle a Merkel'
            />
          </Col>
          <Col>
            <DataCard
              topData={"L'Allemagne"}
              buttonLabel='Voir en détail'
              sentence='elle a Merkel'
            />
          </Col>
        </Row>
        <Row gutters>
          <Col>
            <DataCard
              topData={"L'Allemagne"}
              buttonLabel='Voir en détail'
              sentence='elle a Merkel'
            />
          </Col>
          <Col>
            <DataCard
              topData={"L'Allemagne"}
              buttonLabel='Voir en détail'
              sentence='elle a Merkel'
            />
          </Col>
          <Col>
            <DataCard
              topData={"L'Allemagne"}
              buttonLabel='Voir en détail'
              sentence='elle a Merkel'
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Theme;
