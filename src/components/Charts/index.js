import PropTypes from 'prop-types';

import chartComponents from '../../utils/chartComponents';
import { domains, graphIds } from '../../utils/constants';

function BSOChart({ id, domain, graphComments, graphFooter }) {
  const Chart = chartComponents[id];
  return (
    <Chart
      id={id}
      domain={domain}
      graphComments={graphComments}
      graphFooter={graphFooter}
    />
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
