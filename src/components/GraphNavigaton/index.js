import { Container, Row, SideMenu } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Children, useEffect, useRef, useState } from 'react';

import useScroll from '../../utils/Hooks/useScroll';
import useViewport from '../../utils/Hooks/useViewport';

function GraphNavigation({ buttonLabel, children }) {
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
      setBannerHeight(banner && banner.getBoundingClientRect().height);
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
  const contentNavigation = [];
  const contentItemNavigation = Children.toArray(children).filter((child) => {
    contentNavigation.push(child.props.children);
    return child.type.name === 'ItemHeader';
  });
  return (
    <>
      <section
        ref={ref}
        style={{ top: sticky ? bannerHeight - 1 : 0 }}
        className={classNames('bso-tab-navigation relative z-100', {
          sticky,
          mobile,
        })}
      >
        <Container>
          {mobile && (
            <SideMenu
              title=''
              className='navigation-mobile'
              buttonLabel={buttonLabel}
            >
              {contentItemNavigation}
            </SideMenu>
          )}
          {(tablet || desktop) && (
            <section className='navigation-desktop pt-8'>
              <nav>
                <Row>{contentItemNavigation}</Row>
              </nav>
            </section>
          )}
        </Container>
      </section>
      {contentNavigation.map((content) => content)}
    </>
  );
}

GraphNavigation.propTypes = {
  children: PropTypes.node.isRequired,
  buttonLabel: PropTypes.string.isRequired,
};

export default GraphNavigation;
