import { Container, Row, SideMenu } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {
  Children,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

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
  const contents = [];
  const headerItems = Children.toArray(children).filter((child) => {
    const content = cloneElement(child.props.children, {
      ...child.props.children.props,
      key: uuidv4(),
      paths: child.props.paths,
    });
    contents.push(content);
    // eslint-disable-next-line no-underscore-dangle
    return child.props.__TYPE === 'HeaderItem';
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
              {headerItems}
            </SideMenu>
          )}
          {(tablet || desktop) && (
            <section className='navigation-desktop pt-8'>
              <nav>
                <Row>{headerItems}</Row>
              </nav>
            </section>
          )}
        </Container>
      </section>
      {contents}
    </>
  );
}

GraphNavigation.propTypes = {
  children: PropTypes.node.isRequired,
  buttonLabel: PropTypes.string.isRequired,
};

export default GraphNavigation;
