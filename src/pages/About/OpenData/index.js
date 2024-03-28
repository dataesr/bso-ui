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
        title={<FormattedMessage id='app.header.nav.a-propos-opendata' />}
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
        </section>
      </Container>
    </div>
  );
}

export default OpenData;
