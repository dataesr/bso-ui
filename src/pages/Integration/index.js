import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import React, { Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BSOChart from '../../components/Charts';
import Loader from '../../components/Loader';

const Integration = () => {
  const { graphId, domain } = useParams();
  const { trackPageView } = useMatomo();

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  return (
    <Container fluid>
      <Row justifyContent='center'>
        <Col n='10'>
          <Suspense fallback={<Loader />}>
            <BSOChart id={graphId} domain={domain || ''} />
          </Suspense>
        </Col>
      </Row>
    </Container>
  );
};

export default Integration;
