import { useMatomo } from '@datapunt/matomo-tracker-react';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { domains, graphIds, studiesTypes } from '../../utils/constants';
import {
  getFormattedDate,
  getSource,
  withContext,
  withDomain,
} from '../../utils/helpers';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import useLang from '../../utils/Hooks/useLang';
import GraphComments from '../Charts/graph-comments';
import GraphFooter from '../Charts/graph-footer';
import GraphTitle from '../Charts/graph-title';
import Loader from '../Loader';

function WrapperChart({
  hasFooter,
  graphComments,
  children,
  id,
  domain,
  chartRef,
  isLoading,
  isError,
  studyType,
}) {
  const { lang } = useLang();
  const { updateDate } = useGlobals();
  const intl = useIntl();
  const idWithDomain = withDomain(id, domain);
  const { trackEvent } = useMatomo();
  const title = !studyType
    ? intl.formatMessage({ id: `${idWithDomain}.title` })
    : intl.formatMessage({
      id: `${withContext(id, domain, studyType)}.title`,
    });
  const comments = intl.messages[`${idWithDomain}.comments`]
    ? intl.formatMessage({ id: `${idWithDomain}.comments` })
    : 'commentaire non rédigé';
  const source = getSource(idWithDomain);

  const exportChartPng = () => {
    if (chartRef.current) {
      chartRef.current.chart.exportChart({
        type: 'image/png',
      });
    }
    trackEvent({
      category: 'export',
      action: 'export-graph-png',
      name: `png_${title}`,
    });
  };
  const exportChartCsv = () => {
    chartRef.current.chart.downloadCSV();

    trackEvent({
      category: 'export',
      action: 'export-graph-csv',
      name: `csv_${title}`,
    });
  };

  if (isLoading) {
    return (
      <div
        className='graph-container'
        data-id={withContext(id, domain, studyType)}
      >
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <>Error</>;
  }

  return (
    <>
      <div
        className='graph-container'
        data-id={withContext(id, domain, studyType)}
      >
        <GraphTitle title={title} />
        {children}
        {graphComments && <GraphComments comments={comments} />}
      </div>
      {hasFooter && (
        <GraphFooter
          title={title}
          studyType={studyType}
          date={getFormattedDate(updateDate, lang)}
          source={source}
          srcPath={`${id}${domain ? '/' : ''}${domain}`}
          onPngButtonClick={exportChartPng}
          onCsvButtonClick={exportChartCsv}
        />
      )}
    </>
  );
}
WrapperChart.defaultProps = {
  hasFooter: true,
  graphComments: true,
  isLoading: false,
  isError: false,
  chartRef: () => {},
  studyType: '',
};

WrapperChart.propTypes = {
  hasFooter: PropTypes.bool,
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
  studyType: PropTypes.oneOf(studiesTypes),
};

export default WrapperChart;
