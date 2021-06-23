import {
  Container,
  Row,
  SideMenu,
  SideMenuItem,
  SideMenuLink,
} from '@dataesr/react-dsfr';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import useScroll from '../../utils/Hooks/useScroll';
import useViewport from '../../utils/Hooks/useViewport';
import Tab from './Tab';

function TabNavigation() {
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
    scrollTop,
    scrollingDown,
    setSticky,
    offsetTop,
    setOffsetTop,
    initOffsetTop,
  ]);

  return (
    <section
      ref={ref}
      style={{ top: bannerHeight - 1 }}
      className={classNames('bso-tab-navigation relative', {
        sticky,
      })}
    >
      <Container>
        {mobile && (
          <SideMenu title='Général' buttonLabel='Général'>
            <SideMenuItem title='Niveau 1'>
              <SideMenuLink href='/'>Accès direct niveau 2</SideMenuLink>
              <SideMenuLink href='/'>Accès direct niveau 2</SideMenuLink>
              <SideMenuItem title='Niveau 2'>
                <SideMenuLink href='/'>Accès direct niveau 3</SideMenuLink>
                <SideMenuLink href='/'>Accès direct niveau 3</SideMenuLink>
                <SideMenuLink href='/'>Accès direct niveau 3</SideMenuLink>
                <SideMenuLink href='/'>Accès direct niveau 3</SideMenuLink>
                <SideMenuLink href='/'>Accès direct niveau 3</SideMenuLink>
                <SideMenuLink href='/'>Accès direct niveau 3</SideMenuLink>
              </SideMenuItem>
              <SideMenuLink href='/'>Accès direct niveau 2</SideMenuLink>
              <SideMenuLink href='/'>Accès direct niveau 2</SideMenuLink>
              <SideMenuLink href='/'>Accès direct niveau 2</SideMenuLink>
            </SideMenuItem>
            <SideMenuItem title='Niveau 1'>
              <SideMenuLink href='/'>Accès direct niveau 2</SideMenuLink>
              <SideMenuLink href='/'>Accès direct niveau 2</SideMenuLink>
              <SideMenuItem title='Niveau 2'>
                <SideMenuLink href='/'>Accès direct niveau 3</SideMenuLink>
                <SideMenuLink href='/'>Accès direct niveau 3</SideMenuLink>
                <SideMenuLink href='/'>Accès direct niveau 3</SideMenuLink>
                <SideMenuLink href='/'>Accès direct niveau 3</SideMenuLink>
                <SideMenuLink href='/'>Accès direct niveau 3</SideMenuLink>
                <SideMenuLink href='/'>Accès direct niveau 3</SideMenuLink>
              </SideMenuItem>
              <SideMenuLink href='/'>Accès direct niveau 2</SideMenuLink>
              <SideMenuLink href='/'>Accès direct niveau 2</SideMenuLink>
              <SideMenuLink href='/'>Accès direct niveau 2</SideMenuLink>
            </SideMenuItem>
          </SideMenu>
        )}
        {(tablet || desktop) && (
          <section className='bso-tab-navigation-desktop pt-8'>
            <nav>
              <Row>
                <Tab
                  label='Tab1'
                  links={[{ href: '#test', label: 'Lien 1' }]}
                />
                <Tab
                  label='Tab2'
                  links={[
                    { href: '#test', label: 'Lien 1' },
                    { href: '#test', label: 'Lien 2' },
                  ]}
                />
                <Tab
                  label='Tab3'
                  links={[{ href: '#test', label: 'Lien 1' }]}
                />
              </Row>
            </nav>
          </section>
        )}
      </Container>
    </section>
  );
}

export default TabNavigation;
