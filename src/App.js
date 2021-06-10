import './style/main.scss';

import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './components/Header';
import Accueil from './pages/Accueil';
import FAQ from './pages/APropos/FAQ';
import Glossaire from './pages/APropos/Glossaire';
import Methodologie from './pages/APropos/Methodologie';
import NotesFlash from './pages/APropos/NotesFlash';
import Projet from './pages/APropos/Projet';
import BaroNational from './pages/BaroNational';
import BaroSante from './pages/BaroSante';
import EssaisCliniques from './pages/BaroSante/EssaisCliniques';
import Etudes from './pages/BaroSante/Etudes';
import SantePublications from './pages/BaroSante/SantePublications';
import Themes from './pages/Themes';
import messagesEN from './translations/en.json';
import messagesFR from './translations/fr.json';
import useLang from './utils/Hooks/useLang';

const messages = {
  fr: messagesFR,
  en: messagesEN,
};

function App() {
  const { lang } = useLang();
  return (
    <IntlProvider locale='fr' messages={messages[lang]}>
      <Router>
        <Header />
        <Switch>
          <Route exact path='/'>
            <Accueil />
          </Route>
          <Route exact path='/baro-national'>
            <BaroNational />
          </Route>
          <Route exact path='/baro-sante'>
            <BaroSante />
          </Route>
          <Route exact path='/baro-sante/publications'>
            <SantePublications />
          </Route>
          <Route exact path='/baro-sante/essais-cliniques'>
            <EssaisCliniques />
          </Route>
          <Route exact path='/baro-sante/etudes'>
            <Etudes />
          </Route>
          <Route exact path='/themes'>
            <Themes />
          </Route>
          <Route exact path='/a-propos/methodologie'>
            <Methodologie />
          </Route>
          <Route exact path='/a-propos/faq'>
            <FAQ />
          </Route>
          <Route exact path='/a-propos/glossaire'>
            <Glossaire />
          </Route>
          <Route exact path='/a-propos/projet'>
            <Projet />
          </Route>
          <Route exact path='/a-propos/notes-flash'>
            <NotesFlash />
          </Route>
        </Switch>
      </Router>
    </IntlProvider>
  );
}

export default App;
