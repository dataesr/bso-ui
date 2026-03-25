/* eslint-disable react/require-default-props */
import { Alert, Container } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

function GraphContent({
  children = null,
  isDisplayed,
  paths = [''],
}) {
  const { pathname } = useLocation();
  const intl = useIntl();
  return paths.indexOf(`${pathname}`) > -1
    ? (isDisplayed || isDisplayed == null) && (
      <>
        {isDisplayed && (
          <Container>
            <Alert
              description={intl.formatMessage({
                id: 'app.commons.tab-warning',
              })}
              title=''
            />
          </Container>
        )}
        {children}
      </>
    )
    : null;
}

GraphContent.propTypes = {
  children: PropTypes.node.isRequired,
  isDisplayed: PropTypes.bool,
  paths: PropTypes.arrayOf(PropTypes.string),
};

export default GraphContent;
