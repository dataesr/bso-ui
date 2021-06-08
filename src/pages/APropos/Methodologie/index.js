import { Col, Row } from '@dataesr/react-dsfr';
import React from 'react';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';

function Methodologie() {
  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-22'
          color1='blue-soft-125'
          color2='blue-soft-75'
        />
      </Col>
    </Row>
  );
  return (
    <div className='methodologie'>
      <Banner
        backgroundColor='blue-soft-50'
        textColor='blue-dark-150'
        supTitle='Baromètre français de la Science ouverte'
        title='Méthodologie'
        icons={renderIcons}
      />
    </div>
  );
}

export default Methodologie;
