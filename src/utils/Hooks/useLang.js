import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';

export const LangContext = createContext();

export const LangContextProvider = ({ supportedLanguages, children }) => {
  const locale = supportedLanguages.includes(
    navigator.language.split(/[-_]/)[0],
  )
    ? navigator.language.split(/[-_]/)[0]
    : 'en';
  const selectedLang = localStorage.getItem('__bso_lang__');
  const [lang, setLang] = useState(selectedLang || locale);

  const switchLang = (newLang) => {
    if (supportedLanguages.includes(newLang)) {
      localStorage.setItem('__bso_lang__', newLang);
      setLang(newLang);
    }
  };

  return (
    <LangContext.Provider value={{ lang, switchLang }}>
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
