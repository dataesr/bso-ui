import './style.scss';

import { SearchableSelect as SearchableSelectDSFR } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const SearchableSelect = ({ label, onChange, options, selected }) => {
  const selectId = uuidv4();
  return (
    <div className='searchable-select'>
      <label htmlFor={selectId}>
        <div className='searchable-select-label'>{label}</div>
        <SearchableSelectDSFR
          onChange={onChange}
          options={options}
          selected={selected}
        />
      </label>
    </div>
  );
};

SearchableSelect.defaultProps = {
  selected: '',
};

SearchableSelect.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
  ).isRequired,
  selected: PropTypes.string,
};

export default SearchableSelect;
