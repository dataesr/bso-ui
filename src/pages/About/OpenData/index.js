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

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';

function OpenData() {
  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-23'
          color1='blue-soft-125'
          color2='blue-soft-75'
        />
      </Col>
    </Row>
  );
  return (
    <div className='opendata'>
      <Banner
        backgroundColor='blue-soft-50'
        textColor='blue-dark-150'
        supTitle={<FormattedMessage id='app.header.title' />}
        title={<FormattedMessage id='app.header.nav.a-propos-open' />}
        icons={renderIcons}
      />
      <Container>
        <section className='content py-48'>
          <Row gutters>
            <Col n='12'>
              <Card
                bodyClassName='bg-blue-soft-100 color-white'
                hasArrow={false}
                hasBorder={false}
                href='https://data.enseignementsup-recherche.gouv.fr/pages/explorer/?refine.keyword=BSO&sort=modified'
              >
                <CardDescription as='div'>
                  <Container>
                    <Row alignItems='middle'>
                      <Col n='12 md-6'>
                        <div className='w-100 fs-32-40 marianne-bold pb-32 color-white text-center text-left-l'>
                          <FormattedMessage id='app.link.opendata.title' />
                        </div>
                        <div className='text-center text-left-l fs-20-20 pb-56'>
                          <FormattedMessage id='app.link.opendata' />
                        </div>
                      </Col>
                      <Col n='12 md-6'>
                        <DSIcon name='ri-file-fill' size='10x'>
                          <div className='w-100 text-center' />
                        </DSIcon>
                      </Col>
                      <Col n='12'>
                        <DSIcon
                          name='ri-link'
                          size='2x'
                          as='div'
                          className='ds-fr--v-middle'
                        >
                          <DSLink
                            className='w-100 text-right no-content-after'
                            href='https://data.enseignementsup-recherche.gouv.fr/pages/explorer/?refine.keyword=BSO&sort=modified'
                            target='_blank'
                          />
                        </DSIcon>
                      </Col>
                    </Row>
                  </Container>
                </CardDescription>
              </Card>
            </Col>
          </Row>
          <Row gutters>
            <Col n='12'>
              <Card
                bodyClassName='bg-blue-soft-150 color-white'
                hasArrow={false}
                hasBorder={false}
                href='https://github.com/orgs/dataesr/repositories?q=bso'
              >
                <CardDescription as='div'>
                  <Container>
                    <Row alignItems='middle'>
                      <Col n='12 md-6'>
                        <div className='w-100 fs-32-40 marianne-bold pb-32 color-white text-center text-left-l'>
                          <FormattedMessage id='app.link.github.code-projet' />
                        </div>
                        <div className='text-center text-left-l fs-20-20 pb-56'>
                          <FormattedMessage id='app.link.github' />
                        </div>
                      </Col>
                      <Col n='12 md-6'>
                        <DSIcon name='ri-github-fill' size='10x'>
                          <div className='w-100 text-center' />
                        </DSIcon>
                      </Col>
                      <Col n='12'>
                        <DSIcon
                          name='ri-link'
                          size='2x'
                          as='div'
                          className='ds-fr--v-middle'
                        >
                          <DSLink
                            className='w-100 text-right no-content-after'
                            href='https://github.com/orgs/dataesr/repositories?q=bso'
                            target='_blank'
                          />
                        </DSIcon>
                      </Col>
                    </Row>
                  </Container>
                </CardDescription>
              </Card>
            </Col>
          </Row>
          <Row gutters>
            <Col n='12'>
              <section className='content py-4'>
                <h3>
                  <FormattedMessage id='app.citation.all' />
                </h3>
              </section>
              <section className='content py-4'>
                <strong>
                  <FormattedMessage id='app.citation1' />
                </strong>
                <p>
                  Eric Jeangirard. Monitoring Open Access at a national level:
                  French case study. ELPUB 2019 23rd edition of the
                  International Conference on Electronic Publishing, Jun 2019,
                  Marseille, France. doi:
                  {' '}
                  <a
                    href='https://doi.org/10.4000/proceedings.elpub.2019.20'
                    target='_blank'
                    rel='noreferrer'
                  >
                    10.4000/proceedings.elpub.2019.20
                  </a>
                </p>
              </section>
              <section className='content py-4'>
                <strong>
                  <FormattedMessage id='app.citation2' />
                </strong>
                <p>
                  Anne L'Hôte, Eric Jeangirard. Using Elasticsearch for entity
                  recognition in affiliation disambiguation. 2021, arXiv:
                  {' '}
                  <a
                    href='https://arxiv.org/abs/2110.01958'
                    target='_blank'
                    rel='noreferrer'
                  >
                    2110.01958
                  </a>
                  {' '}
                  ; hal:
                  {' '}
                  <a
                    href='https://hal.science/hal-03365806'
                    target='_blank'
                    rel='noreferrer'
                  >
                    hal-03365806
                  </a>
                </p>
              </section>
              <section className='content py-4'>
                <strong>
                  <FormattedMessage id='app.citation3' />
                </strong>
                <p>
                  Laetitia Bracco, Anne L'Hôte, Eric Jeangirard, Didier Torny.
                  Extending the open monitoring of open science: A new framework
                  for the French Open Science Monitor (BSO). 2022. hal:
                  {' '}
                  <a
                    href='https://hal.science/hal-03651518'
                    target='_blank'
                    rel='noreferrer'
                  >
                    hal-03651518
                  </a>
                </p>
              </section>
              <section className='content py-4'>
                <strong>
                  <FormattedMessage id='app.citation4' />
                </strong>
                <p>
                  Aricia Bassinet, Laetitia Bracco, Anne L'Hôte, Eric
                  Jeangirard, Patrice Lopez, et al.. Large-scale
                  Machine-Learning analysis of scientific PDF for monitoring the
                  production and the openness of research data and software in
                  France. 2023. hal:
                  {' '}
                  <a
                    href='https://hal.science/hal-04121339'
                    target='_blank'
                    rel='noreferrer'
                  >
                    hal-04121339
                  </a>
                </p>
              </section>
              <section className='content py-4'>
                <strong>
                  <FormattedMessage id='app.citation5' />
                </strong>
                <p>
                  Laetitia Bracco, Eric Jeangirard, Anne L'Hôte, Laurent Romary.
                  How to build an Open Science Monitor based on publications? A
                  French perspective ? 2024. hal:
                  {' '}
                  <a
                    href='https://hal.science/hal-04854788'
                    target='_blank'
                    rel='noreferrer'
                  >
                    hal-04854788
                  </a>
                </p>
              </section>
              <section className='content py-4'>
                <strong>
                  <FormattedMessage id='app.citation6' />
                </strong>
                <p>
                  Aricia Bassinet, Laetitia Bracco, Eric Jeangirard, Anne
                  L'Hôte, Patrice Lopez, et al.. Plan de gestion de données du
                  projet "Baromètre Science Ouverte Données et codes". Ministère
                  de l'Enseignement Supérieur et de la Recherche; Université de
                  Lorraine; Inria. 2022. hal:
                  {' '}
                  <a
                    href='https://hal.science/hal-05391570'
                    target='_blank'
                    rel='noreferrer'
                  >
                    hal-05391570
                  </a>
                </p>
              </section>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default OpenData;
