import { Col, Container, Row } from '@dataesr/react-dsfr';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

import Banner from '../../../components/Banner';
import Chip from '../../../components/Chip';
import GlossaryFormattedMessage from '../../../components/Glossary/GlossaryFormattedMessage';
import Icon from '../../../components/Icon';
import ScrollTop from '../../../components/ScrollTop';
import useLang from '../../../utils/Hooks/useLang';

export default function NationalResearchData() {
  const { lang, urls } = useLang();
  const { search } = useLocation();

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-12'
          color1='blue-soft-125'
          color2='publication-25'
        />
      </Col>
    </Row>
  );

  return (
    <Container fluid className='page'>
      <Banner
        backgroundColor='blue-soft-150'
        homeLink={urls.national[lang] + search}
        supTitle={<FormattedMessage id='app.header.title-national' />}
        title={<FormattedMessage id='app.publi.researchdata' />}
        chip={<Chip />}
        icons={renderIcons}
      />
      <ScrollTop />
      <section className='content'>
        <Row>
          <Container>
            <Row>
              <Col n='12'>
                <h1 className='contentTitle marianne-bold mb-32'>
                  <FormattedMessage id='app.publi.researchdata' />
                </h1>
                <p>
                  <GlossaryFormattedMessage
                    intlKey='app.researchdata.intro'
                    glossaryKeys={[]}
                  />
                </p>
              </Col>
            </Row>
          </Container>
        </Row>
      </section>
    </Container>
  );
}
