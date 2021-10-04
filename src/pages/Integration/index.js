import { Col, Container, Row, Service } from '@dataesr/react-dsfr';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import React, { Suspense, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import BSOChart from '../../components/Charts';
import Loader from '../../components/Loader';
import PageTracker from '../../components/WebTracking/PageTracker';

const Integration = () => {
  const { graphId, domain, studyType } = useParams();
  const { trackPageView } = useMatomo();
  const intl = useIntl();

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  return (
    <PageTracker>
      <Container fluid>
        <Row justifyContent='center'>
          <Col n='10'>
            <Service
              description=''
              className='main-title'
              title={intl.formatMessage({ id: 'app.header.title' })}
            />
          </Col>
        </Row>
        <Row justifyContent='center'>
          <Col n='10'>
            <Suspense fallback={<Loader />}>
              <BSOChart
                id={graphId}
                domain={domain || ''}
                studyType={studyType || ''}
              />
            </Suspense>
          </Col>
        </Row>
      </Container>
    </PageTracker>
  );
};

export default Integration;
