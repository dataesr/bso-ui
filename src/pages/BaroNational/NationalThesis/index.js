import { Col, Container, Row } from '@dataesr/react-dsfr';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

import BannerNational from '../../../components/BannerNational';
import BSOChart from '../../../components/Charts';
import GlossaryFormattedMessage from '../../../components/Glossary/GlossaryFormattedMessage';
import GraphNavigation from '../../../components/GraphNavigation';
import GraphContent from '../../../components/GraphNavigation/GraphContent';
import QuestionSection from '../../../components/question-section';
import ScrollTop from '../../../components/ScrollTop';
import { mobileButtonLabel } from '../../../utils/constants';
import { getCSSValue, isInProduction } from '../../../utils/helpers';
import useLang from '../../../utils/Hooks/useLang';

export default function NationalThesis() {
  const { lang } = useLang();
  const { pathname } = useLocation();
  const blueSoft50 = getCSSValue('--blue-soft-50');

  return (
    <Container fluid className='page'>
      <BannerNational
        selected='url.thesis'
        title='app.baro-national.thesis.title'
      />
      <ScrollTop />
      <section className='content'>
        <Row>
          <Container>
            <Row>
              <Col n='12'>
                <h1 className='contentTitle marianne-bold mb-32'>
                  <FormattedMessage id='app.baro-national.thesis.title' />
                </h1>
                <p>
                  <GlossaryFormattedMessage
                    intlKey='app.thesis.intro'
                    glossaryKeys={[]}
                  />
                </p>
              </Col>
            </Row>
          </Container>
        </Row>
        <Row>
          <GraphNavigation mobileTitleIntl={mobileButtonLabel[lang][pathname]}>
            <GraphContent>
              <QuestionSection
                intlKey='app.national-thesis.general.dynamique-ouverture'
                glossaryKeys={['embargo', 'barriere-mobile']}
                backgroundColor={blueSoft50}
                anchorId='general.dynamique-ouverture'
              >
                <BSOChart
                  id='thesis.general.voies-ouverture.chart-repartition-taux'
                  isDisplayed={!isInProduction()}
                />
                <BSOChart
                  id='thesis.disciplines.voies-ouverture.chart-repartition-thesis'
                  isDisplayed={!isInProduction()}
                />
              </QuestionSection>
            </GraphContent>
          </GraphNavigation>
        </Row>
      </section>
    </Container>
  );
}
