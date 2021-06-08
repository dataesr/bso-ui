import { Col, Row } from '@dataesr/react-dsfr';
import React from 'react';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';

function Projet() {
  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-32'
          color1='blue-soft-125'
          color2='blue-soft-75'
        />
      </Col>
    </Row>
  );

  return (
    <div className='projet'>
      <Banner
        backgroundColor='blue-soft-50'
        textColor='blue-dark-125'
        supTitle='Baromètre français de la Science ouverte'
        title='Le projet'
        icons={renderIcons}
      />
    </div>
  );
}

export default Projet;
