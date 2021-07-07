import PropTypes from 'prop-types';
import React from 'react';
import { useLocation } from 'react-router-dom';

function ContentItem({ children, paths }) {
  const location = useLocation();
  return paths.indexOf(`${location.pathname}`) > -1 ? <>{children}</> : null;
}

ContentItem.defaultProps = {
  paths: [''],
};
ContentItem.propTypes = {
  children: PropTypes.node.isRequired,
  paths: PropTypes.arrayOf(PropTypes.string),
};

export default ContentItem;
