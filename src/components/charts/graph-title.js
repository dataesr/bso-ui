import React from 'react';
import PropTypes from 'prop-types';

const GraphTitle = ({ title }) => <p>{title}</p>;

export default GraphTitle;

GraphTitle.prototype = {
  title: PropTypes.string.isRequired,
};
