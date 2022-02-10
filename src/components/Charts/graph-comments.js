import './graph.scss';

import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const GraphComments = ({ comments }) => (
  <div className='graph-comments'>
    <div className='fs-14-24 marianne-bold'>
      <FormattedMessage id='app.commons.graph-comment.label' />
    </div>
    <p className='marianne fs-14-24 m-0'>{comments}</p>
  </div>
);

export default GraphComments;

GraphComments.propTypes = {
  comments: PropTypes.string.isRequired,
};
