import PropTypes from 'prop-types';
import React from 'react';

import { getCSSColour, setCSSColour } from '../../utils/helpers';

function Banner({ backgroundColor, subTitle, supTitle, title, link, chip }) {
  setCSSColour('--bannerBackgroundColor', getCSSColour(backgroundColor));

  return (
    <section className='banner'>
      <small className='sup-title'>{supTitle}</small>
      <h2 className='title'>{title}</h2>
      <h3 className='sub-title'>{subTitle}</h3>
    </section>
  );
}

Banner.propTypes = {
  backgroundColor: PropTypes.string,
  supTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  link: PropTypes.exact({
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  chip: PropTypes.exact({
    label: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
  }),
};
export default Banner;
