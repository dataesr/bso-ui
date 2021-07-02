import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';

import urls from '../../config/urls';

export const LangContext = createContext();

export const LangContextProvider = ({ supportedLanguages, children }) => {
  const locale = 'fr';
  const selectedLang = localStorage.getItem('__bso_lang__');
  const [lang, setLang] = useState(selectedLang || locale);

  const switchLang = (newLang, pathname) => {
    if (supportedLanguages.includes(newLang) && newLang !== lang) {
      const url = Object.keys(urls).find((key) => urls[key][lang] === pathname);
      localStorage.setItem('__bso_lang__', newLang);
      setLang(newLang);
      window.location.replace(urls[url][newLang]);
    }
  };

  return (
    <LangContext.Provider value={{ lang, switchLang, urls }}>
      {children}
    </LangContext.Provider>
  );
};
LangContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  supportedLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const useLang = () => useContext(LangContext);
export default useLang;
