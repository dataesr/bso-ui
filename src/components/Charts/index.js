import PropTypes from 'prop-types';

import chartComponents from '../../utils/chartComponents';
import { domains, graphIds } from '../../utils/constants';

export default function BSOChart({ id, domain, ...props }) {
  const Chart = chartComponents[id];
  return <Chart id={id} domain={domain} {...props} />;
}

BSOChart.propTypes = {
  id: PropTypes.oneOf(graphIds).isRequired,
  domain: PropTypes.oneOf(domains),
};

BSOChart.defaultProps = {
  domain: '',
};
