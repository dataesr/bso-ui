import { Container, Row, SideMenu } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {
  Children,
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import useScroll from '../../utils/Hooks/useScroll';
import useViewport from '../../utils/Hooks/useViewport';

function GraphSection({ buttonLabel, children }) {
  const [sticky, setSticky] = useState(false);
  const [offsetTop, setOffsetTop] = useState(null);
  const [initOffsetTop, setInitOffsetTop] = useState(null);
  const [bannerHeight, setBannerHeight] = useState(0);

  const { scrollTop, scrollingDown } = useScroll();
  const { mobile, tablet, desktop } = useViewport();
  const ref = useRef(null);
  const [contents, setContents] = useState([]);
  const [headerItems, setHeaderItems] = useState(null);

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

  const handleScroll = useCallback(() => {
    if (scrollTop > offsetTop - bannerHeight && scrollingDown) {
      setSticky(true);
    } else if (scrollTop < initOffsetTop && !scrollingDown) {
      setSticky(false);
    }
  }, [
    scrollTop,
    setSticky,
    initOffsetTop,
    scrollingDown,
    offsetTop,
    bannerHeight,
  ]);

  useEffect(() => {
    if (ref.current.offsetTop !== offsetTop) {
      setOffsetTop(ref.current.offsetTop);
    }
    handleScroll();
  }, [offsetTop, handleScroll]);

  useEffect(
    () => () => {
      const content = [];
      const headers = [];
      if (!headerItems && contents.length === 0) {
        for (let i = 0; i < Children.toArray(children).length; i += 1) {
          const section = Children.toArray(children)[i];
          // eslint-disable-next-line no-underscore-dangle
          if (section.props.__TYPE === 'GraphItem') {
            headers.push(section);
          }

          content.push(
            cloneElement(section.props.children, {
              ...section.props.children.props,
              key: uuidv4(),
              paths: section.props.paths,
            }),
          );
        }
        setHeaderItems(headers);
        setContents(content);
      }
    },
    [children, setContents, contents, headerItems, setHeaderItems],
  );
  return (
    <>
      <section
        ref={ref}
        style={{ top: sticky ? bannerHeight - 1 : 0 }}
        className={classNames('bso-tab-navigation relative z-100 w-100', {
          sticky,
          mobile,
        })}
      >
        <Container>
          {mobile && (
            <SideMenu
              title=''
              className='navigation-mobile'
              buttonLabel={
                <FormattedMessage id={buttonLabel} defaultMessage='General' />
              }
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

GraphSection.propTypes = {
  children: PropTypes.node.isRequired,
  buttonLabel: PropTypes.string.isRequired,
};

export default GraphSection;
