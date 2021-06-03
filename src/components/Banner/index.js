import { Button, Col, Container, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

import { getCSSColour, setCSSColour } from '../../utils/helpers';
import Chip from '../UI/Chip';

function Banner({ backgroundColor, subTitle, supTitle, title, link, chip }) {
  setCSSColour('--bannerBackgroundColor', getCSSColour(backgroundColor));

  return (
    <section className='banner'>
      <Container>
        <Row justifyContent='center' alignItems='middle' gutters>
          <Col n='12 sm-9'>
            <small className='sup-title'>{supTitle}</small>
            <h2 className='title'>{title}</h2>
            <h3 className='sub-title'>{subTitle}</h3>
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
          <Col n='sm-3'>
            <Chip title={chip.title} backgroundColor={chip.backgroundColor} />
          </Col>
        </Row>
      </Container>
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
    title: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
  }),
};
export default Banner;
