import PropTypes from 'prop-types';
import React, { createContext, useContext, useState } from 'react';

const GraphNavigationContext = createContext();

export const GraphNavigationContextProvider = ({ children }) => {
  const [openedTab, setOpenedTab] = useState('');
  const openTab = (t) => setOpenedTab(t);

  return (
    <GraphNavigationContext.Provider value={{ openTab, openedTab }}>
      {children}
    </GraphNavigationContext.Provider>
  );
};

const useGraphNavigation = () => useContext(GraphNavigationContext);

GraphNavigationContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default useGraphNavigation;
