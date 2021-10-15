import { useMatomo } from '@datapunt/matomo-tracker-react';
import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { documentTitles } from '../../utils/constants';

function PageTracker({ children }) {
  const location = useLocation();
  const intl = useIntl();
  const { trackPageView } = useMatomo();
  const getDocumentTitle = useCallback(
    () => intl.formatMessage({
      id: `${documentTitles[location.pathname]}`,
      defaultMessage: 'Baromètre français de la Science Ouverte',
    }),
    [intl, location.pathname],
  );

  useEffect(() => {
    document.title = getDocumentTitle();
    trackPageView({ documentTitle: `${document.title}` });
  }, [getDocumentTitle, trackPageView]);

  return <>{children}</>;
}

PageTracker.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageTracker;
