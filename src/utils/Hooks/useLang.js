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
      let newUrl = '';
      const keysUrls = Object.keys(urls);

      for (let i = 0; i < keysUrls.length; i += 1) {
        const key = keysUrls[i];
        const tabsUrls = urls[key].tabs;

        if (tabsUrls) {
          for (let j = 0; j < tabsUrls.length; j += 1) {
            if (tabsUrls[j][lang] === pathname) {
              newUrl = tabsUrls[j][newLang];
            }
          }
        }

        if (urls[key][lang] === pathname) {
          newUrl = urls[key][newLang];
        }
      }

      sessionStorage.setItem('__bso_lang__', newLang);

      setLang(newLang);

      if (newUrl) {
        window.location.replace(newUrl + search);
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
