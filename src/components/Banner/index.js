import { Col, Container, Link as DSLink, Row } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { getCSSProperty, setCSSProperty } from '../../utils/helpers';
import useScroll from '../../utils/Hooks/useScroll';
import SelectNavigation from './SelectNavigation';

function Banner({
  backgroundColor,
  textColor,
  subTitle,
  supTitle,
  title,
  link,
  chip,
  icons,
  sticky,
  selectNavigation,
  children,
  homeLink,
}) {
  const [navSelected, setNavSelected] = useState(
    selectNavigation ? selectNavigation.selected : '',
  );
  const [sticked, setSticked] = useState(false);
  const { scrollTop, scrollingDown } = useScroll();
  const history = useHistory();

  setCSSProperty(
    '--bannerBackgroundColor',
    getCSSProperty(`--${backgroundColor}`) || backgroundColor,
  );
  setCSSProperty(
    '--bannerTextColor',
    getCSSProperty(`--${textColor}`) || textColor,
  );

  useEffect(() => {
    if (sticky) {
      // TODO use useRef
      const banner = document.querySelector('.bso-banner');
      const heightBanner = banner.getBoundingClientRect().height;

      if (scrollTop > banner.offsetTop + heightBanner && scrollingDown) {
        setSticked(true);
        // For Glossaire button
        document.querySelector('html').classList.add('banner-sticked');
      } else if (scrollTop < banner.offsetTop && !scrollingDown) {
        // For Glossaire button
        document.querySelector('html').classList.remove('banner-sticked');
        setSticked(false);
      }
    }
  }, [scrollTop, scrollingDown, sticky]);

  const onNavigationChange = (e) => {
    setNavSelected(e.target.value);
    history.push(e.target.value);
  };

  return (
    <section
      className={classNames('bso-banner z-200 text-left-l text-center mb-60', {
        sticky: sticky && sticked,
        'mb-100': selectNavigation,
      })}
    >
      <Container>
        <Row
          justifyContent={!sticked ? 'center' : 'left'}
          alignItems='middle'
          gutters={!sticked}
        >
          <Col
            n={classNames('12', {
              'md-6': chip && sticked,
              'md-9': chip && !sticked,
            })}
          >
            <small className='sup-title'>{supTitle}</small>
            <h2 className='main-title marianne-extra-bold'>
              {selectNavigation && sticked ? (
                <>
                  <Link to={homeLink} className='home'>
                    <i className='ri-home-2-line' />
                  </Link>
                  /&nbsp;
                </>
              ) : null}
              {title}
            </h2>
            <section className='icons'>{icons || ''}</section>
            {subTitle && (
              <h3
                className={classNames('sub-title pt-16 ', {
                  'mb-l-60': selectNavigation,
                })}
              >
                {subTitle}
              </h3>
            )}
            {link && (
              <DSLink
                display='middle'
                className='bso-link'
                icon='ri-arrow-right-line'
                iconSize='lg'
                as={<Link to={link.url} />}
              >
                {link.label}
              </DSLink>
            )}
          </Col>
          {selectNavigation && sticked && (
            <Col
              n={classNames('12', { 'md-4': sticked, 'md-3': !sticked })}
              className='relative'
            >
              <SelectNavigation
                sticked={sticked}
                title={selectNavigation.title}
                options={selectNavigation.options}
                selected={navSelected}
                onChange={(e) => onNavigationChange(e)}
              />
            </Col>
          )}
          {children && <Col n='12'>{children}</Col>}
          {!sticked && chip && (
            <Col n='12 md-3'>
              <div
                className={classNames({
                  'mb-60 mb-l-0': selectNavigation,
                })}
              >
                {chip}
              </div>
            </Col>
          )}
        </Row>
        {selectNavigation && !sticked && (
          <Row>
            <Col n='12 md-5' className='relative'>
              <SelectNavigation
                sticked={sticked}
                title={selectNavigation.title}
                options={selectNavigation.options}
                selected={navSelected}
                onChange={(e) => onNavigationChange(e)}
              />
            </Col>
          </Row>
        )}
      </Container>
    </section>
  );
}

Banner.defaultProps = {
  textColor: '#fff',
  supTitle: null,
  subTitle: null,
  link: null,
  chip: null,
  icons: null,
  children: null,
  selectNavigation: null,
  sticky: true,
  homeLink: '/',
};

Banner.propTypes = {
  sticky: PropTypes.bool,
  children: PropTypes.node,
  backgroundColor: PropTypes.string.isRequired,
  textColor: PropTypes.string,
  supTitle: PropTypes.element,
  title: PropTypes.element.isRequired,
  icons: PropTypes.element,
  chip: PropTypes.element,
  selectNavigation: PropTypes.exact({
    selected: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
      .isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    options: PropTypes.arrayOf(
      PropTypes.exact({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }),
  subTitle: PropTypes.element,
  homeLink: PropTypes.string,
  link: PropTypes.exact({
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
};
export default Banner;
