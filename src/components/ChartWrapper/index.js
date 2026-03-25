/* eslint-disable react/require-default-props */
import { useMatomo } from '@datapunt/matomo-tracker-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
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

function ChartWrapper({
  chartRef = () => {},
  children,
  dataTitle = {},
  date = undefined,
  domain,
  enableExport = true,
  hasBeta = false,
  hasComments = true,
  hasFooter = true,
  id,
  isError = false,
  isLoading = false,
  studyType = '',
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
      chartRef.current.chart.exportChart(
        {
          filename: title,
          scale: 30,
          type: 'image/png',
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
          date={getFormattedDate(date ?? updateDate, lang)}
          enableExport={enableExport}
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

ChartWrapper.propTypes = {
  chartRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.object }),
    PropTypes.shape({ current: undefined }),
  ]),
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  dataTitle: PropTypes.object,
  date: PropTypes.string,
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

export default ChartWrapper;
