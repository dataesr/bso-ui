import './style/main.scss';

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './pages/Accueil';
import BaroNational from './pages/BaroNational';
import BaroSante from './pages/BaroSante';
import EssaisCliniques from './pages/BaroSante/EssaisCliniques';
import Etudes from './pages/BaroSante/Etudes';
import SantePublications from './pages/BaroSante/SantePublications';
import Theme from './pages/Theme';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
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
          <Route exact path="/theme">
            <Theme />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
