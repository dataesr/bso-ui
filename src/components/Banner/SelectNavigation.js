import { Select } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

function SelectNavigation({ title, onChange, selected, options, sticked }) {
  return (
    <section
      className={classNames('bso-select-navigation', {
        'p-16': !sticked,
        'p-8': sticked,
      })}
    >
      <div className='text-left title marianne-bold pb-16'>{title}</div>
      <div className={classNames({ 'pt-16': !sticked })}>
        <Select
          selected={selected}
          onChange={(e) => onChange(e)}
          options={options}
        />
      </div>
    </section>
  );
}

SelectNavigation.defaultProps = {
  sticked: false,
};

SelectNavigation.propTypes = {
  title: PropTypes.string.isRequired,
  sticked: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.exact({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SelectNavigation;
