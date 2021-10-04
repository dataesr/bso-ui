import { Col, Container, Row, Service } from '@dataesr/react-dsfr';
import React, { Suspense } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import BSOChart from '../../components/Charts';
import Loader from '../../components/Loader';

const Integration = () => {
  const { graphId, domain, studyType } = useParams();
  const intl = useIntl();

  return (
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
  );
};

export default Integration;
