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
import Loader from '../Loader';

function WrapperChart({
  graphFooter,
  graphComments,
  children,
  id,
  idWithDomain,
  chartRef,
  isLoading,
  isError,
}) {
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

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <>Error</>;
  }

  return (
    <>
      <div className='graph-container' data-id={id}>
        <GraphTitle
          title={intl.formatMessage({ id: `${idWithDomain}.title` })}
        />
        {children}
        {graphComments && (
          <GraphComments
            comments={intl.formatMessage({ id: `${idWithDomain}.comments` })}
          />
        )}
      </div>
      {graphFooter && (
        <GraphFooter
          date={getFormattedDate(updateDate, lang)}
          source={intl.formatMessage({ id: `${idWithDomain}.source` })}
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
  isLoading: false,
  isError: false,
  chartRef: () => {},
};

WrapperChart.propTypes = {
  graphFooter: PropTypes.bool,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  graphComments: PropTypes.bool,
  children: PropTypes.node.isRequired,
  id: PropTypes.oneOf(graphIds).isRequired,
  idWithDomain: PropTypes.string.isRequired,
  chartRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(HTMLInputElement) }),
    PropTypes.shape({ current: undefined }),
  ]),
};

export default WrapperChart;
