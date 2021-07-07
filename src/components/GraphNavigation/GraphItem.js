import {
  Link as DSLink,
  SideMenuItem,
  SideMenuLink,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import useViewport from '../../utils/Hooks/useViewport';
import GraphTabSubItem from './GraphTabSubItem';

function GraphItem({ links, mainLabel, paths }) {
  const location = useLocation();
  const { mobile, tablet, desktop } = useViewport();
  return (
    <>
      {mobile && (
        <SideMenuItem key={uuidv4()} title={mainLabel}>
          {links.map((link) => (
            <SideMenuLink key={uuidv4()} className='no-border'>
              <DSLink as={<Link to={link.href} />}>{link.label}</DSLink>
            </SideMenuLink>
          ))}
        </SideMenuItem>
      )}
      {(desktop || tablet) && (
        <GraphTabSubItem
          key={uuidv4()}
          label={mainLabel}
          activeTab={paths.indexOf(`${location.pathname}`) > -1}
        >
          {links.map((link) => (
            <li key={uuidv4()}>
              <DSLink as={<Link to={link.href} />}>{link.label}</DSLink>
            </li>
          ))}
        </GraphTabSubItem>
      )}
    </>
  );
}

GraphItem.defaultProps = {
  __TYPE: 'GraphItem',
};

GraphItem.propTypes = {
  mainLabel: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    }),
  ).isRequired,
  paths: PropTypes.arrayOf(PropTypes.string).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  __TYPE: PropTypes.string,
};

export default GraphItem;
