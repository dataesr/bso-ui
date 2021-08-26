import {
  Card,
  CardDescription,
  CardTitle,
  Col,
  Container,
  Icon as DSIcon,
  Link as DSLink,
  Row,
} from '@dataesr/react-dsfr';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import Banner from '../../components/Banner';
import ChartEvolutionProportion from '../../components/charts/publications/general/dynamique-ouverture/chart-evolution-proportion';
import ChartTauxOuverture from '../../components/charts/publications/general/dynamique-ouverture/chart-taux-ouverture';
import Chip from '../../components/Chip';
import Glossary from '../../components/Glossary';
import GlossaryFormattedMessage from '../../components/Glossary/GlossaryFormattedMessage';
import HomeSection from '../../components/HomeSection';
import Icon from '../../components/Icon';
import InfoCard from '../../components/InfoCard';
import LinkCard from '../../components/LinkCard';
import ScrollTop from '../../components/ScrollTop';
import TodaySection from '../../components/TodaySection';
import TodaySectionItem from '../../components/TodaySection/TodaySectionItem';
import logoBso from '../../images/logo-bso.png';
import GlossaryEntries from '../../translations/glossary.json';
import { getFormattedDate } from '../../utils/helpers';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import useGetPublicationRateFrom from '../../utils/Hooks/useGetPublicationRateFrom';
import useLang from '../../utils/Hooks/useLang';

const lastObservationSnapIndex = 0;
const previousObservationSnapIndex = 1;

function BaroSante() {
  const { updateDate } = useGlobals();
  const [progression, setProgression] = useState({});
  const { observationSnaps } = useGlobals();
  const { lang } = useLang();
  const [previousObservationSnap, setPreviousObservationSnap] = useState(
    observationSnaps ? observationSnaps[previousObservationSnapIndex] : '',
  );
  const [lastObservationSnap, setLastObservationSnap] = useState(
    observationSnaps ? observationSnaps[lastObservationSnapIndex] : '',
  );

  const renderUpdateDate = () => (
    <FormattedMessage
      values={{
        date: getFormattedDate(updateDate, lang),
        endDate: lastObservationSnap,
        startDate: '2013',
      }}
      id='app.sante.update.date'
      defaultMessage=''
    />
  );
  const updateProgression = (res, year) => {
    const { rate } = res;
    if (
      (Object.keys(progression).indexOf(year) < 0 && rate)
      || (progression[year] !== rate && rate)
    ) {
      setProgression((prev) => ({ ...prev, [year]: rate }));
    }
  };

  useGetPublicationRateFrom('health', previousObservationSnap).then((res) => {
    if (previousObservationSnap) {
      updateProgression(res, previousObservationSnap);
    }
  });

  useGetPublicationRateFrom('health', lastObservationSnap).then((res) => {
    if (lastObservationSnap) {
      updateProgression(res, lastObservationSnap);
    }
  });

  useEffect(() => {
    if (observationSnaps && !previousObservationSnap && !lastObservationSnap) {
      setPreviousObservationSnap(observationSnaps[lastObservationSnapIndex]);
      setLastObservationSnap(observationSnaps[previousObservationSnapIndex]);
    }
  }, [lastObservationSnap, observationSnaps, previousObservationSnap]);

  const progressionPoints = () => {
    let progPoints = '';
    if (lastObservationSnap && previousObservationSnap) {
      const rhesus = progression[lastObservationSnap] >= progression[previousObservationSnap]
        ? '+'
        : '';
      const lastOaRate = progression[lastObservationSnap]
        ? progression[lastObservationSnap]
        : null;
      const previousOaRate = progression[previousObservationSnap]
        ? progression[previousObservationSnap]
        : null;
      if (previousOaRate && lastOaRate) {
        const evolution = Math.round(lastOaRate - previousOaRate);
        progPoints = `${rhesus}${evolution}`;
      }
    }
    return progPoints;
  };

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
      />
      <ScrollTop />
      <Container fluid>
        <section className='content'>
          <Row>
            <Col n='12 md-12 xl-10' className='px-20 px-md-64' offset='xl-2'>
              <section className='py-28'>
                <h2 className='marianne-light fs-28-32 fs-40-48-xl m-0'>
                  <FormattedMessage id='app.sante-home.numbers' />
                </h2>
                <p className='fs-14-24 blue m-0'>{renderUpdateDate()}</p>
              </section>
            </Col>
            <Col n='12 xl-10' offset='xl-2'>
              <Glossary entries={GlossaryEntries} />
              <HomeSection
                link={{
                  href: '/sante/publications/general#dynamique',
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
                      <ChartTauxOuverture
                        graphComments={false}
                        graphFooter={false}
                      />
                    </Col>
                    <Col n='12 md-4'>
                      <InfoCard
                        icon={(
                          <Icon
                            name='icon-bsso-33'
                            color1='blue-dark-125'
                            color2='orange-soft-50'
                          />
                        )}
                        data1={progressionPoints()}
                        data2={progressionPoints() > 1 ? ' pts' : ' pt'}
                        title={(
                          <FormattedMessage
                            values={{
                              startYear: previousObservationSnap,
                              endYear: lastObservationSnap,
                              div: (chunks) => <div>{chunks}</div>,
                            }}
                            id='app.sante-publi.progression'
                            defaultMessage='Progression'
                          />
                        )}
                      />
                    </Col>
                    <Col n='12'>
                      <ChartEvolutionProportion graphComments={false} />
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
              />
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
              />
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
              <Container fluid className='bg-blue'>
                <section className='py-48 px-20 px-md-64 max-996'>
                  <Row gutters>
                    <Col n='12'>
                      <h4 className='marianne fs-28-32 text-left-m text-center m-0 mb-32'>
                        Outils, conseils… comment contribuer à la Science
                        ouverte
                      </h4>
                    </Col>
                    <Col n='12 md-4' className='mb-20'>
                      <LinkCard
                        title='Les outils'
                        linkUrl='/sante/outils'
                        icon={(
                          <Icon
                            name='icon-bsso-24'
                            color1='blue-dark-125'
                            color2='yellow-medium-100'
                          />
                        )}
                      />
                    </Col>
                    <Col n='12 md-4' className='mb-20'>
                      <LinkCard
                        title='Tutoriels'
                        linkUrl='/sante/tutoriels'
                        icon={(
                          <Icon
                            name='icon-bsso-26'
                            color1='blue-dark-125'
                            color2='orange-soft-75'
                          />
                        )}
                      />
                    </Col>
                    <Col n='12 md-4' className='mb-20'>
                      <LinkCard
                        title='Témoignages'
                        linkUrl='/sante/temoignages'
                        icon={(
                          <Icon
                            name='icon-bsso-25'
                            color1='blue-dark-125'
                            color2='green-soft-75'
                          />
                        )}
                      />
                    </Col>
                    <Col n='12' className='mb-20'>
                      <Card
                        bodyClassName='bg-white'
                        href='/'
                        isHorizontal
                        hasArrow={false}
                      >
                        <CardTitle className='blue-dark'>
                          <FormattedMessage id='app.commons.discover' />
                        </CardTitle>
                        <CardDescription as='div'>
                          <p className='m-0'>
                            <FormattedMessage id='app.commons.more-on-reference' />
                          </p>
                          <DSIcon name='ri-link' size='2x' as='div'>
                            <DSLink
                              className='w-100 text-right'
                              as={<Link to='/' />}
                            />
                          </DSIcon>
                        </CardDescription>
                      </Card>
                    </Col>
                  </Row>
                </section>
              </Container>
            </Col>
            <Col n='12'>
              <TodaySection updateDate={renderUpdateDate()}>
                <TodaySectionItem
                  itemKey='publication'
                  iconName='icon-bsso-28'
                  iconColor='purple-50'
                  intlSubTitle='app.publications'
                  backgroundColorClass='bg-soft-purple'
                />
                <TodaySectionItem
                  itemKey='journal'
                  iconName='icon-bsso-2'
                  iconColor='purple-50'
                  intlSubTitle='app.journals'
                  backgroundColorClass='bg-soft-pink'
                />
                <TodaySectionItem
                  itemKey='publisher'
                  iconName='icon-bsso-14'
                  iconColor='yellow-medium-75'
                  intlSubTitle='app.sante-publi.publishers'
                  backgroundColorClass='bg-yellow'
                />
                <TodaySectionItem
                  itemKey='repository'
                  iconName='icon-bsso-10'
                  iconColor='green-medium-75'
                  intlSubTitle='app.sante-publi.repositories'
                  backgroundColorClass='bg-medium-green'
                />
                <TodaySectionItem
                  itemKey='obsDates'
                  iconName='icon-bsso-10'
                  iconColor='green-light-75'
                  intlSubTitle='app.obs-dates'
                  backgroundColorClass='bg-light-green'
                />
                <TodaySectionItem
                  itemKey='interventional'
                  iconName='icon-bsso-24'
                  iconColor='purple-medium-50'
                  intlSubTitle='app.interventionals'
                  backgroundColorClass='bg-medium-purple'
                />
                <TodaySectionItem
                  itemKey='observational'
                  iconName='icon-bsso-6'
                  iconColor='yellow-medium-75'
                  intlSubTitle='app.observationals'
                  backgroundColorClass='bg-yellow'
                />
              </TodaySection>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default BaroSante;
