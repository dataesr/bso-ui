import './graph.scss';

import PropTypes from 'prop-types';
import React from 'react';

const GraphComments = ({ comments }) => (
  <div className='graph-comments'>
    <div>
      <strong>Commentaire</strong>
    </div>
    {comments}
  </div>
);

export default GraphComments;

GraphComments.propTypes = {
  comments: PropTypes.string.isRequired,
};
