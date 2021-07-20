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
import HomeSection from '../../components/HomeSection';
import Icon from '../../components/Icon';
import InfoCard from '../../components/InfoCard';
import LinkCard from '../../components/LinkCard';
import logoBso from '../../images/logo-bso.png';
import { GetPublicationRateFrom } from '../../utils/dataFetchHelper';
import { getDateFormated } from '../../utils/helpers';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import useLang from '../../utils/Hooks/useLang';

function BaroSante() {
  const { updateDate, observationDates } = useGlobals();
  const [progression, setProgression] = useState({});
  const { lang } = useLang();
  const [start, setStart] = useState('2020');
  const [end, setEnd] = useState('2021Q1');

  const updateProgression = (res, year) => {
    const { rate } = res;
    if (
      (Object.keys(progression).indexOf(year) < 0 && rate)
      || (progression[year] !== rate && rate)
    ) {
      setProgression((prev) => ({ ...prev, [year]: rate }));
    }
  };

  GetPublicationRateFrom(start).then((res) => {
    updateProgression(res, start);
  });

  GetPublicationRateFrom(end).then((res) => {
    updateProgression(res, end.substring(0, 4));
  });

  useEffect(() => {
    setStart(observationDates[1]);
    setEnd(observationDates[0]);
  }, [observationDates]);

  const progressionPoints = () => {
    let progPoints = '';
    if (end && start) {
      const cleanEnd = end.substring(0, 4);
      const rhesus = progression[cleanEnd] >= progression[start] ? '+' : '';
      const endNumber = progression[cleanEnd]
        ? parseInt(progression[cleanEnd], 10)
        : 0;
      const startNumber = progression[start]
        ? parseInt(progression[start], 10)
        : 0;
      progPoints = `${rhesus}${endNumber - startNumber}`;
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
        supTitle='Baromètre français de la science ouverte'
        title='Santé'
        subTitle='Publications, essais cliniques, études observationnelles:
        Découvrez l’évolution de l’accès ouvert de la recherche en santé
en France à partir de données fiables, ouvertes et maîtrisées.'
        chip={<Chip backgroundColor='blue-soft-125' />}
        icons={renderIcons}
      />
      <Container fluid>
        <section className='content'>
          <Row>
            <Col n='8 md-12 xl-9' className='px-20 px-md-64' offset='xl-3'>
              <section className='py-28'>
                <h2 className='marianne-light fs-28-32 fs-40-48-xl m-0'>
                  Les chiffres-clés de la Santé
                </h2>
                <p className='fs-14-24 blue m-0'>
                  <FormattedMessage
                    values={{
                      date: getDateFormated(updateDate, lang),
                      endDate: end,
                      startDate: observationDates[observationDates.length - 1],
                    }}
                    id='app.sante.update.date'
                    defaultMessage=''
                  />
                </p>
              </section>
            </Col>
            <Col n='12 xl-9' offset='xl-3'>
              <HomeSection
                link={{
                  href: '/sante/publications/dynamique',
                  label: 'Voir le détail des publications',
                }}
                title='Les publications'
                introText={`Les publications en accès ouvert external-link-square-alt désignent les publications de recherche
          mises à disposition librement sur l'internet public. Le taux d'accès ouvert représente le ratio du
          nombre de publications en accès ouvert rapporté au nombre total de publications
          sur le même périmètre (par exemple par année, discipline ou éditeur)…`}
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
                        data1={`${progressionPoints()}`}
                        data2='pts'
                        title={(
                          <FormattedMessage
                            values={{
                              startYear: start,
                              endYear: end.substring(0, 4),
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
            <Col n='12 xl-9' offset='xl-3'>
              <HomeSection
                link={{
                  href: '/sante/essais-cliniques',
                  label: 'Voir le détail des essais cliniques',
                }}
                title='Les essais cliniques'
                introText={`Les essais cliniques déclarés external-link-square-alt désignent nisl sit cursus id lacus.
                  Morbi neque consequat nisl fermentum, massa tellus ut elementum. Ac elementum enim arcu suspendisse vestibulum.
                  Laoreet viverra aenean risus accumsan eu. In elit tempor commodo scelerisque pretium,`}
              >
                <Container fluid />
              </HomeSection>
            </Col>
            <Col n='12 xl-9' offset='xl-3'>
              <HomeSection
                link={{
                  href: '/sante/etudes-observationelles',
                  label: 'Voir le détail des études observationnelles',
                }}
                title='Les études observationnelles'
                introText={`Les études observationnelles déclarées external-link-square-alt désignent nisl sit cursus id lacus.
                  Morbi neque consequat nisl fermentum, massa tellus ut elementum. Ac elementum enim arcu suspendisse vestibulum.
                  Laoreet viverra aenean risus accumsan eu.
                  In elit tempor commodo scelerisque pretium,`}
              >
                <Container fluid />
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
                                  Explorer aussi le Baromètre national de la
                                  science ouverte
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
                <section className='py-48 px-20 px-md-64'>
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
                          Découvrez Ouvrir la science
                        </CardTitle>
                        <CardDescription as='div'>
                          <p className='m-0'>
                            Plus de contenus et de bonnes pratiques sur le site
                            de référence sur la Science Ouverte
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
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default BaroSante;
