import React from 'react';
import PropTypes from 'prop-types';

const GraphComments = ({ comments }) => <p>{comments}</p>;

export default GraphComments;

GraphComments.prototype = {
  comments: PropTypes.string.isRequired,
};
