import './style.scss';

import { Select } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const SimpleSelect = ({ label, onChange, options, selected }) => {
  const selectId = uuidv4();
  return (
    <div className='simple-select'>
      <label htmlFor={selectId}>
        <div className='simple-select-label'>{label}</div>
        <Select onChange={onChange} options={options} selected={selected} />
      </label>
    </div>
  );
};

SimpleSelect.defaultProps = {
  selected: '',
};

SimpleSelect.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
  ).isRequired,
  selected: PropTypes.string,
};

export default SimpleSelect;
