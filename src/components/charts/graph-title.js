import PropTypes from 'prop-types';
import React from 'react';

const GraphTitle = ({ title }) => (
  <span style={{ color: 'var(--blue-dark-125)' }}>
    <h3 className='fs-16-24 marianne-bold'>{title}</h3>
  </span>
);

export default GraphTitle;

GraphTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
