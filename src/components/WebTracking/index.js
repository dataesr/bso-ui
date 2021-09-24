import {
  createInstance,
  MatomoProvider,
  useMatomo,
} from '@datapunt/matomo-tracker-react';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { documentTitles } from '../../utils/constants';

function WebTracking({ children }) {
  const location = useLocation();
  const [path, setPath] = useState(() => location.pathname || '');
  const [init, setInit] = useState(true);
  const intl = useIntl();

  const { trackPageView } = useMatomo();
  const getDocumentTitle = useCallback(
    () => intl.formatMessage({
      id: `${documentTitles[location.pathname]}`,
      defaultMessage: 'Baromètre français de la Science Ouverte',
    }),
    [intl, location.pathname],
  );

  const instance = createInstance({
    urlBase: process.env.REACT_APP_PIWIK_URL,
    siteId: process.env.REACT_APP_PIWIK_SITE,
  });

  useEffect(() => {
    document.title = getDocumentTitle();
  }, [getDocumentTitle, path]);

  useEffect(() => {
    if (path !== location.pathname) {
      setPath(location.pathname);
      trackPageView({ documentTitle: getDocumentTitle() });
    }
  }, [getDocumentTitle, location, path, trackPageView]);

  useEffect(() => {
    if (init) {
      trackPageView({ documentTitle: getDocumentTitle() });
      setInit(false);
    }
  }, [getDocumentTitle, init, trackPageView]);

  return <MatomoProvider value={instance}>{children}</MatomoProvider>;
}

WebTracking.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WebTracking;
