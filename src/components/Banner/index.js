import { Button, Col, Container, Row } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { getCSSColour, setCSSColour } from '../../utils/helpers';
import useScroll from '../../utils/Hooks/useScroll';

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
}) {
  setCSSColour(
    '--bannerBackgroundColor',
    getCSSColour(`--${backgroundColor}`) || backgroundColor,
  );
  setCSSColour(
    '--bannerTextColor',
    getCSSColour(`--${textColor}`) || textColor,
  );

  const [sticked, setSticked] = useState(false);
  const { scrollTop, scrollingDown } = useScroll();

  useEffect(() => {
    if (sticky) {
      const banner = document.querySelector('.banner');
      const heightBanner = banner.getBoundingClientRect().height;

      if (scrollTop > banner.offsetTop + heightBanner && scrollingDown) {
        setSticked(true);
      } else if (scrollTop < banner.offsetTop && !scrollingDown) {
        setSticked(false);
      }
    }
  }, [scrollTop, scrollingDown, sticky]);

  return (
    <section
      className={classNames('banner text-center text-left-m', {
        sticky: sticky && sticked,
      })}
    >
      <Container>
        <Row justifyContent='center' alignItems='middle' gutters>
          <Col n='12 sm-9'>
            <small className='sup-title'>{supTitle}</small>
            <h2 className='title marianne-extra-bold'>{title}</h2>
            <section className='icons'>{icons || ''}</section>
            <h3 className='sub-title pt-16'>{subTitle}</h3>
            {link && (
              <Button
                icon='ri-arrow-right-line'
                iconPosition='right'
                size='md'
                title='title'
              >
                {link.label}
              </Button>
            )}
          </Col>
          {!sticked && chip && <Col n='sm-3'>{chip}</Col>}
        </Row>
      </Container>
    </section>
  );
}

Banner.defaultProps = {
  textColor: '#fff',
  supTitle: '',
  subTitle: '',
  link: null,
  chip: null,
  icons: null,
  sticky: true,
};

Banner.propTypes = {
  sticky: PropTypes.bool,
  backgroundColor: PropTypes.string.isRequired,
  textColor: PropTypes.string,
  supTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  icons: PropTypes.element,
  subTitle: PropTypes.string,
  link: PropTypes.exact({
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  chip: PropTypes.exact({
    title: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
  }),
};
export default Banner;
