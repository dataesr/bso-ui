import './style.scss';

import PropTypes from 'prop-types';
import React from 'react';

function Button({ children, onClick, onKeyPress }) {
  return (
    <button
      className='josm-button'
      type='button'
      onClick={onClick}
      onKeyPress={onKeyPress}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  onClick: () => {},
  onKeyPress: () => {},
};

Button.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func,
  onKeyPress: PropTypes.func,
};

export default Button;
