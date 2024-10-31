import { Col, Container, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';

import BSOChart from '../Charts';
import Loader from '../Loader';

const FullScreen = ({ domain, graphId, studyType }) => (
  <Container fluid>
    <Row justifyContent='center'>
      <Col>
        <Suspense fallback={<Loader />}>
          <BSOChart
            domain={domain || ''}
            hasComments={false}
            hasFooter={false}
            id={graphId}
            studyType={studyType || ''}
          />
        </Suspense>
      </Col>
    </Row>
  </Container>
);

export default FullScreen;

FullScreen.propTypes = {
  domain: PropTypes.string.isRequired,
  graphId: PropTypes.string.isRequired,
  studyType: PropTypes.string.isRequired,
};
