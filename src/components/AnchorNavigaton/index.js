import {
  Container,
  Row,
  SideMenu,
  SideMenuItem,
  SideMenuLink,
} from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import useScroll from '../../utils/Hooks/useScroll';
import useViewport from '../../utils/Hooks/useViewport';
import Tab from './Tab';

function AnchorNavigation({ tabs }) {
  const [sticky, setSticky] = useState(false);
  const [offsetTop, setOffsetTop] = useState(null);
  const [initOffsetTop, setInitOffsetTop] = useState(null);
  const [bannerHeight, setBannerHeight] = useState(0);

  const { scrollTop, scrollingDown } = useScroll();
  const { mobile, tablet, desktop } = useViewport();
  const ref = useRef(null);

  useEffect(() => {
    if (sticky && !bannerHeight) {
      const banner = document.querySelector('.bso-banner.sticky');
      setBannerHeight(banner.getBoundingClientRect().height);
    }
  }, [sticky, bannerHeight, setBannerHeight]);

  useEffect(() => {
    if (!offsetTop) {
      setInitOffsetTop(ref.current.offsetTop);
      setOffsetTop(ref.current.offsetTop);
    }
  }, [offsetTop, setOffsetTop]);

  useEffect(() => {
    if (ref.current.offsetTop !== offsetTop) {
      setOffsetTop(ref.current.offsetTop);
    }

    if (scrollTop > offsetTop - bannerHeight && scrollingDown) {
      setSticky(true);
    } else if (scrollTop < initOffsetTop && !scrollingDown) {
      setSticky(false);
    }
  }, [
    bannerHeight,
    scrollTop,
    scrollingDown,
    setSticky,
    offsetTop,
    setOffsetTop,
    initOffsetTop,
  ]);
  const onTest = () => {
    console.debug('==== DEBUG ==== ');
  };
  return (
    <section
      ref={ref}
      style={{ top: sticky ? bannerHeight - 1 : 0 }}
      className={classNames('bso-tab-navigation relative z-100', {
        sticky,
      })}
    >
      <Container>
        {mobile && (
          <SideMenu
            title=''
            className='bso-tab-navigation-mobile'
            buttonLabel='Menu'
          >
            {tabs
              && tabs.map((tab) => (
                <SideMenuItem key={uuidv4()} title={tab.mainLabel}>
                  {tab.links.map((link) => (
                    <SideMenuLink
                      onClick={onTest}
                      className='no-border'
                      href={link.href}
                    >
                      {link.label}
                    </SideMenuLink>
                  ))}
                </SideMenuItem>
              ))}
          </SideMenu>
        )}
        {(tablet || desktop) && (
          <section className='bso-tab-navigation-desktop pt-8'>
            <nav>
              <Row>
                {tabs
                  && tabs.map((tab) => (
                    <Tab key={uuidv4()} label={tab.mainLabel}>
                      {tab.links.map((link) => (
                        <li key={uuidv4()}>
                          <a href={link.href}>{link.label}</a>
                        </li>
                      ))}
                    </Tab>
                  ))}
              </Row>
            </nav>
          </section>
        )}
      </Container>
    </section>
  );
}

AnchorNavigation.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      mainLabel: PropTypes.string,
      links: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          href: PropTypes.string.isRequired,
        }),
      ),
    }).isRequired,
  ).isRequired,
};

export default AnchorNavigation;
