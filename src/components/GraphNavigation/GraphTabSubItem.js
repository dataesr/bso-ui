import { Icon } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

function GraphTabSubItem({ label, activeTab, children }) {
  const [open, setOpen] = useState(false);

  return (
    <section className='tab marianne-light relative'>
      <button
        className={classNames('tab-button text-white', {
          active: open,
          'marianne-bold activeTab': activeTab,
        })}
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
      <ul className={classNames('tab-links text-white', { hidden: !open })}>
        {children}
      </ul>
    </section>
  );
}

GraphTabSubItem.propTypes = {
  label: PropTypes.string.isRequired,
  activeTab: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default GraphTabSubItem;
