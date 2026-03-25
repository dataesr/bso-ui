/* eslint-disable react/require-default-props */
import './style.scss';

import {
  Alert,
  Container,
  SearchableSelect as SearchableSelectDSFR,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

function SearchableSelect({
  isDisplayed = null,
  label,
  onChange,
  options,
  selected = '',
}) {
  const intl = useIntl();
  const selectId = uuidv4();
  return (
    (isDisplayed || isDisplayed == null) && (
      <Container>
        {isDisplayed && (
          <Alert
            description={intl.formatMessage({
              id: 'app.commons.select-warning',
            })}
            title=''
          />
        )}
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
      </Container>
    )
  );
}

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
