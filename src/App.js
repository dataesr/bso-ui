import './style/main.scss';

import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const messages = {
  fr: 'Le nouveau baromêtre de la science ouverte arrive bientôt...',
  en: 'A new French Open Science Monitor is coming soon...',
};

function WaitForIt({ language }) {
  return (
    <div>
      <p>{messages[language]}</p>
    </div>
  );
}

WaitForIt.propTypes = {
  language: PropTypes.string.isRequired,
};

function App() {
  const language = window.location.host.startsWith('french') ? 'en' : 'fr';
  return (
    <Router>
      <Switch>
        <Route path='/'>
          <WaitForIt language={language} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
