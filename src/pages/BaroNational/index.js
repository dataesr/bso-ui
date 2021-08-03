import { Col, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

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
        supTitle={<FormattedMessage id='app.header.welcome-on' />}
        title={<FormattedMessage id='app.header.title-bis' />}
        subTitle={<FormattedMessage id='app.header.subtitle' />}
        link={{
          label: <FormattedMessage id='app.notes.flash.see' />,
          url: <FormattedMessage id='url.about.flash' />,
        }}
        icons={renderIcons}
        chip={<Chip />}
      />
    </div>
  );
}

export default BaroNational;
