import { Icon } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

function Tab({ label, links }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
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
            <span className={classNames({ 'marianne-bold': open })}>
              {label}
            </span>
          </Icon>
        </button>
        <ul className={classNames('tab-links txt-white', { hidden: !open })}>
          {links.map((link) => (
            <li>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
};
export default Tab;
