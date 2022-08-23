import { Select } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

function SelectNavigation({
  backgroundClass,
  onChange,
  options,
  selected,
  sticked,
  title,
}) {
  return (
    <section
      className={classNames('bso-select-navigation', backgroundClass, {
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
  backgroundClass: '',
  sticked: false,
};

SelectNavigation.propTypes = {
  backgroundClass: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.exact({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selected: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  sticked: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
};

export default SelectNavigation;
