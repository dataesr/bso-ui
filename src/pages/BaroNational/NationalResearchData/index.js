import { Col, Container, Row } from '@dataesr/react-dsfr';
import { FormattedMessage } from 'react-intl';

import BannerNational from '../../../components/BannerNational';
import GlossaryFormattedMessage from '../../../components/Glossary/GlossaryFormattedMessage';
import ScrollTop from '../../../components/ScrollTop';

export default function NationalResearchData() {
  return (
    <Container fluid className='page'>
      <BannerNational
        selected='url.national.research-data'
        title='app.publi.researchdata'
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
