import { Link as DSLink } from '@dataesr/react-dsfr';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';

import useGraphNavigation from '../../utils/Hooks/useGraphNavigation';
import Icon from '../Icon';

export default function GraphNavigationLink({ href, label, hasHr }) {
  const { trackEvent } = useMatomo();
  const { openTab } = useGraphNavigation();
  const history = useHistory();
  const onClickLink = () => {
    openTab('');

    trackEvent({
      category: 'navigation',
      action: 'click-to-graph',
      name: `go_to_${label}`,
    });

    history.push(href);
  };
  return (
    <li>
      <DSLink onClick={onClickLink}>{label}</DSLink>
      <div className='float-right'>
        <Icon name='icon-bsso-34' color1='blue-soft-125' />
      </div>
      {hasHr && <hr className='ml-n16 text-white' />}
    </li>
  );
}

GraphNavigationLink.defaultProps = {
  hasHr: false,
};

GraphNavigationLink.propTypes = {
  hasHr: PropTypes.bool,
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
