import './style/main.scss';

import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import WebTracking from './components/WebTracking';
import PageTracker from './components/WebTracking/PageTracker';
import FAQ from './pages/APropos/FAQ';
import Glossaire from './pages/APropos/Glossaire';
import Methodologie from './pages/APropos/Methodologie';
import NotesFlash from './pages/APropos/NotesFlash';
import BaroNational from './pages/BaroNational';
import NationalPublications from './pages/BaroNational/NationalPublications';
import BaroSante from './pages/BaroSante';
import EssaisCliniques from './pages/BaroSante/EssaisCliniques';
import Etudes from './pages/BaroSante/Etudes';
import SantePublications from './pages/BaroSante/SantePublications';
import Integration from './pages/Integration';
import messagesEN from './translations/en.json';
import messagesFR from './translations/fr.json';
import TranslationPage from './translations/translations-page';
import { GraphNavigationContextProvider } from './utils/Hooks/useGraphNavigation';
import useLang from './utils/Hooks/useLang';

const messages = {
  fr: messagesFR,
  en: messagesEN,
};

function App() {
  const { lang, urls } = useLang();

  return (
    <Router>
      <IntlProvider locale={lang} messages={messages[lang]}>
        <WebTracking>
          <Header />
          <Switch>
            <Route path='/translations'>
              <TranslationPage />
            </Route>
            <Route
              exact
              path={Object.keys(urls.national).map((l) => urls.national[l])}
            >
              <PageTracker>
                <BaroNational />
              </PageTracker>
            </Route>
            <Route
              exact
              path={urls.nationalPublications.tabs
                .map((tab) => Object.keys(tab).map((l) => tab[l]))
                .flat(1)}
            >
              <PageTracker>
                <GraphNavigationContextProvider>
                  <NationalPublications />
                </GraphNavigationContextProvider>
              </PageTracker>
            </Route>
            <Route
              exact
              path={Object.keys(urls.sante).map((l) => urls.sante[l])}
            >
              <PageTracker>
                <BaroSante />
              </PageTracker>
            </Route>
            <Route
              exact
              path={urls.santePublications.tabs
                .map((tab) => Object.keys(tab).map((l) => tab[l]))
                .flat(1)}
            >
              <PageTracker>
                <GraphNavigationContextProvider>
                  <SantePublications />
                </GraphNavigationContextProvider>
              </PageTracker>
            </Route>
            <Route
              exact
              path={urls.santeEssais.tabs
                .map((tab) => Object.keys(tab).map((l) => tab[l]))
                .flat(1)}
            >
              <GraphNavigationContextProvider>
                <EssaisCliniques />
              </GraphNavigationContextProvider>
            </Route>

            <Route
              exact
              path={urls.santeEtudes.tabs
                .map((tab) => Object.keys(tab).map((l) => tab[l]))
                .flat(1)}
            >
              <GraphNavigationContextProvider>
                <Etudes />
              </GraphNavigationContextProvider>
            </Route>
            <Route
              exact
              path={Object.keys(urls.methodologie).map(
                (l) => urls.methodologie[l],
              )}
            >
              <Methodologie />
            </Route>
            <Route exact path={Object.keys(urls.faq).map((l) => urls.faq[l])}>
              <FAQ />
            </Route>
            <Route
              exact
              path={Object.keys(urls.glossaire).map((l) => urls.glossaire[l])}
            >
              <Glossaire />
            </Route>
            <Route
              exact
              path={Object.keys(urls.flash).map((l) => urls.flash[l])}
            >
              <NotesFlash />
            </Route>
            <Route
              path={Object.keys(urls.integration).map(
                (l) => urls.integration[l],
              )}
            >
              <Integration />
            </Route>
            <Route exact path='*'>
              <div>Not Found</div>
            </Route>
          </Switch>
          <Footer />
        </WebTracking>
      </IntlProvider>
    </Router>
  );
}

export default App;
