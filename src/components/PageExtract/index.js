import { Icon as DSIcon, Link as DSLink } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

function PageExtract({ title, introText, link, children }) {
  return (
    <section className='page-extract px-20 mb-60 px-md-64'>
      <h3 className='marianne-extra-bold fs-28-32 fs-32-40-xl'>{title}</h3>
      <p className='fs-16-28'>{introText}</p>
      {children}
      <div className='button-link marianne-bold relative'>
        <DSIcon
          className='ds-fr--v-middle'
          size='xl'
          name='ri-arrow-right-line'
          iconPosition='right'
        >
          <DSLink as={<Link to={link.href} />}>{link.label}</DSLink>
        </DSIcon>
      </div>
    </section>
  );
}

PageExtract.propTypes = {
  title: PropTypes.string.isRequired,
  introText: PropTypes.string.isRequired,
  link: PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.element.isRequired,
};
export default PageExtract;
