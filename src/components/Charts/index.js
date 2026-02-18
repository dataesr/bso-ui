/* eslint-disable react/require-default-props */
import { Alert } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Suspense } from 'react';
import { useIntl } from 'react-intl';

import chartComponents from '../../utils/chartComponents';
import { domains, graphIds, studiesTypes } from '../../utils/constants';
import Loader from '../Loader';

function BSOChart({
  domain = '',
  hasComments = true,
  hasFooter = true,
  id,
  isDisplayed = null,
  productionReady = null,
  studyType = undefined,
}) {
  const intl = useIntl();
  const Chart = chartComponents[id];
  return (
    (isDisplayed || isDisplayed == null) && (
      <Suspense fallback={<Loader />}>
        {isDisplayed && (
          <Alert
            description={intl.formatMessage({
              id: 'app.commons.graph-warning',
            })}
          />
        )}
        {productionReady && (
          <Alert
            description={intl.formatMessage({
              id: 'app.commons.production-ready',
            })}
            type='error'
          />
        )}
        {Chart && (
          <Chart
            domain={domain}
            hasComments={hasComments}
            hasFooter={hasFooter}
            id={id}
            studyType={studyType}
          />
        )}
      </Suspense>
    )
  );
}

BSOChart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds).isRequired,
  isDisplayed: PropTypes.bool,
  productionReady: PropTypes.bool,
  studyType: PropTypes.oneOf(studiesTypes),
};

export default BSOChart;
