import { Link as DSLink, SideMenuItem } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import useLang from '../../utils/Hooks/useLang';
import useViewport from '../../utils/Hooks/useViewport';
import GraphNavigationLink from './GraphNavigationLink';
import GraphTabSubItem from './GraphTabSubItem';

function GraphItem({ isDisplayed, links, mainLabel, paths }) {
  const { pathname, search } = useLocation();
  const { mobile, tablet, desktop } = useViewport();
  const viewPort = useRef('desktop');
  const { lang } = useLang();

  useEffect(() => {
    const objMargin = {
      mobile: 220,
      tablet: -90,
      desktop: -130,
    };
    const query = new URLSearchParams(search);
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
        }, 800);
      }
    }
  }, [desktop, mainLabel, mobile, search]);

  function getUrl(href, s) {
    const params = href.split('?');
    const params1 = params.length > 0 ? new URLSearchParams(params[1]) : [];
    const params2 = new URLSearchParams(s);
    params2.delete('id');
    params2.forEach((value, key) => {
      params1.append(key, value);
    });
    return `${params[0]}?${params1.toString()}`;
  }

  return (
    <>
      {mobile && isDisplayed && (
        <SideMenuItem key={uuidv4()} title={mainLabel}>
          {links.map(
            (link) => link
              && (link.isDisplayed === undefined || link.isDisplayed) && (
              <DSLink
                key={uuidv4()}
                className='no-border'
                as={<Link to={getUrl(link.href[lang], search)} />}
              >
                <div className='text-white fs-14-24 pb-8'>{link.label}</div>
              </DSLink>
            ),
          )}
        </SideMenuItem>
      )}
      {(desktop || tablet) && isDisplayed && (
        <GraphTabSubItem
          key={uuidv4()}
          label={mainLabel}
          activeTab={paths.indexOf(`${pathname}`) > -1}
        >
          {links.map(
            (link, index) => link
              && (link.isDisplayed === undefined || link.isDisplayed) && (
              <GraphNavigationLink
                key={uuidv4()}
                href={getUrl(link.href[lang], search)}
                label={link.label}
                hasHr={index === 0}
              />
            ),
          )}
        </GraphTabSubItem>
      )}
    </>
  );
}

GraphItem.defaultProps = {
  isDisplayed: true,
  __TYPE: 'GraphItem',
};

GraphItem.propTypes = {
  isDisplayed: PropTypes.bool,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      isDisplayed: PropTypes.bool,
    }),
  ).isRequired,
  mainLabel: PropTypes.string.isRequired,
  paths: PropTypes.arrayOf(PropTypes.string).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  __TYPE: PropTypes.string,
};

export default GraphItem;
