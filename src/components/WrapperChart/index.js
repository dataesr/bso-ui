import { useMatomo } from '@datapunt/matomo-tracker-react';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { domains, graphIds, studiesTypes } from '../../utils/constants';
import {
  getFormattedDate,
  getSource,
  getURLSearchParams,
  withContext,
  withDomain,
} from '../../utils/helpers';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import useLang from '../../utils/Hooks/useLang';
import BetaChip from '../BetaChip';
import GraphComments from '../Charts/graph-comments';
import GraphFooter from '../Charts/graph-footer';
import GraphTitle from '../Charts/graph-title';
import Loader from '../Loader';

function WrapperChart({
  chartRef,
  children,
  dataTitle,
  domain,
  enableExport,
  hasBeta,
  hasComments,
  hasFooter,
  id,
  isError,
  isLoading,
  studyType,
}) {
  const { lang } = useLang();
  const { updateDate } = useGlobals();
  const intl = useIntl();
  const [height, setHeight] = useState(600);
  const idWithDomain = withDomain(id, domain);
  const idWithContext = withContext(id, domain, studyType);
  const { trackEvent } = useMatomo();
  const { commentsName, name } = getURLSearchParams(intl, id);
  let title = intl.formatMessage(
    {
      id: `${!studyType ? idWithDomain : idWithContext}.title`,
    },
    {
      ...dataTitle,
      commentsName,
    },
  );
  let otherSources = [];
  if (name) {
    title = `${name} : ${title}`;
    otherSources = [name];
  }
  const comments = intl.formatMessage({
    id: `${idWithDomain}.comments`,
    defaultMessage: 'Commentaire non rédigé',
  });
  const source = getSource(idWithDomain, otherSources);

  useEffect(() => {
    setHeight(chartRef?.current?.chart?.chartHeight || 600);
  }, [chartRef]);

  const exportChartPng = () => {
    if (chartRef.current) {
      console.log('exportChartPng');
      console.log(title);
      chartRef.current.chart.exportChart(
        {
          type: 'image/png',
          scale: 30,
          // filename: title,
          filename: JSON.stringify('test accentué'),
        },
        // Override exporting graph title to add name
        { title: { text: title } },
      );
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
  const fullscreen = () => chartRef.current.chart.fullscreen.open();

  if (isLoading) {
    return (
      <div
        className='graph-container text-center'
        style={{ height: '400px' }}
        data-id={idWithContext}
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
      <div className='graph-container' data-id={idWithContext}>
        {hasBeta && (
          <span className=''>
            <BetaChip />
          </span>
        )}
        <GraphTitle title={title} />
        {children}
        {hasComments && comments && (
          <GraphComments comments={comments} hasFooter={hasFooter} />
        )}
      </div>
      {hasFooter && (
        <GraphFooter
          date={getFormattedDate(updateDate, lang)}
          enableExport={enableExport}
          fullscreen={fullscreen}
          height={height}
          onCsvButtonClick={exportChartCsv}
          onPngButtonClick={exportChartPng}
          source={source}
          srcPath={`${id}${domain ? '/' : ''}${domain}`}
          studyType={studyType}
          title={title}
        />
      )}
    </>
  );
}

WrapperChart.defaultProps = {
  chartRef: () => {},
  dataTitle: {},
  enableExport: true,
  hasBeta: false,
  hasComments: true,
  hasFooter: true,
  isError: false,
  isLoading: false,
  studyType: '',
};

WrapperChart.propTypes = {
  chartRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.object }),
    PropTypes.shape({ current: undefined }),
  ]),
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  dataTitle: PropTypes.object,
  domain: PropTypes.oneOf(domains).isRequired,
  enableExport: PropTypes.bool,
  hasBeta: PropTypes.bool,
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds).isRequired,
  isError: PropTypes.bool,
  isLoading: PropTypes.bool,
  studyType: PropTypes.oneOf(studiesTypes),
};

export default WrapperChart;
