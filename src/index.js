import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import LANGUAGES from './config/supported-languages';
import { GlobalsContextProvider } from './utils/Hooks/useGetGlobals';
import { LangContextProvider } from './utils/Hooks/useLang';

ReactDOM.render(
  <LangContextProvider supportedLanguages={LANGUAGES}>
    <GlobalsContextProvider>
      <App />
    </GlobalsContextProvider>
  </LangContextProvider>,
  document.getElementById('root'),
);
