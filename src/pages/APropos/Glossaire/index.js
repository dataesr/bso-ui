import { Col, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Banner from '../../../components/Banner';
import Glossary from '../../../components/Glossary';
import GlossaryFormattedMessage from '../../../components/Glossary/GlossaryFormattedMessage';
import Icon from '../../../components/Icon';
import GlossaryEntries from '../../../translations/glossary.json';

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
        supTitle={<FormattedMessage id='app.baro.science-ouverte' />}
        title={<FormattedMessage id='app.glossary' />}
        icons={renderIcons}
      />
      <Glossary entries={GlossaryEntries} />
      <GlossaryFormattedMessage
        intlKey='app.text.test'
        glossaryKey='essai_clinique'
      />
    </div>
  );
}

export default Glossaire;
