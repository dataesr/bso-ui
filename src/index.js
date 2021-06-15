import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import LANGUAGES from './config/supported-languages';
import { GlobalsContextProvider } from './utils/Hooks/useGetGlobals';
import { LangContextProvider } from './utils/Hooks/useLang';
import { ThemeContextProvider } from './utils/Hooks/useTheme';

ReactDOM.render(
  <LangContextProvider supportedLanguages={LANGUAGES}>
    <ThemeContextProvider>
      <GlobalsContextProvider>
        <App />
      </GlobalsContextProvider>
    </ThemeContextProvider>
  </LangContextProvider>,
  document.getElementById('root'),
);
