import { Link as DSLink } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';

import useGraphNavigation from '../../utils/Hooks/useGraphNavigation';

export default function GraphNavigationLink({ href, label }) {
  const { openTab } = useGraphNavigation();
  const history = useHistory();
  const onClickLink = () => {
    openTab('');
    history.push(href);
  };
  return (
    <li>
      <DSLink onClick={onClickLink}>{label}</DSLink>
    </li>
  );
}

GraphNavigationLink.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
