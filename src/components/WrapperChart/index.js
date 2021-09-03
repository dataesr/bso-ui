import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { graphIds } from '../../utils/constants';
import { getFormattedDate } from '../../utils/helpers';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import useLang from '../../utils/Hooks/useLang';
import GraphComments from '../charts/graph-comments';
import GraphFooter from '../charts/graph-footer';
import GraphTitle from '../charts/graph-title';

// TODO add Loader in wrapper
function WrapperChart({ graphFooter, graphComments, children, id, chartRef }) {
  const { lang } = useLang();
  const { updateDate } = useGlobals();
  const intl = useIntl();

  const exportChartPng = () => {
    chartRef.current.chart.exportChart({
      type: 'image/png',
    });
  };
  const exportChartCsv = () => {
    chartRef.current.chart.downloadCSV();
  };

  return (
    <>
      <div className='graph-container' data-id={id}>
        <GraphTitle title={intl.formatMessage({ id: `${id}.title` })} />
        {children}
        {graphComments && (
          <GraphComments
            comments={intl.formatMessage({ id: `${id}.comments` })}
          />
        )}
      </div>
      {graphFooter && (
        <GraphFooter
          date={getFormattedDate(updateDate, lang)}
          source={intl.formatMessage({ id: `${id}.source` })}
          graphId={id}
          onPngButtonClick={exportChartPng}
          onCsvButtonClick={exportChartCsv}
        />
      )}
    </>
  );
}
WrapperChart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  chartRef: () => {},
};

WrapperChart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  children: PropTypes.node.isRequired,
  id: PropTypes.oneOf(graphIds).isRequired,
  chartRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(HTMLInputElement) }),
    PropTypes.shape({ current: undefined }),
  ]),
};

export default WrapperChart;
