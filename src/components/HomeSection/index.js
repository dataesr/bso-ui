import {
  Col,
  Container,
  Icon as DSIcon,
  Link as DSLink,
  Row,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

function HomeSection({
  title,
  introText,
  link,
  children,
  isDisplayed,
  hasBeta,
}) {
  if (isDisplayed || isDisplayed == null) {
    return (
      <section className='home-section'>
        <Container fluid>
          <Row>
            <Col n='12 lg-12 xl-12'>
              <h3 className='marianne-extra-bold fs-28-32 fs-32-40-xl'>
                {title}
                {hasBeta && <span> </span>}
                {hasBeta && (
                  <span className='beta-title'>
                    <FormattedMessage id='app.beta' />
                  </span>
                )}
              </h3>
              <p className='fs-16-28'>{introText}</p>
              {children}
              <Col n='12'>
                <div className='button-link'>
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

HomeSection.defaultProps = {
  hasBeta: false,
  isDisplayed: null,
};

HomeSection.propTypes = {
  children: PropTypes.element.isRequired,
  hasBeta: PropTypes.bool,
  introText: PropTypes.element.isRequired,
  isDisplayed: PropTypes.bool,
  link: PropTypes.shape({
    label: PropTypes.element.isRequired,
    href: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.element.isRequired,
};
export default HomeSection;
