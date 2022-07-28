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
import { FormattedMessage, useIntl } from 'react-intl';

import Icon from '../Icon';
import LinkCard from '../LinkCard';

export default function ToolCardsSection() {
  const intl = useIntl();

  return (
    <Container fluid className='bg-blue'>
      <section className='px-20 py-48 px-md-64'>
        <Row gutters justifyContent='center' alignItems='middle'>
          <Col n='12 md-9'>
            <Row>
              <h4 className='marianne fs-28-32 text-left-m text-center m-0 mb-32'>
                <FormattedMessage id='app.commons.contribute.title' />
              </h4>
            </Row>
            <Row gutters alignItems='middle'>
              <Col n='12 md-4' className='mb-20'>
                <LinkCard
                  title={intl.formatMessage({
                    id: 'app.card.initiation.title',
                  })}
                  linkUrl={intl.formatMessage({
                    id: 'app.card.initiation.url',
                  })}
                  icon={(
                    <Icon
                      name='icon-bsso-35'
                      color1='blue-dark-125'
                      color2='yellow-medium-100'
                    />
                  )}
                />
              </Col>
              <Col n='12 md-4' className='mb-20'>
                <LinkCard
                  title={intl.formatMessage({ id: 'app.card.resources.title' })}
                  linkUrl={intl.formatMessage({ id: 'app.card.resources.url' })}
                  icon={(
                    <Icon
                      name='icon-bsso-36'
                      color1='blue-dark-125'
                      color2='orange-soft-75'
                    />
                  )}
                />
              </Col>
              <Col n='12 md-4' className='mb-20'>
                <LinkCard
                  title={intl.formatMessage({
                    id: 'app.card.national-politics.title',
                  })}
                  linkUrl={intl.formatMessage({
                    id: 'app.card.national-politics.url',
                  })}
                  icon={(
                    <Icon
                      name='icon-bsso-37'
                      color1='blue-dark-125'
                      color2='green-soft-75'
                    />
                  )}
                />
              </Col>
              <Col n='12' className='mb-20'>
                <Card
                  bodyClassName='bg-white'
                  className='fr-card--no-border'
                  hasArrow={false}
                  href='/'
                  isHorizontal
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
                        className='w-100 text-right no-content-after'
                        href={intl.formatMessage({
                          id: 'app.card.open-science.url',
                        })}
                        target='_blank'
                      />
                    </DSIcon>
                  </CardDescription>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </section>
    </Container>
  );
}
