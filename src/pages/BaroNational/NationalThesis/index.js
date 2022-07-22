import { Col, Container, Row } from '@dataesr/react-dsfr';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

import Banner from '../../../components/Banner';
import BSOChart from '../../../components/Charts';
import Chip from '../../../components/Chip';
import GlossaryFormattedMessage from '../../../components/Glossary/GlossaryFormattedMessage';
import GraphNavigation from '../../../components/GraphNavigation';
import GraphContent from '../../../components/GraphNavigation/GraphContent';
import Icon from '../../../components/Icon';
import QuestionSection from '../../../components/question-section';
import ScrollTop from '../../../components/ScrollTop';
import { mobileButtonLabel } from '../../../utils/constants';
import { getCSSValue, isInProduction } from '../../../utils/helpers';
import useLang from '../../../utils/Hooks/useLang';

export default function NationalThesis() {
  const { lang, urls } = useLang();
  const { pathname, search } = useLocation();
  const blueSoft50 = getCSSValue('--blue-soft-50');

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
        title={<FormattedMessage id='app.publi.thesis' />}
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
                  <FormattedMessage id='app.publi.thesis' />
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
                intlKey='app.national-these.general.dynamique-ouverture'
                glossaryKeys={['embargo', 'barriere-mobile']}
                backgroundColor={blueSoft50}
                anchorId='general.dynamique-ouverture'
              >
                <BSOChart
                  id='thesis.general.voies-ouverture.chart-repartition-taux'
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
