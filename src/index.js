import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import LANGUAGES from './config/supported-languages';
import { GlobalsContextProvider } from './utils/Hooks/useGetGlobals';
import { LangContextProvider } from './utils/Hooks/useLang';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <LangContextProvider supportedLanguages={LANGUAGES}>
    <GlobalsContextProvider>
      <App />
    </GlobalsContextProvider>
  </LangContextProvider>,
);
