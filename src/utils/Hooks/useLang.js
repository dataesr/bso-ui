import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

import urls from '../../config/urls';
import { isInProduction } from '../helpers';

export const LangContext = createContext();

export const LangContextProvider = ({ supportedLanguages, children }) => {
  const { pathname } = useLocation();

  // Default UI lang in French
  let locale = 'en';
  // In production but not in integration aka iFrame, lang depends of the hostname
  if (isInProduction() && !pathname.startsWith('/integration')) {
    locale = window.location.hostname === 'frenchopensciencemonitor.esr.gouv.fr'
      ? 'en'
      : 'ja';
    // In other env (local and staging), lang depends of the sessionStorage
  } else {
    locale = sessionStorage.getItem('__bso_lang__');
  }
  const [lang, setLang] = useState(locale || 'en');

  const switchLang = (newLang, path, search) => {
    if (supportedLanguages.includes(newLang) && newLang !== lang) {
      let newUrl = '';
      const keysUrls = Object.keys(urls);

      for (let i = 0; i < keysUrls.length; i += 1) {
        const key = keysUrls[i];
        const tabsUrls = urls[key].tabs;

        if (tabsUrls) {
          for (let j = 0; j < tabsUrls.length; j += 1) {
            if (tabsUrls[j][lang] === path) {
              newUrl = tabsUrls[j][newLang];
            }
          }
        }

        if (urls[key][lang] === path) {
          newUrl = urls[key][newLang];
        }
      }

      sessionStorage.setItem('__bso_lang__', newLang);

      setLang(newLang);

      // if (newUrl) {
      //   if (isInProduction() && !pathname.startsWith('/integration')) {
      //     const domain = newLang === 'en'
      //       ? 'https://frenchopensciencemonitor.esr.gouv.fr'
      //       : 'https://barometredelascienceouverte.esr.gouv.fr';
      //     newUrl = domain + newUrl;
      //   }
      //   window.location.replace(newUrl + search);
      // }
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
