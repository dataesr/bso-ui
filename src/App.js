import './style/main.scss';

import { IntlProvider } from 'react-intl';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import FAQ from './pages/APropos/FAQ';
import Glossaire from './pages/APropos/Glossaire';
import Methodologie from './pages/APropos/Methodologie';
import NotesFlash from './pages/APropos/NotesFlash';
import Projet from './pages/APropos/Projet';
import BaroNational from './pages/BaroNational';
import NationalPublications from './pages/BaroNational/NationalPublications';
import BaroSante from './pages/BaroSante';
import EssaisCliniques from './pages/BaroSante/EssaisCliniques';
import Etudes from './pages/BaroSante/Etudes';
import SantePublications from './pages/BaroSante/SantePublications';
import Integration from './pages/Integration';
import Themes from './pages/Themes';
import Theme1 from './pages/Themes/Theme-1';
import messagesEN from './translations/en.json';
import messagesFR from './translations/fr.json';
import TranslationPage from './translations/translations-page';
import useLang from './utils/Hooks/useLang';

const messages = {
  fr: messagesFR,
  en: messagesEN,
};

function App() {
  const { lang, urls } = useLang();
  return (
    <BrowserRouter>
      <IntlProvider locale={lang} messages={messages[lang]}>
        <Header />
        <Switch>
          <Route path='/translations'>
            <TranslationPage />
          </Route>
          <Route
            exact
            path={Object.keys(urls.national).map((l) => urls.national[l])}
          >
            <BaroNational />
          </Route>
          <Route
            exact
            path={urls.nationalPublications.tabs
              .map((tab) => Object.keys(tab).map((l) => tab[l]))
              .flat(1)}
          >
            <NationalPublications />
          </Route>
          <Route exact path={Object.keys(urls.sante).map((l) => urls.sante[l])}>
            <BaroSante />
          </Route>
          <Route
            exact
            path={urls.santePublications.tabs
              .map((tab) => Object.keys(tab).map((l) => tab[l]))
              .flat(1)}
          >
            <SantePublications />
          </Route>
          <Route
            exact
            path={urls.santeEssais.tabs
              .map((tab) => Object.keys(tab).map((l) => tab[l]))
              .flat(1)}
          >
            <EssaisCliniques />
          </Route>
          <Route
            exact
            path={Object.keys(urls.santeEtudes).map((l) => urls.santeEtudes[l])}
          >
            <Etudes />
          </Route>
          <Route
            exact
            path={Object.keys(urls.themes).map((l) => urls.themes[l])}
          >
            <Themes />
          </Route>
          <Route
            exact
            path={Object.keys(urls.themes1).map((l) => urls.themes1[l])}
          >
            <Theme1 />
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
            path={Object.keys(urls.projet).map((l) => urls.projet[l])}
          >
            <Projet />
          </Route>
          <Route exact path={Object.keys(urls.flash).map((l) => urls.flash[l])}>
            <NotesFlash />
          </Route>
          <Route
            path={Object.keys(urls.integration).map((l) => urls.integration[l])}
          >
            <Integration />
          </Route>
          <Route exact path='*'>
            <div>Not Found</div>
          </Route>
        </Switch>
        <Footer />
      </IntlProvider>
    </BrowserRouter>
  );
}

export default App;
