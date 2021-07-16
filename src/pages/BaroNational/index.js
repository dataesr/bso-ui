import { Col, Row } from '@dataesr/react-dsfr';
import React from 'react';

import Banner from '../../components/Banner';
import Chip from '../../components/Chip';
import Icon from '../../components/Icon';

function BaroNational() {
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
    <div className='BaroNational'>
      <Banner
        backgroundColor='blue-dark-125'
        supTitle='Bienvenue sur'
        title='le Baromètre français de la sciences Ouverte'
        subTitle='Il mesure l’évolution de l’accès ouvert de la recherche en France
à partir de données fiables, ouvertes et maîtrisées.'
        link={{ label: 'Voir la dernière note flash', url: '' }}
        icons={renderIcons}
        chip={<Chip />}
      />
    </div>
  );
}

export default BaroNational;
