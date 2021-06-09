import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const storedTheme = localStorage.getItem('__bso_theme__') || 'light';
  const [theme, setTheme] = useState(storedTheme);
  document.documentElement.setAttribute('data-fr-theme', storedTheme);

  const switchTheme = (newTheme) => {
    localStorage.setItem('__bso_theme__', newTheme);
    setTheme(newTheme);
    document.documentElement.setAttribute('data-fr-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
ThemeContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useTheme = () => useContext(ThemeContext);
export default useTheme;
