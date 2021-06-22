import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

function BannerImage({ subTitle, supTitle, title, image, altImage }) {
  return (
    <Row
      justifyContent='center'
      alignItems='middle'
      className='bso-banner-image'
    >
      <Col n='10'>
        <div className='white-overlay' />
        <section className='wrap-titles relative'>
          <small className='sup-title marianne'>{supTitle}</small>
          <h2 className='main-title marianne-extra-bold'>{title}</h2>
          <h3 className='sub-title marianne'>{subTitle}</h3>
        </section>
        <div className='wrap-image'>
          <img src={image} alt={altImage} />
        </div>
      </Col>
    </Row>
  );
}

BannerImage.defaultProps = {
  supTitle: '',
  subTitle: '',
};

BannerImage.propTypes = {
  supTitle: PropTypes.string,
  image: PropTypes.string.isRequired,
  altImage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
};
export default BannerImage;
