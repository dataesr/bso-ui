import { Col, Row } from '@dataesr/react-dsfr';
import React from 'react';

import Banner from '../../components/Banner';
import Chip from '../../components/Chip';
import Icon from '../../components/Icon';

function Theme() {
  const renderChip = (
    <Chip title='Site mis à jour le 2 février 2021 avec les données 2013 à 2020' />
  );
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
    <div className='themes'>
      <Banner
        backgroundColor='blue-soft-100'
        supTitle='Baromètre français de la Science ouverte'
        title="Par thèmes d'actualité"
        subTitle='Il mesure l’évolution de l’accès ouvert de la recherche
en France à partir de données fiables, ouvertes et maîtrisées.'
        chip={renderChip}
        icons={renderIcons}
      />
    </div>
  );
}

export default Theme;
