import './graph.scss';

import PropTypes from 'prop-types';
import React from 'react';

const GraphComments = ({ comments }) => (
  <div className='graph-comments'>
    <div className='fs-14-24 marianne-bold'>Commentaire</div>
    <p className='marianne fs-14-24'>{comments}</p>
  </div>
);

export default GraphComments;

GraphComments.propTypes = {
  comments: PropTypes.string.isRequired,
};
