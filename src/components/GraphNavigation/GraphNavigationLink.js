import { Link as DSLink } from '@dataesr/react-dsfr';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';

import useGraphNavigation from '../../utils/Hooks/useGraphNavigation';

export default function GraphNavigationLink({ href, label }) {
  const { trackEvent } = useMatomo();
  const { openTab } = useGraphNavigation();
  const history = useHistory();
  const onClickLink = () => {
    openTab('');
    trackEvent({
      category: 'navigation',
      action: 'click-to-graph',
      name: `click_${label}`,
    });
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
