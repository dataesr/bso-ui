import React from 'react';
import PropTypes from 'prop-types';

const QuestionSection = ({
  title,
  info,
  description,
  backgroundColor,
  children,
}) => {
  return (
    <section style={{ backgroundColor }}>
      <h2>
        {title}
        <span>i</span>
      </h2>
      <p>{description}</p>
      {children}
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
