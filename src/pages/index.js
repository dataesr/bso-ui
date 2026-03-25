import { Col, Container, Row } from '@dataesr/react-dsfr';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import Banner from '../components/Banner';
import BSOChart from '../components/Charts';
import Chip from '../components/Chip';
import Glossary from '../components/Glossary';
import GlossaryFormattedMessage from '../components/Glossary/GlossaryFormattedMessage';
import HomeSection from '../components/HomeSection';
import Icon from '../components/Icon';
import ProgressionCard from '../components/ProgressionCard';
import ScrollTop from '../components/ScrollTop';
import TodayNumbersSection from '../components/TodayNumbersSection';
import TodayNumbersItem from '../components/TodayNumbersSection/TodayNumbersItem';
import ToolCardsSection from '../components/ToolCardsSection';
import UpdateDate from '../components/UpdateDate';
import GlossaryEntries from '../translations/glossary.json';
import useLang from '../utils/Hooks/useLang';

function HomePage() {
  const intl = useIntl();
  const { lang, urls } = useLang();
  const { search } = useLocation();

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='4 md-2'>
        <Icon
          name='icon-bsso-3'
          color1='blue-soft-125'
          color2='yellow-medium-50'
        />
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

  // TODO better way to render Icons
  return (
    <div className='baro-national page home'>
      <Banner
        backgroundColor='blue-soft-150'
        supTitle={<FormattedMessage id='app.header.welcome-on' />}
        title={<FormattedMessage id='app.header.title-bis' />}
        subTitle={<FormattedMessage id='app.header.subtitle' />}
        link={{
          label: <FormattedMessage id='app.communication.see' />,
          url: intl.formatMessage({ id: 'url.about.communication' }) + search,
        }}
        icons={renderIcons}
        chip={<Chip />}
      />
      <ScrollTop />
      <Container fluid>
        <section className='content'>
          <Row>
            <Col n='12 md-12 xl-10' className='px-20 px-md-64' offset='xl-2'>
              <section className='py-28'>
                <h2 className='marianne-light fs-28-32 fs-40-48-xl m-0'>
                  <FormattedMessage id='app.national-home.numbers' />
                </h2>
                <p className='fs-14-24 blue m-0'>
                  <UpdateDate />
                </p>
              </section>
            </Col>
            <Col n='12 xl-10' offset='xl-2'>
              <Glossary entries={GlossaryEntries} />
              <HomeSection
                link={{
                  href: urls.nationalPublications.tabs[0][lang] + search,
                  label: (
                    <FormattedMessage id='app.baro-national.detail-publi' />
                  ),
                }}
                title={
                  <FormattedMessage id='app.header.nav.baro-national-publications' />
                }
                introText={(
                  <GlossaryFormattedMessage
                    intlKey='app.baro-national.intro'
                    glossaryKeys={['acces-ouvert', 'publication-fr']}
                  />
                )}
              >
                <Container fluid>
                  <Row gutters alignItems='top'>
                    <Col n='12 md-8'>
                      <BSOChart
                        id='publi.general.dynamique-ouverture.chart-taux-ouverture'
                        hasFooter={false}
                      />
                    </Col>
                    <Col n='12 md-4'>
                      <ProgressionCard />
                    </Col>
                    <Col n='12'>
                      <BSOChart id='publi.general.dynamique-ouverture.chart-evolution-proportion' />
                    </Col>
                  </Row>
                </Container>
              </HomeSection>
              <HomeSection
                link={{
                  href: urls.nationalThesis.tabs[0][lang] + search,
                  label: (
                    <FormattedMessage id='app.baro-national.detail-theses' />
                  ),
                }}
                title={<FormattedMessage id='app.baro-national.thesis.title' />}
                introText={(
                  <GlossaryFormattedMessage
                    intlKey='app.thesis.intro'
                    glossaryKeys={['acces-ouvert', 'publication-fr']}
                  />
                )}
              >
                <Container fluid>
                  <Row gutters alignItems='top'>
                    <Col n='12'>
                      <BSOChart id='thesis.general.voies-ouverture.chart-repartition-taux' />
                    </Col>
                  </Row>
                </Container>
              </HomeSection>
            </Col>
            <Col n='12 xl-10' offset='xl-2'>
              <Glossary entries={GlossaryEntries} />
              <HomeSection
                hasBeta
                introText={(
                  <GlossaryFormattedMessage
                    glossaryKeys={['grobid', 'datastet']}
                    intlKey='app.baro-national.data.intro'
                  />
                )}
                link={{
                  href: urls.nationalResearchData.tabs[0][lang] + search,
                  label: (
                    <FormattedMessage id='app.baro-national.detail-data' />
                  ),
                }}
                title={<FormattedMessage id='app.baro-national.data.title' />}
              >
                <Container fluid>
                  <Row gutters alignItems='top'>
                    <Col n='12'>
                      <BSOChart id='data.general.voies-ouverture.chart-data-shared' />
                    </Col>
                  </Row>
                </Container>
              </HomeSection>
              <HomeSection
                hasBeta
                introText={(
                  <GlossaryFormattedMessage
                    glossaryKeys={['grobid', 'softcite']}
                    intlKey='app.baro-national.software.intro'
                    ctas={[
                      'https://cloud.science-miner.com/software_kb_bso/frontend/index.html',
                    ]}
                  />
                )}
                link={{
                  href: urls.nationalSoftwareCode.tabs[0][lang] + search,
                  label: (
                    <FormattedMessage id='app.baro-national.detail-software' />
                  ),
                }}
                title={
                  <FormattedMessage id='app.baro-national.software.title' />
                }
              >
                <Container fluid>
                  <Row gutters alignItems='top'>
                    <Col n='12'>
                      <BSOChart id='software.general.voies-ouverture.chart-software-shared' />
                    </Col>
                  </Row>
                </Container>
              </HomeSection>
            </Col>
            <Col n='12 xl-10' offset='xl-2'>
              <HomeSection
                link={{
                  href: '/sante/essais-cliniques/general',
                  label: <FormattedMessage id='app.baro-sante.detail-trials' />,
                }}
                title={
                  <FormattedMessage id='app.header.nav.baro-sante-essais' />
                }
                introText={(
                  <GlossaryFormattedMessage
                    intlKey='app.baro-sante.trials-intro'
                    glossaryKeys={['essai-clinique', 'promoteur']}
                  />
                )}
              >
                <Container fluid>
                  <Row gutters alignItems='top'>
                    <Col n='12'>
                      <BSOChart
                        id='general.dynamique.chart-evolution-within-3-years'
                        domain='health'
                        studyType='Interventional'
                      />
                    </Col>
                  </Row>
                </Container>
              </HomeSection>
            </Col>
            <Col n='12'>
              <ToolCardsSection />
            </Col>
            <Col n='12'>
              <TodayNumbersSection
                title={<FormattedMessage id='app.baro-national.today-title' />}
                updateDate={<UpdateDate />}
              >
                <TodayNumbersItem
                  itemKey='publication'
                  iconName='icon-bsso-28'
                  iconColor='purple-50'
                  intlSubTitle='app.publications'
                  backgroundColorClass='bg-purple-25'
                />
                <TodayNumbersItem
                  itemKey='journal'
                  iconName='icon-bsso-2'
                  iconColor='purple-50'
                  intlSubTitle='app.journals'
                  backgroundColorClass='bg-publication-25'
                />
                <TodayNumbersItem
                  itemKey='publisher'
                  iconName='icon-bsso-14'
                  iconColor='yellow-medium-75'
                  intlSubTitle='app.health-publi.publishers'
                  backgroundColorClass='bg-yellow-medium-50'
                />
                <TodayNumbersItem
                  itemKey='repository'
                  iconName='icon-bsso-10'
                  iconColor='green-medium-75'
                  intlSubTitle='app.health-publi.repositories'
                  backgroundColorClass='bg-green-medium-25'
                />
                <TodayNumbersItem
                  itemKey='these'
                  iconName='icon-these'
                  iconColor='green-medium-75'
                  intlSubTitle='app.thesis'
                  backgroundColorClass='bg-purple-medium-50'
                />
                <TodayNumbersItem
                  itemKey='obsDates'
                  iconName='icon-bsso-10'
                  iconColor='green-light-75'
                  intlSubTitle='app.obs-dates'
                  backgroundColorClass='bg-green-light-50'
                />
              </TodayNumbersSection>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default HomePage;
