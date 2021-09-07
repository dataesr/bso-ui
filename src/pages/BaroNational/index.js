import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Banner from '../../components/Banner';
import ChartTauxOuverture from '../../components/charts/publications/general/dynamique-ouverture/chart-taux-ouverture';
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

function BaroNational() {
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
          url: <FormattedMessage id='url.about.flash' />,
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
                  href: '/publications/general#dynamique',
                  label: (
                    <FormattedMessage id='app.baro-national.detail-publi' />
                  ),
                }}
                title={
                  <FormattedMessage id='app.header.nav.baro-national-publications' />
                }
                introText={(
                  <GlossaryFormattedMessage
                    glossaryKey='acces-ouvert'
                    intlKey='app.baro-national.intro'
                  />
                )}
              >
                <Container fluid>
                  <Row gutters alignItems='top'>
                    <Col n='12 md-8'>
                      <ChartTauxOuverture
                        id='publi.general.dynamique-ouverture.chart-taux-ouverture'
                        graphComments={false}
                        graphFooter={false}
                      />
                    </Col>
                    <Col n='12 md-4'>
                      <ProgressionCard />
                    </Col>
                  </Row>
                </Container>
              </HomeSection>
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
