import { Col, Row } from '@dataesr/react-dsfr';
import React from 'react';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';

function NotesFlash() {
  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-21'
          color1='blue-dark-125'
          color2='yellow-medium-100'
        />
      </Col>
    </Row>
  );

  return (
    <div className='notes-flash'>
      <Banner
        backgroundColor='yellow-medium-50'
        textColor='blue-dark-125'
        supTitle='Baromètre français de la Science ouverte'
        title='Notes flash'
        icons={renderIcons}
      />
    </div>
  );
}

export default NotesFlash;
