import './style.scss';

import { SearchableSelect as SearchableSelectDSFR } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

function SearchableSelect({ isDisplayed, label, onChange, options, selected }) {
  const selectId = uuidv4();
  return (
    (isDisplayed || isDisplayed == null) && (
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
    )
  );
}

SearchableSelect.defaultProps = {
  isDisplayed: null,
  selected: '',
};

SearchableSelect.propTypes = {
  isDisplayed: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
  ).isRequired,
  selected: PropTypes.string,
};

export default SearchableSelect;
