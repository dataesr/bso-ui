import PropTypes from 'prop-types';
import React from 'react';

const GraphComments = ({ comments }) => (
  <div style={{ backgroundColor: 'white', padding: '28px' }}>
    <div>
      <strong>Commentaire</strong>
    </div>
    {comments}
  </div>
);

export default GraphComments;

GraphComments.prototype = {
  comments: PropTypes.string.isRequired,
};
