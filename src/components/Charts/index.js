import PropTypes from 'prop-types';
import React, { Suspense } from 'react';

import chartComponents from '../../utils/chartComponents';
import { domains, graphIds, studiesTypes } from '../../utils/constants';
import Loader from '../Loader';

function BSOChart({ id, domain, graphComments, graphFooter, studyType }) {
  const Chart = chartComponents[id];
  return (
    <Suspense fallback={<Loader />}>
      <Chart
        id={id}
        domain={domain}
        graphComments={graphComments}
        graphFooter={graphFooter}
        studyType={studyType}
      />
    </Suspense>
  );
}

BSOChart.defaultProps = {
  domain: '',
  graphFooter: true,
  graphComments: true,
  studyType: '',
};

BSOChart.propTypes = {
  id: PropTypes.oneOf(graphIds).isRequired,
  domain: PropTypes.oneOf(domains),
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  studyType: PropTypes.oneOf(studiesTypes),
};

export default BSOChart;
