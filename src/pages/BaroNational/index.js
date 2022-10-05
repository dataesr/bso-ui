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
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';

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
import GlossaryEntries from '../../translations/glossary.json';
import { isInProduction } from '../../utils/helpers';
import useLang from '../../utils/Hooks/useLang';

function BaroNational() {
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
          label: <FormattedMessage id='app.notes.flash.see' />,
          url: intl.formatMessage({ id: 'url.about.flash' }) + search,
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
                        hasComments={false}
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
              <HomeSection // thèses
                isDisplayed={!isInProduction()}
                link={{
                  href: urls.nationalThesis[lang] + search,
                  label: (
                    <FormattedMessage id='app.baro-national.detail-theses' />
                  ),
                }}
                title={
                  <FormattedMessage id='app.header.nav.baro-national-theses' />
                }
                introText={(
                  <GlossaryFormattedMessage
                    intlKey='app.baro-national-theses.intro'
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
              <HomeSection // données
                isDisplayed={!isInProduction()}
                link={{
                  href: urls.nationalResearchData.tabs[0][lang] + search,
                  label: (
                    <FormattedMessage id='app.baro-national.detail-data' />
                  ),
                }}
                title={
                  <FormattedMessage id='app.header.nav.baro-national-data' />
                }
                introText={(
                  <GlossaryFormattedMessage
                    intlKey='app.baro-national-data.intro'
                    glossaryKeys={['acces-ouvert', 'publication-fr']}
                  />
                )}
              >
                <Container fluid>
                  <Row gutters alignItems='top'>
                    <Col n='12'>
                      <BSOChart id='software.general.voies-ouverture.chart-data-shared' />
                    </Col>
                  </Row>
                </Container>
              </HomeSection>
              <HomeSection // logiciels
                isDisplayed={!isInProduction()}
                link={{
                  href: urls.nationalSoftwareCodes.tabs[0][lang] + search,
                  label: (
                    <FormattedMessage id='app.baro-national.detail-software' />
                  ),
                }}
                title={
                  <FormattedMessage id='app.header.nav.baro-national-software' />
                }
                introText={(
                  <GlossaryFormattedMessage
                    intlKey='app.baro-national-software.intro'
                    glossaryKeys={['acces-ouvert', 'publication-fr']}
                  />
                )}
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
            <Col n='12'>
              <Container fluid>
                <section className='px-20 py-48 px-l-64 px-xl-142 bg-medium-blue'>
                  <Row justifyContent='center'>
                    <Col n='12 lg-12 xl-9'>
                      <Card
                        bodyClassName='bg-white'
                        hasArrow={false}
                        hasBorder={false}
                        href={urls.sante[lang] + search}
                        isHorizontal
                      >
                        <CardDescription as='div'>
                          <Container fluid>
                            <Row justifyContent='center' alignItems='middle'>
                              <Col n='12 md-5'>
                                <p className='text-card-logo pb-16 blue-dark text-center text-left-l marianne-bold fs-24-32'>
                                  <FormattedMessage id='app.commons.explore-sante' />
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
                                  name='icon-bsso-28'
                                  color1='blue-soft-150'
                                  color2='green-soft-50'
                                />
                              </Col>
                              <Col n='4 md-1'>
                                <Icon
                                  name='icon-bsso-15'
                                  color1='blue-soft-150'
                                  color2='blue-soft-50'
                                />
                              </Col>
                              <Col n='4 md-1'>
                                <Icon
                                  name='icon-bsso-17'
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
                                    as={<Link to={urls.sante[lang] + search} />}
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
                  backgroundColorClass='bg-soft-purple'
                />
                <TodayNumbersItem
                  itemKey='journal'
                  iconName='icon-bsso-2'
                  iconColor='purple-50'
                  intlSubTitle='app.journals'
                  backgroundColorClass='bg-soft-pink'
                />
                <TodayNumbersItem
                  itemKey='publisher'
                  iconName='icon-bsso-14'
                  iconColor='yellow-medium-75'
                  intlSubTitle='app.health-publi.publishers'
                  backgroundColorClass='bg-yellow'
                />
                <TodayNumbersItem
                  itemKey='repository'
                  iconName='icon-bsso-10'
                  iconColor='green-medium-75'
                  intlSubTitle='app.health-publi.repositories'
                  backgroundColorClass='bg-medium-green'
                />
                <TodayNumbersItem
                  itemKey='obsDates'
                  iconName='icon-bsso-10'
                  iconColor='green-light-75'
                  intlSubTitle='app.obs-dates'
                  backgroundColorClass='bg-light-green'
                />
              </TodayNumbersSection>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default BaroNational;
