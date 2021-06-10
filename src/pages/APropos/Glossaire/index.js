import { Col, Row } from '@dataesr/react-dsfr';
import React from 'react';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';

function Glossaire() {
  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-29'
          color1='blue-dark-125'
          color2='green-soft-75'
        />
      </Col>
    </Row>
  );
  return (
    <div className='glossaire'>
      <Banner
        backgroundColor='green-soft-25'
        textColor='blue-dark-125'
        supTitle='Baromètre français de la Science ouverte'
        title='Glossaire'
        icons={renderIcons}
      />
    </div>
  );
}

export default Glossaire;
