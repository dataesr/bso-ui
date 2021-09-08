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
import { Link } from 'react-router-dom';

import Banner from '../../components/Banner';
import BSOChart from '../../components/Charts';
import Chip from '../../components/Chip';
import Glossary from '../../components/Glossary';
import GlossaryFormattedMessage from '../../components/Glossary/GlossaryFormattedMessage';
import HomeSection from '../../components/HomeSection';
import Icon from '../../components/Icon';
import ProgressionCard from '../../components/ProgressionCard';
import ScrollTop from '../../components/ScrollTop';
import TodayNumbersSection from '../../components/TodayNumbersSection';
import TodayNumbersItem from '../../components/TodayNumbersSection/TodayNumbersItem';
import ToolCardsSection from '../../components/ToolCardsSection';
import UpdateDate from '../../components/UpdateDate';
import urls from '../../config/urls';
import logoBso from '../../images/logo-bso.png';
import GlossaryEntries from '../../translations/glossary.json';
import useLang from '../../utils/Hooks/useLang';

function BaroSante() {
  const { lang } = useLang();
  const renderIcons = (
    <Row alignItems='middle' gutters>
      <Col n='4 md-2'>
        <Icon
          name='icon-bsso-28'
          color1='blue-soft-125'
          color2='publication-25'
        />
      </Col>
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
        supTitle={<FormattedMessage id='app.header.title' />}
        title={<FormattedMessage id='app.commons.health' />}
        subTitle={<FormattedMessage id='app.baro-sante.intro-banner' />}
        chip={<Chip backgroundColor='blue-soft-125' />}
        icons={renderIcons}
        homeLink={urls.national[lang]}
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
                    glossaryKey='acces-ouvert'
                    intlKey='app.baro-sante.intro'
                  />
                )}
              >
                <Container fluid>
                  <Row gutters alignItems='top'>
                    <Col n='12 md-8'>
                      <BSOChart
                        id='publi.general.dynamique-ouverture.chart-taux-ouverture'
                        domain='health'
                        graphComments={false}
                        graphFooter={false}
                      />
                    </Col>
                    <Col n='12 md-4'>
                      <ProgressionCard domain='health' />
                    </Col>
                    <Col n='12'>
                      <BSOChart
                        domain='health'
                        id='publi.general.dynamique-ouverture.chart-evolution-proportion'
                        graphComments={false}
                      />
                    </Col>
                  </Row>
                </Container>
              </HomeSection>
            </Col>
            <Col n='12 xl-10' offset='xl-2'>
              <HomeSection
                link={{
                  href: '/sante/essais-cliniques',
                  label: <FormattedMessage id='app.baro-sante.detail-essays' />,
                }}
                title={
                  <FormattedMessage id='app.header.nav.baro-sante-essais' />
                }
                introText={
                  <FormattedMessage id='app.baro-sante.essays-intro' />
                }
              >
                <p>essais-cliniques</p>
              </HomeSection>
            </Col>
            <Col n='12 xl-10' offset='xl-2'>
              <HomeSection
                link={{
                  href: '/sante/etudes-observationelles',
                  label: (
                    <FormattedMessage id='app.baro-sante.detail-studies' />
                  ),
                }}
                title={
                  <FormattedMessage id='app.header.nav.baro-sante-etudes' />
                }
                introText={
                  <FormattedMessage id='app.baro-sante.studies-intro' />
                }
              >
                <p>etudes-observationelles</p>
              </HomeSection>
            </Col>
            <Col n='12'>
              <Container fluid>
                <section className='px-20 py-48 px-l-64 px-xl-142 bg-medium-blue'>
                  <Row>
                    <Col n='12'>
                      <Card
                        bodyClassName='bg-white'
                        href='/'
                        isHorizontal
                        hasArrow={false}
                      >
                        <CardDescription as='div'>
                          <Container fluid>
                            <Row justifyContent='center' alignItems='middle'>
                              <Col n='12 md-4'>
                                <p className='text-card-logo pb-16 blue-dark text-center text-left-l marianne-bold fs-24-32'>
                                  <FormattedMessage id='app.commons.explore-national' />
                                </p>
                              </Col>
                              <Col n='12 md-7'>
                                <section className='wrap-logo text-center'>
                                  <img
                                    className='w-100'
                                    src={logoBso}
                                    alt='logo baromètre natonal'
                                  />
                                </section>
                              </Col>
                              <Col n='12'>
                                <DSIcon name='ri-link' size='2x' as='div'>
                                  <DSLink
                                    className='w-100 text-right'
                                    as={<Link to='/national' />}
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
                  backgroundColorClass='bg-soft-purple'
                  domain='health'
                />
                <TodayNumbersItem
                  itemKey='journal'
                  iconName='icon-bsso-2'
                  iconColor='purple-50'
                  intlSubTitle='app.journals'
                  backgroundColorClass='bg-soft-pink'
                  domain='health'
                />
                <TodayNumbersItem
                  itemKey='publisher'
                  iconName='icon-bsso-14'
                  iconColor='yellow-medium-75'
                  intlSubTitle='app.health-publi.publishers'
                  backgroundColorClass='bg-yellow'
                  domain='health'
                />
                <TodayNumbersItem
                  itemKey='repository'
                  iconName='icon-bsso-10'
                  iconColor='green-medium-75'
                  intlSubTitle='app.health-publi.repositories'
                  backgroundColorClass='bg-medium-green'
                  domain='health'
                />
                <TodayNumbersItem
                  itemKey='obsDates'
                  iconName='icon-bsso-10'
                  iconColor='green-light-75'
                  intlSubTitle='app.obs-dates'
                  backgroundColorClass='bg-light-green'
                  domain='health'
                />
                <TodayNumbersItem
                  itemKey='interventional'
                  iconName='icon-bsso-24'
                  iconColor='purple-medium-50'
                  intlSubTitle='app.interventionals'
                  backgroundColorClass='bg-medium-purple'
                />
                <TodayNumbersItem
                  itemKey='observational'
                  iconName='icon-bsso-6'
                  iconColor='yellow-medium-75'
                  intlSubTitle='app.observationals'
                  backgroundColorClass='bg-yellow'
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
