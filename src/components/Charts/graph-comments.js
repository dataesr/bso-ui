import './graph.scss';

import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

function GraphComments({ comments, hasFooter }) {
  return (
    <div className='graph-comments'>
      <div className='fs-14-24 marianne-bold'>
        <FormattedMessage id='app.commons.graph-comment.label' />
      </div>
      <p className={`marianne fs-14-24 ${hasFooter ? '' : 'm-0'}`}>
        {comments}
      </p>
    </div>
  );
}

GraphComments.defaultProps = {
  hasFooter: true,
};
GraphComments.propTypes = {
  comments: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  hasFooter: PropTypes.bool,
};

export default GraphComments;
