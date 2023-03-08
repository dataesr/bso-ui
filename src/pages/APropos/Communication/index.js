import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Banner from '../../../components/Banner';
import FlashCard from '../../../components/FlashCard';
import Icon from '../../../components/Icon';

const Communication = () => {
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
    <div className='page communication'>
      <Banner
        backgroundColor='yellow-medium-50'
        textColor='blue-dark-125'
        supTitle={<FormattedMessage id='app.header.title' />}
        title={<FormattedMessage id='app.header.nav.a-propos.communication' />}
        icons={renderIcons}
      />
      <Container>
        <section className='content py-48'>
          <Row gutters>
            <Col n='12 md-6 lg-4'>
              <FlashCard
                intlTitle='app.note.flash.jan-2020'
                url='https://www.enseignementsup-recherche.gouv.fr/cid148931/barometre-francais-de-la-science-ouverte.html'
                urlData='https://www.enseignementsup-recherche.gouv.fr/sites/default/files/imported_files/documents/NF_Bso_2019_1236202.xlsx'
                urlPdf='https://www.enseignementsup-recherche.gouv.fr/sites/default/files/imported_files/documents/NF_BarometreSO_1236191.pdf'
              />
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default Communication;
