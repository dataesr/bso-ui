import { createInstance, MatomoProvider } from '@datapunt/matomo-tracker-react';
import PropTypes from 'prop-types';

function WebTracking({ children }) {
  const instance = createInstance({
    urlBase: process.env.REACT_APP_PIWIK_URL,
    siteId: process.env.REACT_APP_PIWIK_SITE,
  });

  return <MatomoProvider value={instance}>{children}</MatomoProvider>;
}

WebTracking.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WebTracking;
