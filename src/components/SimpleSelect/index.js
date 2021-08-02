import './style.scss';

import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

const SimpleSelect = ({ label, onChange, options, selected }) => {
  const intl = useIntl();
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
          <option value=''>
            {intl.formatMessage({ id: 'app.all-agencies' })}
          </option>
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

SimpleSelect.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.string.isRequired,
  options: PropTypes.element.isRequired,
  selected: PropTypes.string.isRequired,
};

export default SimpleSelect;
