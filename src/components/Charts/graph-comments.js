import './graph.scss';

import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const GraphComments = ({ comments, hasFooter }) => (
  <div className='graph-comments'>
    <div className='fs-16-28 notosans-bold mb-8'>
      <FormattedMessage id='app.commons.graph-comment.label' />
    </div>
    <p className={`fs-16-28 ${hasFooter ? '' : 'm-0'}`}>{comments}</p>
  </div>
);

GraphComments.defaultProps = {
  hasFooter: true,
};
GraphComments.propTypes = {
  comments: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  hasFooter: PropTypes.bool,
};

export default GraphComments;
