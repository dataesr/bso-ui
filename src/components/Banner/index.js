import { Button, Col, Container, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

import { getCSSColour, setCSSColour } from '../../utils/helpers';

function Banner({
  backgroundColor,
  textColor,
  subTitle,
  supTitle,
  title,
  link,
  chip,
  icons,
}) {
  setCSSColour(
    '--bannerBackgroundColor',
    getCSSColour(`--${backgroundColor}`) || backgroundColor
  );
  setCSSColour(
    '--bannerTextColor',
    getCSSColour(`--${textColor}`) || textColor
  );

  return (
    <section className='banner text-center text-left-m'>
      <Container>
        <Row justifyContent='center' alignItems='middle' gutters>
          <Col n='12 sm-9'>
            <small className='sup-title'>{supTitle}</small>
            <h2 className='title marianne-extra-bold'>{title}</h2>
            {icons || ''}
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
          {chip && <Col n='sm-3'>{chip}</Col>}
        </Row>
      </Container>
    </section>
  );
}

Banner.defaultProps = {
  textColor: '#fff',
};

Banner.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  textColor: PropTypes.string,
  supTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
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
