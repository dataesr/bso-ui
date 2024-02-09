import './style/main.scss';

import { IntlProvider } from 'react-intl';
import { Navigate, Route, Routes } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import WebTracking from './components/WebTracking';
import PageTracker from './components/WebTracking/PageTracker';
import HomePage from './pages';
import Citation from './pages/About/Citation';
import Communication from './pages/About/Communication';
import FAQ from './pages/About/FAQ';
import Glossaire from './pages/About/Glossaire';
import Methodology from './pages/About/Methodology';
import OpenData from './pages/About/OpenData';
import BaroNational from './pages/BaroNational';
import NationalPublications from './pages/BaroNational/NationalPublications';
import NationalResearchData from './pages/BaroNational/NationalResearchData';
import NationalSoftwareCode from './pages/BaroNational/NationalSoftwareCode';
import NationalThesis from './pages/BaroNational/NationalThesis';
import BaroSante from './pages/BaroSante';
import EssaisCliniques from './pages/BaroSante/EssaisCliniques';
import Etudes from './pages/BaroSante/Etudes';
import DataCode from './pages/DataCode';
import HowTo from './pages/Declinaisons/HowTo';
import Policy from './pages/Declinaisons/Policy';
import Variations from './pages/Declinaisons/Variations';
import Error404 from './pages/Error404';
import Integration from './pages/Integration';
import NationalOrcid from './pages/NationalOrcid';
import Project from './pages/Project';
import messagesEN from './translations/en.json';
import messagesFR from './translations/fr.json';
import TranslationPage from './translations/translations-page';
import { isInLocal, isInProduction } from './utils/helpers';
import { GraphNavigationContextProvider } from './utils/Hooks/useGraphNavigation';
import useLang from './utils/Hooks/useLang';

const messages = {
  en: messagesEN,
  fr: messagesFR,
};

const redirects = isInProduction
  ? {}
  : {
    '/a-propos/notes-flash': '/a-propos/communication',
    '/about/notes': '/about/communication',
    '/a-propos/declinaisons': '/declinaisons/bso-locaux',
    '/about/declinaisons': '/declinaisons/bso-locaux',
    '/sante/publications/general': '/publications/general',
    '/sante/publications/disciplines': '/publications/general',
    '/sante/publications/editeurs': '/publications/general',
    '/sante/publications/archives': '/publications/general',
    '/sante/publications/affiliations': '/publications/general',
    '/health/publications/general': '/publications/general',
    '/health/publications/fields': '/publications/general',
    '/health/publications/publishers': '/publications/general',
    '/health/publications/repositories': '/publications/general',
    '/health/publications/affiliations': '/publications/general',
  };

function App() {
  const { lang, urls } = useLang();

  return (
    <IntlProvider locale={lang} messages={messages[lang]} onError={() => {}}>
      <WebTracking>
        <Header />
        <Routes>
          {isInLocal() && (
            <Route path='/translations' element={<TranslationPage />} />
          )}
          {Object.keys(redirects).map((redirect) => (
            <Route
              element={<Navigate to={redirects[redirect]} replace />}
              exact
              key={redirect}
              path={redirect}
            />
          ))}
          {Object.keys(urls.national).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <HomePage />
                </PageTracker>
              )}
              exact
              key={key}
              path={urls.national[key]}
            />
          ))}
          <Route
            element={(
              <PageTracker>
                <BaroNational />
              </PageTracker>
            )}
            exact
            key={urls.nationalPublications[lang]}
            path={urls.nationalPublications[lang]}
          />
          {urls.nationalPublications.tabs.map((tab) => Object.keys(tab).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <GraphNavigationContextProvider>
                    <NationalPublications />
                  </GraphNavigationContextProvider>
                </PageTracker>
              )}
              exact
              key={key}
              path={tab[key]}
            />
          )))}
          {urls.nationalThesis.tabs.map((tab) => Object.keys(tab).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <GraphNavigationContextProvider>
                    <NationalThesis />
                  </GraphNavigationContextProvider>
                </PageTracker>
              )}
              exact
              key={key}
              path={tab[key]}
            />
          )))}
          {urls.nationalOrcid.tabs.map((tab) => Object.keys(tab).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <GraphNavigationContextProvider>
                    <NationalOrcid />
                  </GraphNavigationContextProvider>
                </PageTracker>
              )}
              exact
              key={key}
              path={tab[key]}
            />
          )))}
          {urls.nationalResearchData.tabs.map((tab) => Object.keys(tab).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <GraphNavigationContextProvider>
                    <NationalResearchData />
                  </GraphNavigationContextProvider>
                </PageTracker>
              )}
              exact
              key={key}
              path={tab[key]}
            />
          )))}
          {urls.nationalSoftwareCode.tabs.map((tab) => Object.keys(tab).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <GraphNavigationContextProvider>
                    <NationalSoftwareCode />
                  </GraphNavigationContextProvider>
                </PageTracker>
              )}
              exact
              key={key}
              path={tab[key]}
            />
          )))}
          {Object.keys(urls.nationalDataCode).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <DataCode />
                </PageTracker>
              )}
              exact
              key={key}
              path={urls.nationalDataCode[key]}
            />
          ))}
          {Object.keys(urls.sante).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <BaroSante />
                </PageTracker>
              )}
              exact
              key={key}
              path={urls.sante[key]}
            />
          ))}
          {urls.santeEssais.tabs.map((tab) => Object.keys(tab).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <GraphNavigationContextProvider>
                    <EssaisCliniques />
                  </GraphNavigationContextProvider>
                </PageTracker>
              )}
              exact
              key={key}
              path={tab[key]}
            />
          )))}
          {urls.santeEtudes.tabs.map((tab) => Object.keys(tab).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <GraphNavigationContextProvider>
                    <Etudes />
                  </GraphNavigationContextProvider>
                </PageTracker>
              )}
              exact
              key={key}
              path={tab[key]}
            />
          )))}
          {Object.keys(urls.methodologie).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <Methodology />
                </PageTracker>
              )}
              exact
              key={key}
              path={urls.methodologie[key]}
            />
          ))}
          {Object.keys(urls.faq).map((key) => (
            <Route element={<FAQ />} exact key={key} path={urls.faq[key]} />
          ))}
          {Object.keys(urls.glossaire).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <Glossaire />
                </PageTracker>
              )}
              exact
              key={key}
              path={urls.glossaire[key]}
            />
          ))}
          {Object.keys(urls.communication).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <Communication />
                </PageTracker>
              )}
              exact
              key={key}
              path={urls.communication[key]}
            />
          ))}
          {Object.keys(urls.policy).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <Policy />
                </PageTracker>
              )}
              exact
              key={key}
              path={urls.policy[key]}
            />
          ))}
          {Object.keys(urls.variations).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <Variations />
                </PageTracker>
              )}
              exact
              key={key}
              path={urls.variations[key]}
            />
          ))}
          {Object.keys(urls.howto).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <HowTo />
                </PageTracker>
              )}
              exact
              key={key}
              path={urls.howto[key]}
            />
          ))}
          {Object.keys(urls.opendata).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <OpenData />
                </PageTracker>
              )}
              exact
              key={key}
              path={urls.opendata[key]}
            />
          ))}
          {Object.keys(urls.citation).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <Citation />
                </PageTracker>
              )}
              exact
              key={key}
              path={urls.citation[key]}
            />
          ))}
          {[...new Set(Object.values(urls.integration))].flat().map((url) => (
            <Route
              element={(
                <PageTracker>
                  <Integration />
                </PageTracker>
              )}
              exact
              key={url}
              path={url}
            />
          ))}
          {Object.keys(urls.project).map((key) => (
            <Route
              element={(
                <PageTracker>
                  <Project />
                </PageTracker>
              )}
              exact
              key={key}
              path={urls.project[key]}
            />
          ))}
          <Route exact path='*' element={<Error404 />} />
        </Routes>
        <Footer />
      </WebTracking>
    </IntlProvider>
  );
}

export default App;
