import { Col, Container, Row } from '@dataesr/react-dsfr';
import { FormattedMessage } from 'react-intl';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';
import Citations from './citations';

function Citation() {
  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-23'
          color1='blue-soft-125'
          color2='blue-soft-75'
        />
      </Col>
    </Row>
  );

  return (
    <div className='opendata'>
      <Banner
        backgroundColor='blue-soft-50'
        icons={renderIcons}
        supTitle={<FormattedMessage id='app.header.title' />}
        textColor='blue-dark-150'
        title={<FormattedMessage id='app.header.nav.about.citation' />}
      />
      <Container>
        <section className='color-blue-dark-125 content py-48'>
          <Row gutters>
            <Citations />
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default Citation;
