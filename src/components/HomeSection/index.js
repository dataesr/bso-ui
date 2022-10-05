import {
  Col,
  Container,
  Icon as DSIcon,
  Link as DSLink,
  Row,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

function HomeSection({ title, introText, link, children, isDisplayed }) {
  if (isDisplayed || isDisplayed == null) {
    return (
      <section className='home-section px-20 mb-60 px-md-64'>
        <Container fluid>
          <Row>
            <Col n='12 lg-12 xl-10'>
              <h3 className='marianne-extra-bold fs-28-32 fs-32-40-xl'>
                {title}
              </h3>
              <p className='fs-16-28'>{introText}</p>
              {children}
              <Col offset='2 md-4'>
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
              </Col>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }
}

HomeSection.propTypes = {
  title: PropTypes.element.isRequired,
  introText: PropTypes.element.isRequired,
  link: PropTypes.shape({
    label: PropTypes.element.isRequired,
    href: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.element.isRequired,
  isDisplayed: PropTypes.element.isRequired,
};
export default HomeSection;
