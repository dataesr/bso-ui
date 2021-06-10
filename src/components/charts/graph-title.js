import PropTypes from 'prop-types';
import React from 'react';

const GraphTitle = ({ title }) => <p>{title}</p>;

export default GraphTitle;

GraphTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
