import { Alert } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { useIntl } from 'react-intl';

import chartComponents from '../../utils/chartComponents';
import { domains, graphIds, studiesTypes } from '../../utils/constants';
import Loader from '../Loader';

function BSOChart({
  id,
  domain,
  hasComments,
  hasFooter,
  studyType,
  isDisplayed,
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
            title=''
          />
        )}
        {Chart && (
          <Chart
            id={id}
            domain={domain}
            hasComments={hasComments}
            hasFooter={hasFooter}
            studyType={studyType}
          />
        )}
      </Suspense>
    )
  );
}

BSOChart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  isDisplayed: null,
  studyType: null,
};

BSOChart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds).isRequired,
  isDisplayed: PropTypes.bool,
  studyType: PropTypes.oneOf(studiesTypes),
};

export default BSOChart;
