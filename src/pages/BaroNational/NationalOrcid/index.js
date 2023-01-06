import {
  Breadcrumb,
  BreadcrumbItem,
  Col,
  Container,
  Row,
} from '@dataesr/react-dsfr';
import { FormattedMessage, useIntl } from 'react-intl';
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

export default function NationalOrcid() {
  const { lang } = useLang();
  const { pathname } = useLocation();
  const blueSoft50 = getCSSValue('--blue-soft-50');
  const intl = useIntl();

  return (
    <Container fluid className='page'>
      <BannerNational
        selected='url.thesis'
        title='app.baro-national.orcid.title'
        iconId='icon-these'
      />
      <ScrollTop />
      <section className='content'>
        <Row>
          <Container>
            <Row>
              <Col n='12'>
                <Breadcrumb>
                  <BreadcrumbItem href='/' className='underline'>
                    {intl.formatMessage({
                      id: 'app.header.nav.baro-national-accueil',
                    })}
                  </BreadcrumbItem>
                  <BreadcrumbItem href='#'>></BreadcrumbItem>
                  <BreadcrumbItem href='#' className='bold'>
                    {intl.formatMessage({
                      id: 'app.baro-national.orcid.title',
                    })}
                  </BreadcrumbItem>
                </Breadcrumb>
                <h1 className='contentTitle marianne-bold mb-32'>
                  <FormattedMessage id='app.baro-national.orcid.title' />
                </h1>
                <p>
                  <GlossaryFormattedMessage
                    intlKey='app.orcid.intro'
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
                intlKey='app.national-orcid.general.dynamique-ouverture'
                glossaryKeys={['embargo', 'barriere-mobile']}
                backgroundColor={blueSoft50}
                anchorId='general.dynamique-ouverture'
              >
                <BSOChart
                  id='orcid.general.present.chart-evolution'
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
