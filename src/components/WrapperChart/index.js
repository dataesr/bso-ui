import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { domains, graphIds } from '../../utils/constants';
import { getFormattedDate, withDomain } from '../../utils/helpers';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import useLang from '../../utils/Hooks/useLang';
import GraphComments from '../Charts/graph-comments';
import GraphFooter from '../Charts/graph-footer';
import GraphTitle from '../Charts/graph-title';
import Loader from '../Loader';

function WrapperChart({
  graphFooter,
  graphComments,
  children,
  id,
  domain,
  chartRef,
  isLoading,
  isError,
}) {
  const { lang } = useLang();
  const { updateDate } = useGlobals();
  const intl = useIntl();
  const idWithDomain = withDomain(id, domain);

  const exportChartPng = () => {
    chartRef.current.chart.exportChart({
      type: 'image/png',
    });
  };
  const exportChartCsv = () => {
    chartRef.current.chart.downloadCSV();
  };

  if (isLoading) {
    return (
      <div className='graph-container' data-id={id}>
        <Loader />
      </div>
    );
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
          srcPath={`${id}${domain ? '/' : ''}${domain}`}
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
  domain: PropTypes.oneOf(domains).isRequired,
  chartRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(HTMLInputElement) }),
    PropTypes.shape({ current: undefined }),
  ]),
};

export default WrapperChart;
