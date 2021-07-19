import { Title } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

const GraphTitle = ({ title }) => (
  <span style={{ color: 'var(--blue-dark-125)' }}>
    <Title as='h3' look='h6'>
      {title}
    </Title>
  </span>
);

export default GraphTitle;

GraphTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
