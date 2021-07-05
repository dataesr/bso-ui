import {
  Link as DSLink,
  SideMenuItem,
  SideMenuLink,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import useViewport from '../../utils/Hooks/useViewport';
import SubItemTab from './SubItemTab';

function ItemHeader({ links, currentPath, mainLabel }) {
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
        <SubItemTab key={uuidv4()} label={mainLabel} current={currentPath}>
          {links.map((link) => (
            <li key={uuidv4()}>
              <DSLink as={<Link to={link.href} />}>{link.label}</DSLink>
            </li>
          ))}
        </SubItemTab>
      )}
    </>
  );
}

ItemHeader.propTypes = {
  mainLabel: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    }),
  ).isRequired,
  currentPath: PropTypes.string.isRequired,
};

export default ItemHeader;
