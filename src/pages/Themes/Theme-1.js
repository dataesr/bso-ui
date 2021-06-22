import { Col, Container, Row } from '@dataesr/react-dsfr';
import React from 'react';

import BannerImage from '../../components/BannerImage/BannerImage';
import image from '../../images/img.png';

function Theme1() {
  return (
    <Container role='main' className='bso-sub-theme relative' fluid>
      <BannerImage
        image={image}
        altImage='masques chirurgicaux'
        supTitle='Thème 1'
        title='Toutouyoutou'
        subTitle='Lorem dolor about this theme'
      />
      <Row>
        <Col>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </Col>
      </Row>
    </Container>
  );
}

export default Theme1;
