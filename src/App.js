import './style/main.scss';

import { IntlProvider } from 'react-intl';
import { Navigate, Route, Routes } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import WebTracking from './components/WebTracking';
import PageTracker from './components/WebTracking/PageTracker';
import Communication from './pages/APropos/Communication';
import FAQ from './pages/APropos/FAQ';
import Glossaire from './pages/APropos/Glossaire';
import Methodology from './pages/APropos/Methodology';
import OpenData from './pages/APropos/OpenData';
import BaroNational from './pages/BaroNational';
import NationalOrcid from './pages/BaroNational/NationalOrcid';
import NationalPublications from './pages/BaroNational/NationalPublications';
import NationalResearchData from './pages/BaroNational/NationalResearchData';
import NationalSoftwareCode from './pages/BaroNational/NationalSoftwareCode';
import NationalThesis from './pages/BaroNational/NationalThesis';
import BaroSante from './pages/BaroSante';
import EssaisCliniques from './pages/BaroSante/EssaisCliniques';
import Etudes from './pages/BaroSante/Etudes';
import SantePublications from './pages/BaroSante/SantePublications';
import HowTo from './pages/Declinaisons/HowTo';
import Variations from './pages/Declinaisons/Variations';
import Error404 from './pages/Error404';
import Integration from './pages/Integration';
import Project from './pages/Project';
import messagesEN from './translations/en.json';
import messagesFR from './translations/fr.json';
import TranslationPage from './translations/translations-page';
import { isInLocal } from './utils/helpers';
import { GraphNavigationContextProvider } from './utils/Hooks/useGraphNavigation';
import useLang from './utils/Hooks/useLang';

const messages = {
  en: messagesEN,
  fr: messagesFR,
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
          {Object.keys(urls.national).map((key) => (
            <Route
              exact
              path={urls.national[key]}
              element={(
                <PageTracker>
                  <BaroNational />
                </PageTracker>
              )}
            />
          ))}
          {urls.nationalPublications.tabs.map((tab) => Object.keys(tab).map((key) => (
            <Route
              exact
              path={tab[key]}
              element={(
                <PageTracker>
                  <GraphNavigationContextProvider>
                    <NationalPublications />
                  </GraphNavigationContextProvider>
                </PageTracker>
              )}
            />
          )))}
          {urls.nationalThesis.tabs.map((tab) => Object.keys(tab).map((key) => (
            <Route
              exact
              path={tab[key]}
              element={(
                <PageTracker>
                  <GraphNavigationContextProvider>
                    <NationalThesis />
                  </GraphNavigationContextProvider>
                </PageTracker>
              )}
            />
          )))}
          {urls.nationalOrcid.tabs.map((tab) => Object.keys(tab).map((key) => (
            <Route
              exact
              path={tab[key]}
              element={(
                <PageTracker>
                  <GraphNavigationContextProvider>
                    <NationalOrcid />
                  </GraphNavigationContextProvider>
                </PageTracker>
              )}
            />
          )))}
          {urls.nationalResearchData.tabs.map((tab) => Object.keys(tab).map((key) => (
            <Route
              exact
              path={tab[key]}
              element={(
                <PageTracker>
                  <GraphNavigationContextProvider>
                    <NationalResearchData />
                  </GraphNavigationContextProvider>
                </PageTracker>
              )}
            />
          )))}
          {urls.nationalSoftwareCode.tabs.map((tab) => Object.keys(tab).map((key) => (
            <Route
              exact
              path={tab[key]}
              element={(
                <PageTracker>
                  <GraphNavigationContextProvider>
                    <NationalSoftwareCode />
                  </GraphNavigationContextProvider>
                </PageTracker>
              )}
            />
          )))}
          {Object.keys(urls.sante).map((key) => (
            <Route
              exact
              path={urls.sante[key]}
              element={(
                <PageTracker>
                  <BaroSante />
                </PageTracker>
              )}
            />
          ))}
          {urls.santePublications.tabs.map((tab) => Object.keys(tab).map((key) => (
            <Route
              exact
              path={tab[key]}
              element={(
                <PageTracker>
                  <GraphNavigationContextProvider>
                    <SantePublications />
                  </GraphNavigationContextProvider>
                </PageTracker>
              )}
            />
          )))}
          {urls.santeEssais.tabs.map((tab) => Object.keys(tab).map((key) => (
            <Route
              exact
              path={tab[key]}
              element={(
                <PageTracker>
                  <GraphNavigationContextProvider>
                    <EssaisCliniques />
                  </GraphNavigationContextProvider>
                </PageTracker>
              )}
            />
          )))}
          {urls.santeEtudes.tabs.map((tab) => Object.keys(tab).map((key) => (
            <Route
              exact
              path={tab[key]}
              element={(
                <PageTracker>
                  <GraphNavigationContextProvider>
                    <Etudes />
                  </GraphNavigationContextProvider>
                </PageTracker>
              )}
            />
          )))}
          {Object.keys(urls.methodologie).map((key) => (
            <Route
              exact
              path={urls.methodologie[key]}
              element={(
                <PageTracker>
                  <Methodology />
                </PageTracker>
              )}
            />
          ))}
          {Object.keys(urls.faq).map((key) => (
            <Route exact path={urls.faq[key]} element={<FAQ />} />
          ))}
          {Object.keys(urls.glossaire).map((key) => (
            <Route
              exact
              path={urls.glossaire[key]}
              element={(
                <PageTracker>
                  <Glossaire />
                </PageTracker>
              )}
            />
          ))}
          {/* Redirect Notes Flash into communication */}
          {Object.keys(urls.flash).map((key) => (
            <Route
              exact
              path={urls.flash[key]}
              element={<Navigate to={urls.communication[key]} />}
            />
          ))}
          {Object.keys(urls.communication).map((key) => (
            <Route
              exact
              path={urls.communication[key]}
              element={(
                <PageTracker>
                  <Communication />
                </PageTracker>
              )}
            />
          ))}
          {Object.keys(urls.variationsOld).map((key) => (
            <Route
              exact
              path={urls.variationsOld[key]}
              element={(
                <PageTracker>
                  <Variations />
                </PageTracker>
              )}
            />
          ))}
          {Object.keys(urls.variations).map((key) => (
            <Route
              exact
              path={urls.variations[key]}
              element={(
                <PageTracker>
                  <Variations />
                </PageTracker>
              )}
            />
          ))}
          {Object.keys(urls.howto).map((key) => (
            <Route
              exact
              path={urls.howto[key]}
              element={(
                <PageTracker>
                  <HowTo />
                </PageTracker>
              )}
            />
          ))}
          {Object.keys(urls.opendata).map((key) => (
            <Route
              exact
              path={urls.opendata[key]}
              element={(
                <PageTracker>
                  <OpenData />
                </PageTracker>
              )}
            />
          ))}
          {[...new Set(Object.values(urls.integration))].flat().map((url) => (
            <Route
              exact
              path={url}
              element={(
                <PageTracker>
                  <Integration />
                </PageTracker>
              )}
            />
          ))}
          {Object.keys(urls.project).map((key) => (
            <Route
              exact
              path={urls.project[key]}
              element={(
                <PageTracker>
                  <Project />
                </PageTracker>
              )}
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
