import PropTypes from 'prop-types';
import React from 'react';
import { useLocation } from 'react-router-dom';

function Content({ children, paths }) {
  const location = useLocation();
  return paths.indexOf(`${location.pathname}`) > -1 ? <>{children}</> : null;
}

Content.defaultProps = {
  paths: [''],
};
Content.propTypes = {
  children: PropTypes.node.isRequired,
  paths: PropTypes.arrayOf(PropTypes.string),
};

export default Content;
