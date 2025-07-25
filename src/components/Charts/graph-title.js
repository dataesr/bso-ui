import PropTypes from 'prop-types';
import React from 'react';

function GraphTitle({ title }) {
  return (
    <span>
      <h3 className='fs-16-24 marianne-bold'>{title}</h3>
    </span>
  );
}

export default GraphTitle;

GraphTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
