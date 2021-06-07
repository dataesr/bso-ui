import PropTypes from 'prop-types';
import React from 'react';

const GraphComments = ({ comments }) => <p>{comments}</p>;

export default GraphComments;

GraphComments.prototype = {
  comments: PropTypes.string.isRequired,
};
