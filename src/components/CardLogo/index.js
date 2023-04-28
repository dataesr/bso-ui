import './style.scss';

import { Card, CardDescription, Link as DSLink } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

function CardLogo({ img, alt, href, noMargin }) {
  let className = 'm-auto w-100';
  if (noMargin !== undefined) {
    className = 'w-100';
  }
  return (
    <Card
      bodyClassName='bso-link-card-logo bso-link-card bg-white'
      hasArrow={false}
      hasBorder={false}
      href={href}
    >
      <CardDescription as='div' className={className}>
        <DSLink href={href} target='_blank'>
          <img
            src={img}
            alt={alt}
            className='flex img-fluid w-100 ds-fr--v-middle'
          />
        </DSLink>
      </CardDescription>
    </Card>
  );
}

CardLogo.propTypes = {
  img: PropTypes.element.isRequired,
  href: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  noMargin: PropTypes.bool.isRequired,
};

export default CardLogo;
