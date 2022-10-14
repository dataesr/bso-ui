import { Card, CardDescription, Link as DSLink } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

function CardLogo({ img, alt, href }) {
  return (
    <Card
      bodyClassName='bso-link-card bg-white'
      hasArrow={false}
      hasBorder={false}
      href={href}
    >
      <CardDescription as='div' className='m-auto'>
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
};

export default CardLogo;
