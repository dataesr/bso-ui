import { Icon } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

function Tab({ label, children }) {
  const [open, setOpen] = useState(false);

  return (
    <section className='tab marianne-light relative'>
      <button
        className={classNames('tab-button txt-white', { active: open })}
        type='button'
        onClick={() => setOpen(!open)}
      >
        <Icon
          name={open ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}
          size='1x'
          iconPosition='right'
        >
          <span className={classNames({ 'marianne-bold': open })}>{label}</span>
        </Icon>
      </button>
      <ul className={classNames('tab-links txt-white', { hidden: !open })}>
        {children}
      </ul>
    </section>
  );
}

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};
export default Tab;
