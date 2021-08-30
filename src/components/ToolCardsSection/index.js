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
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import Icon from '../Icon';
import LinkCard from '../LinkCard';

export default function ToolCardsSection() {
  return (
    <Container fluid className='bg-blue'>
      <section className='py-48 px-20 px-md-64 max-996'>
        <Row gutters>
          <Col n='12'>
            <h4 className='marianne fs-28-32 text-left-m text-center m-0 mb-32'>
              Outils, conseils… comment contribuer à la Science ouverte
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
                  <DSLink className='w-100 text-right' as={<Link to='/' />} />
                </DSIcon>
              </CardDescription>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
}
