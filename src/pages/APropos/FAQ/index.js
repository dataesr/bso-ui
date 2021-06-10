import { Col, Row } from '@dataesr/react-dsfr';
import React from 'react';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';

function FAQ() {
  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-31'
          color1='blue-dark-125'
          color2='pink-light-100'
        />
      </Col>
    </Row>
  );
  return (
    <div className='faq'>
      <Banner
        backgroundColor='pink-light-50'
        textColor='blue-dark-125'
        supTitle='Baromètre français de la Science ouverte'
        title='Foire aux questions'
        icons={renderIcons}
      />
    </div>
  );
}

export default FAQ;
