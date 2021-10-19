import PropTypes from 'prop-types';
import React, { Suspense } from 'react';

import chartComponents from '../../utils/chartComponents';
import { domains, graphIds, studiesTypes } from '../../utils/constants';
import Loader from '../Loader';

function BSOChart({ id, domain, graphComments, hasFooter, studyType }) {
  const Chart = chartComponents[id];
  return (
    <Suspense fallback={<Loader />}>
      {Chart && (
        <Chart
          id={id}
          domain={domain}
          graphComments={graphComments}
          hasFooter={hasFooter}
          studyType={studyType}
        />
      )}
    </Suspense>
  );
}

BSOChart.defaultProps = {
  domain: '',
  hasFooter: true,
  graphComments: true,
  studyType: null,
};

BSOChart.propTypes = {
  id: PropTypes.oneOf(graphIds).isRequired,
  domain: PropTypes.oneOf(domains),
  hasFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  studyType: PropTypes.oneOf(studiesTypes),
};

export default BSOChart;
