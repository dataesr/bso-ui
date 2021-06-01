import './style/main.scss';

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import BSOHeader from './components/BSOHeader';
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

function App() {
  return (
    <Router>
      <BSOHeader />
      <Switch>
        <Route exact path="/">
          <Accueil />
        </Route>
        <Route exact path="/baro-national">
          <BaroNational />
        </Route>
        <Route exact path="/baro-sante">
          <BaroSante />
        </Route>
        <Route exact path="/baro-sante/publications">
          <SantePublications />
        </Route>
        <Route exact path="/baro-sante/essais-cliniques">
          <EssaisCliniques />
        </Route>
        <Route exact path="/baro-sante/etudes">
          <Etudes />
        </Route>
        <Route exact path="/themes">
          <Themes />
        </Route>
        <Route exact path="/methodologie">
          <Methodologie />
        </Route>
        <Route exact path="/faq">
          <FAQ />
        </Route>
        <Route exact path="/glossaire">
          <Glossaire />
        </Route>
        <Route exact path="/projet">
          <Projet />
        </Route>
        <Route exact path="/notes-flash">
          <NotesFlash />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
