import { Link as DSLink, SideMenuItem } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import useViewport from '../../utils/Hooks/useViewport';
import GraphNavigationLink from './GraphNavigationLink';
import GraphTabSubItem from './GraphTabSubItem';

function GraphItem({ links, mainLabel, paths }) {
  const location = useLocation();
  const { mobile, tablet, desktop } = useViewport();
  const viewPort = useRef('desktop');

  useEffect(() => {
    const objMargin = {
      mobile: 220,
      tablet: -90,
      desktop: -130,
    };
    const query = new URLSearchParams(location.search);
    const queryId = query.get('id');
    if (queryId) {
      const element = document.getElementById(`${queryId}`);

      if (element) {
        setTimeout(() => {
          const { left, top } = element.getBoundingClientRect();
          if (!desktop) {
            viewPort.current = mobile ? 'mobile' : 'tablet';
          }
          window.scrollTo(
            left,
            top + window.scrollY + objMargin[viewPort.current],
          );
        }, 200);
      }
    }
  }, [desktop, location, mainLabel, mobile]);

  return (
    <>
      {mobile && (
        <SideMenuItem key={uuidv4()} title={mainLabel}>
          {links.map((link) => (
            <DSLink
              key={uuidv4()}
              className='no-border'
              as={<Link to={link.href} />}
            >
              <div className='text-white fs-14-24 pb-8'>{link.label}</div>
            </DSLink>
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
            <GraphNavigationLink
              key={uuidv4()}
              href={link.href}
              label={link.label}
            />
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
