import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';

import urls from '../../config/urls';

export const LangContext = createContext();

export const LangContextProvider = ({ supportedLanguages, children }) => {
  const locale = 'fr';
  const selectedLang = sessionStorage.getItem('__bso_lang__');
  const [lang, setLang] = useState(selectedLang || locale);

  const switchLang = (newLang, pathname, search) => {
    if (supportedLanguages.includes(newLang) && newLang !== lang) {
      let url = '';
      for (let i = 0; i < Object.keys(urls).length; i += 1) {
        const key = Object.keys(urls)[i];

        if (urls[key].tabs) {
          for (let j = 0; j < urls[key].tabs.length; j += 1) {
            if (urls[key].tabs[j][lang] === pathname) {
              url = urls[key].tabs[j][newLang] + search;
            }
          }
        }
        if (urls[key][lang] === pathname) {
          url = urls[key][newLang] + search;
        }
      }

      sessionStorage.setItem('__bso_lang__', newLang);

      setLang(newLang);

      if (url) {
        window.location.replace(url);
      }
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
