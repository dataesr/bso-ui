import { Col, Container, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

function WrapperCol({ active, columns, container, children, gutters }) {
  let composition = children;
  if (active) {
    composition = (
      <Col n={columns}>
        {container ? (
          <Container fluid>
            <Row gutters={gutters}>{children}</Row>
          </Container>
        ) : (
          children
        )}
      </Col>
    );
  }
  return composition;
}

WrapperCol.defaultProps = {
  active: true,
  container: true,
  gutters: true,
};

WrapperCol.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  gutters: PropTypes.bool,
  active: PropTypes.bool,
  container: PropTypes.bool,
  columns: PropTypes.string.isRequired,
};

export default WrapperCol;
