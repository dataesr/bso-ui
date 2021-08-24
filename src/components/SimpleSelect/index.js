import './style.scss';

import PropTypes from 'prop-types';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const SimpleSelect = ({
  label,
  onChange,
  options,
  selected,
  firstValue,
  firstLabel,
}) => {
  const selectId = uuidv4();
  return (
    <div className='simple-select'>
      <label htmlFor={selectId}>
        {label}
        <select
          name='select'
          id={selectId}
          onChange={onChange}
          value={selected}
        >
          <option value={firstValue}>{firstLabel}</option>
          {options.map((el) => (
            <option key={uuidv4()} value={el}>
              {el}
            </option>
          ))}
        </select>
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
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string,
  firstValue: PropTypes.string.isRequired,
  firstLabel: PropTypes.string.isRequired,
};

export default SimpleSelect;
