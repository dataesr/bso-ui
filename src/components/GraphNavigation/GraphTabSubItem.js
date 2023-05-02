import { Icon } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import useGraphNavigation from '../../utils/Hooks/useGraphNavigation';

function GraphTabSubItem({ label, activeTab, children }) {
  const { openedTab, openTab } = useGraphNavigation();
  const open = openedTab === label;

  return (
    <section className='tab marianne-light relative'>
      <button
        className={classNames('tab-button color-white', {
          active: open,
          'marianne-bold activeTab': activeTab,
        })}
        type='button'
        onClick={() => openTab(openedTab === label ? '' : label)}
      >
        <Icon
          name={open ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}
          size='1x'
          iconPosition='right'
        >
          <span className={classNames({ 'marianne-bold': open })}>{label}</span>
        </Icon>
      </button>
      <ul className={classNames('tab-links color-white', { hidden: !open })}>
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
