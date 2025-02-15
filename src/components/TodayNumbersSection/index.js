import './style.scss';

import { Container } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

function TodayNumbersSection({ updateDate, title, children }) {
  return (
    <Container fluid className='bg-white josm-today-numbers-info'>
      <section>
        <h2 className='josm-today-numbers-info__title'>{title}</h2>
        {updateDate}
        <div className='josm-today-numbers-info__items'>{children}</div>
      </section>
    </Container>
  );
}

TodayNumbersSection.propTypes = {
  updateDate: PropTypes.element.isRequired,
  title: PropTypes.element.isRequired,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};
export default TodayNumbersSection;
