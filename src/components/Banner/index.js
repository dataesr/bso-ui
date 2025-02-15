import {
  Col,
  Container,
  Icon as DSIcon,
  Link as DSLink,
  Row,
} from '@dataesr/react-dsfr';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getCSSValue, setCSSProperty } from '../../utils/helpers';
import useScroll from '../../utils/Hooks/useScroll';
import SelectNavigation from './SelectNavigation';

function Banner({
  isHome,
  backgroundColor,
  children,
  chip,
  homeLink,
  icons,
  link,
  selectNavigation,
  sticky,
  subsubTitle,
  subTitle,
  supTitle,
  textColor,
  title,
}) {
  const [navSelected, setNavSelected] = useState(
    selectNavigation ? selectNavigation.selected : '',
  );
  const [sticked, setSticked] = useState(false);
  const { scrollTop, scrollingDown } = useScroll();
  const navigate = useNavigate();
  const { trackEvent } = useMatomo();

  setCSSProperty(
    '--bannerBackgroundColor',
    getCSSValue(`--${backgroundColor}`) || backgroundColor,
  );
  setCSSProperty(
    '--bannerTextColor',
    getCSSValue(`--${textColor}`) || textColor,
  );

  useEffect(() => {
    if (sticky) {
      // TODO use useRef
      const banner = document.querySelector('.bso-banner');
      const heightBanner = banner.getBoundingClientRect().height;

      if (scrollTop > banner.offsetTop + heightBanner + 1 && scrollingDown) {
        setSticked(true);
        // For Glossary button
        document.querySelector('html').classList.add('banner-sticked');
      } else if (scrollTop < banner.offsetTop - 1 && !scrollingDown) {
        // For Glossary button
        document.querySelector('html').classList.remove('banner-sticked');
        setSticked(false);
      }
    }
  }, [scrollTop, scrollingDown, sticky]);

  const onNavigationChange = (e) => {
    setNavSelected(e.target.value);

    trackEvent({
      action: 'change-to-search-object',
      category: 'navigation',
      name: `go_to_${e.target.value}`,
    });

    navigate(e.target.value);
  };

  return (
    <section
      className={classNames(
        `josm-banner bso-banner z-200 text-left-l text-center ${
          isHome && 'is-home'
        }`,
        {
          // 'mb-60': !selectNavigation,
          // 'mb-100': selectNavigation,
          sticky: sticky && sticked,
        },
      )}
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
              'md-7': chip && !sticked,
            })}
            className={sticked && 'josm-banner__title-container'}
          >
            {sticked ? (
              <>
                {isHome ? (
                  <h2 className='main-title marianne-extra-bold'>{title}</h2>
                ) : (
                  <>
                    <h2 className='main-title marianne-extra-bold'>{title}</h2>
                    <span className='divider' />
                    {homeLink ? (
                      <DSLink as={<Link to={homeLink} />} className='home'>
                        <small className='sup-title'>{supTitle}</small>
                      </DSLink>
                    ) : (
                      <small className='sup-title'>{supTitle}</small>
                    )}
                  </>
                )}
              </>
            ) : (
              !isHome && <h2 className='main-title'>{title}</h2>
            )}
            {subTitle && (
              <h3
                className={classNames('sub-title pt-16 ', {
                  'mb-l-60': selectNavigation,
                })}
              >
                {subTitle}
              </h3>
            )}
            {/* {subsubTitle && (
              <h4
                className={classNames('sub-sub-title pt-16 ', {
                  'mb-l-60': selectNavigation,
                })}
              >
                {subsubTitle}
              </h4>
            )} */}
          </Col>
          {/* {selectNavigation && sticked && (
            <Col
              className='relative'
              n={classNames('12', { 'md-4': sticked, 'md-3': !sticked })}
            >
              <SelectNavigation
                backgroundClass={
                  backgroundColor === 'blue-soft-150'
                    ? 'soft-background'
                    : 'dark-background'
                }
                onChange={(e) => onNavigationChange(e)}
                options={selectNavigation.options}
                selected={navSelected}
                sticked={sticked}
                title={selectNavigation.title}
              />
            </Col>
          )} */}
          {children && <Col n='12'>{children}</Col>}
          {!sticked && chip && (
            <Col n='12 md-5'>
              <div
                className={classNames({
                  // 'mb-60 mb-l-0': selectNavigation,
                  'bso-chip-wrapper': true,
                })}
              >
                {chip}
              </div>
            </Col>
          )}
        </Row>
        {/* {selectNavigation && !sticked && (
          <Row>
            <Col n='12 md-5' className='relative'>
              <SelectNavigation
                backgroundClass={
                  backgroundColor === 'blue-soft-150'
                    ? 'soft-background'
                    : 'dark-background'
                }
                onChange={(e) => onNavigationChange(e)}
                options={selectNavigation.options}
                selected={navSelected}
                sticked={sticked}
                title={selectNavigation.title}
              />
            </Col>
          </Row>
        )} */}
      </Container>
    </section>
  );
}

Banner.defaultProps = {
  isHome: false,
  children: null,
  chip: null,
  homeLink: '',
  icons: null,
  link: null,
  selectNavigation: null,
  sticky: true,
  subsubTitle: null,
  subTitle: null,
  supTitle: null,
  textColor: '#fff',
};

Banner.propTypes = {
  isHome: PropTypes.bool,
  backgroundColor: PropTypes.string.isRequired,
  children: PropTypes.node,
  chip: PropTypes.element,
  homeLink: PropTypes.string,
  icons: PropTypes.element,
  link: PropTypes.exact({
    label: PropTypes.element.isRequired,
    url: PropTypes.string.isRequired,
  }),
  selectNavigation: PropTypes.exact({
    options: PropTypes.arrayOf(
      PropTypes.exact({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ).isRequired,
    selected: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
      .isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
  }),
  sticky: PropTypes.bool,
  subsubTitle: PropTypes.element,
  subTitle: PropTypes.element,
  supTitle: PropTypes.element,
  textColor: PropTypes.string,
  title: PropTypes.element.isRequired,
};
export default Banner;
