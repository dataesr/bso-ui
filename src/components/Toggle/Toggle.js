import './style.css';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import dataAttributes from '../../utils/dataAttributes';
import useLang from '../../utils/Hooks/useLang';

/**
 *
 * @visibleName Toggle
 */
const Toggle = ({
  className,
  hasSeparator,
  hasLabelLeft,
  label,
  id,
  toggleColor,
  onChange,
  checked,
  description,
  ...remainingProps
}) => {
  // eslint-disable-next-line no-underscore-dangle
  const _id = useRef(id || uuidv4());

  // eslint-disable-next-line no-underscore-dangle
  const _className = classNames(
    'fr-toggle',
    {
      'fr-toggle--border-bottom': hasSeparator,
      'fr-toggle--label-left': hasLabelLeft,
      'ds-fr-toggle': toggleColor && !remainingProps.disabled,
    },
    className,
  );

  const { lang } = useLang();

  useEffect(() => {
    _id.current = id || uuidv4();
  }, [id]);

  useEffect(() => {
    if (toggleColor) {
      document.documentElement.style.setProperty('--toggle-color', toggleColor);
    }
  }, [toggleColor]);

  return (
    <div className={_className} {...dataAttributes.getAll(remainingProps)}>
      <input
        defaultChecked={checked}
        onChange={onChange}
        type='checkbox'
        className='fr-toggle__input'
        id={_id.current}
      />
      <label
        className='fr-toggle__label'
        htmlFor={_id.current}
        data-fr-checked-label={lang === 'ja' ? '有効' : 'Enabled'}
        data-fr-unchecked-label={lang === 'ja' ? '無効' : 'Disabled'}
      >
        {label}
      </label>
      {description && <p className='fr-hint-text'>{description}</p>}
    </div>
  );
};

Toggle.defaultProps = {
  id: '',
  toggleColor: '',
  className: '',
  hasSeparator: false,
  checked: false,
  hasLabelLeft: false,
  description: '',
  onChange: undefined,
};

Toggle.propTypes = {
  onChange: PropTypes.func,
  id: PropTypes.string,
  className: PropTypes.string,
  hasSeparator: PropTypes.bool,
  checked: PropTypes.bool,
  hasLabelLeft: PropTypes.bool,
  description: PropTypes.string,
  label: PropTypes.string.isRequired,
  toggleColor: PropTypes.string,
};

export default Toggle;
