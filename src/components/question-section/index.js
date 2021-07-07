import { Col, Container, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

const QuestionSection = ({ title, description, backgroundColor, children }) => (
  <section style={{ backgroundColor }} className='relative w-100 pt-32'>
    <Container>
      <Row>
        <Col n='12'>
          <h2>
            {title}
            <span>i</span>
          </h2>
          <p>{description}</p>
          {children}
        </Col>
      </Row>
    </Container>
  </section>
);

export default QuestionSection;

QuestionSection.defaultProps = {
  description: '',
  backgroundColor: '',
  children: null,
};
QuestionSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  backgroundColor: PropTypes.string,
  children: PropTypes.node,
};
