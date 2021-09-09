import PropTypes from 'prop-types';
import React, { Suspense } from 'react';

import chartComponents from '../../utils/chartComponents';
import { domains, graphIds } from '../../utils/constants';
import Loader from '../Loader';

function BSOChart({ id, domain, graphComments, graphFooter }) {
  const Chart = chartComponents[id];
  return (
    <Suspense fallback={<Loader />}>
      <Chart
        id={id}
        domain={domain}
        graphComments={graphComments}
        graphFooter={graphFooter}
      />
    </Suspense>
  );
}

BSOChart.defaultProps = {
  domain: '',
  graphFooter: true,
  graphComments: true,
};

BSOChart.propTypes = {
  id: PropTypes.oneOf(graphIds).isRequired,
  domain: PropTypes.oneOf(domains),
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
};

export default BSOChart;
