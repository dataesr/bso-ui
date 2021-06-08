import { Container } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

const QuestionSection = ({
  title,
  info,
  description,
  backgroundColor,
  children,
}) => {
  return (
    <section style={{ backgroundColor, paddingTop: '28px' }}>
      <Container>
        <h2>
          {title}
          <span>i</span>
        </h2>
        <p>{description}</p>
        {children}
      </Container>
    </section>
  );
};

export default QuestionSection;

QuestionSection.prototype = {
  title: PropTypes.string.isRequired,
  info: PropTypes.string,
  description: PropTypes.string,
  backgroundColor: PropTypes.string,
  children: PropTypes.string,
};
