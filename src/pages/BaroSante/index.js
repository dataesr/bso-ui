import {
  Card,
  CardDescription,
  Col,
  Container,
  Icon as DSIcon,
  Link as DSLink,
  Row,
} from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';

import Banner from '../../components/Banner';
import BSOChart from '../../components/Charts';
import Chip from '../../components/Chip';
import GlossaryFormattedMessage from '../../components/Glossary/GlossaryFormattedMessage';
import HomeSection from '../../components/HomeSection';
import Icon from '../../components/Icon';
import ScrollTop from '../../components/ScrollTop';
import TodayNumbersSection from '../../components/TodayNumbersSection';
import TodayNumbersItem from '../../components/TodayNumbersSection/TodayNumbersItem';
import ToolCardsSection from '../../components/ToolCardsSection';
import UpdateDate from '../../components/UpdateDate';
import useLang from '../../utils/Hooks/useLang';

function BaroSante() {
  const { lang, urls } = useLang();
  const { search } = useLocation();

  const renderIcons = (
    <Row alignItems='middle' gutters>
      <Col n='4 md-2'>
        <Icon
          name='icon-bsso-15'
          color1='blue-soft-125'
          color2='green-soft-50'
        />
      </Col>
      <Col n='4 md-2'>
        <Icon
          name='icon-bsso-17'
          color1='blue-soft-125'
          color2='orange-medium-50'
        />
      </Col>
    </Row>
  );

  return (
    <div className='baro-sante page home'>
      <Banner
        backgroundColor='blue-soft-100'
        supTitle={<FormattedMessage id='app.header.welcome-on' />}
        title={<FormattedMessage id='app.header.title-health-bis' />}
        subTitle={<FormattedMessage id='app.header.subtitle-health' />}
        chip={<Chip backgroundColor='blue-soft-125' />}
        icons={renderIcons}
        homeLink={urls.national[lang] + search}
      />
      <ScrollTop />
      <Container fluid>
        <section className='content'>
          <Row>
            <Col n='12 md-12 xl-10' className='px-20 px-md-64' offset='xl-2'>
              <section className='py-28'>
                <h2 className='marianne-light fs-28-32 fs-40-48-xl m-0'>
                  <FormattedMessage id='app.health-home.numbers' />
                </h2>
                <p className='fs-14-24 blue m-0'>
                  <UpdateDate />
                </p>
              </section>
            </Col>
            {/*
            <Col n='12 xl-10' offset='xl-2'>
              <Glossary entries={GlossaryEntries} />
              <HomeSection
                link={{
                  href: '/sante/publications/general',
                  label: <FormattedMessage id='app.baro-sante.detail-publi' />,
                }}
                title={
                  <FormattedMessage id='app.header.nav.baro-national-publications' />
                }
                introText={(
                  <GlossaryFormattedMessage
                    intlKey='app.baro-sante.intro'
                    glossaryKeys={['acces-ouvert', 'publication-fr', 'pubmed']}
                  />
                )}
              >
                <Container fluid>
                  <Row gutters alignItems='top'>
                    <Col n='12 md-8'>
                      <BSOChart
                        id='publi.general.dynamique-ouverture.chart-taux-ouverture'
                        domain='health'
                        hasComments={false}
                        hasFooter={false}
                      />
                    </Col>
                    <Col n='12 md-4'>
                      <ProgressionCard domain='health' />
                    </Col>
                    <Col n='12'>
                      <BSOChart
                        domain='health'
                        id='publi.general.dynamique-ouverture.chart-evolution-proportion'
                        hasComments={false}
                      />
                    </Col>
                  </Row>
                </Container>
              </HomeSection>
            </Col>
            */}
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
            <Col n='12 xl-10' offset='xl-2'>
              <HomeSection
                link={{
                  href: '/sante/etudes-observationnelles/general',
                  label: (
                    <FormattedMessage id='app.baro-sante.detail-studies' />
                  ),
                }}
                title={
                  <FormattedMessage id='app.header.nav.baro-sante-etudes' />
                }
                introText={(
                  <GlossaryFormattedMessage
                    intlKey='app.baro-sante.studies-intro'
                    glossaryKeys={[]}
                    ctas={[
                      'https://clinicaltrials.gov/',
                      'https://www.clinicaltrialsregister.eu/',
                    ]}
                  />
                )}
              >
                <Container fluid>
                  <Row gutters alignItems='top'>
                    <Col n='12'>
                      <BSOChart
                        id='general.dynamique.chart-evolution-within-3-years'
                        domain='health'
                        studyType='Observational'
                      />
                    </Col>
                  </Row>
                </Container>
              </HomeSection>
            </Col>
            <Col n='12'>
              <Container fluid>
                <section className='px-20 py-48 px-l-64 px-xl-142 bg-blue-soft-100'>
                  <Row justifyContent='center'>
                    <Col n='12 lg-12 xl-9'>
                      <Card
                        bodyClassName='bg-white'
                        hasArrow={false}
                        hasBorder={false}
                        href='/'
                        isHorizontal
                      >
                        <CardDescription as='div'>
                          <Container fluid>
                            <Row justifyContent='center' alignItems='middle'>
                              <Col n='12 md-5'>
                                <p className='text-card-logo pb-16 blue-dark text-center text-left-l marianne-bold fs-24-32'>
                                  <FormattedMessage id='app.commons.explore-national' />
                                </p>
                              </Col>
                              <Col n='4 md-1'>
                                <Icon
                                  name='icon-bsso-3'
                                  color1='blue-soft-150'
                                  color2='yellow-medium-50'
                                />
                              </Col>
                              <Col n='4 md-1'>
                                <Icon
                                  name='icon-bsso-4'
                                  color1='blue-soft-150'
                                  color2='orange-medium-75'
                                />
                              </Col>
                              <Col n='4 md-1'>
                                <Icon
                                  name='icon-bsso-1'
                                  color1='blue-soft-150'
                                  color2='green-soft-50'
                                />
                              </Col>
                              <Col n='4 md-1'>
                                <Icon
                                  name='icon-bsso-5'
                                  color1='blue-soft-150'
                                  color2='blue-soft-50'
                                />
                              </Col>
                              <Col n='4 md-1'>
                                <Icon
                                  name='icon-bsso-2'
                                  color1='blue-soft-150'
                                  color2='pink-light-75'
                                />
                              </Col>
                              <Col n='4 md-1'>
                                <Icon
                                  name='icon-bsso-6'
                                  color1='blue-soft-150'
                                  color2='green-medium-50'
                                />
                              </Col>
                              <Col n='12'>
                                <DSIcon name='ri-link' size='2x' as='div'>
                                  <DSLink
                                    className='w-100 text-right'
                                    as={<Link to='/' />}
                                  />
                                </DSIcon>
                              </Col>
                            </Row>
                          </Container>
                        </CardDescription>
                      </Card>
                    </Col>
                  </Row>
                </section>
              </Container>
            </Col>
            <Col>
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
                  domain='health'
                />
                <TodayNumbersItem
                  itemKey='journal'
                  iconName='icon-bsso-2'
                  iconColor='purple-50'
                  intlSubTitle='app.journals'
                  backgroundColorClass='bg-publication-25'
                  domain='health'
                />
                <TodayNumbersItem
                  itemKey='publisher'
                  iconName='icon-bsso-14'
                  iconColor='yellow-medium-75'
                  intlSubTitle='app.health-publi.publishers'
                  backgroundColorClass='bg-yellow-medium-50'
                  domain='health'
                />
                <TodayNumbersItem
                  itemKey='repository'
                  iconName='icon-bsso-10'
                  iconColor='green-medium-75'
                  intlSubTitle='app.health-publi.repositories'
                  backgroundColorClass='bg-green-medium-25'
                  domain='health'
                />
                <TodayNumbersItem
                  itemKey='obsDates'
                  iconName='icon-bsso-10'
                  iconColor='green-light-75'
                  intlSubTitle='app.obs-dates'
                  backgroundColorClass='bg-green-light-50'
                  domain='health'
                />
                <TodayNumbersItem
                  itemKey='interventional'
                  iconName='icon-bsso-24'
                  iconColor='purple-medium-50'
                  intlSubTitle='app.interventionals'
                  backgroundColorClass='bg-purple-medium-25'
                />
                <TodayNumbersItem
                  itemKey='observational'
                  iconName='icon-bsso-6'
                  iconColor='yellow-medium-75'
                  intlSubTitle='app.observationals'
                  backgroundColorClass='bg-yellow-medium-50'
                />
              </TodayNumbersSection>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default BaroSante;
