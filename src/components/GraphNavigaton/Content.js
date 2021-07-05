import PropTypes from 'prop-types';
import React from 'react';
import { useLocation } from 'react-router-dom';

function Content({ children, activePath }) {
  const location = useLocation();
  return activePath.indexOf(`${location.pathname}`) > -1 ? (
    <>{children}</>
  ) : null;
}

Content.propTypes = {
  children: PropTypes.node.isRequired,
  activePath: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Content;
