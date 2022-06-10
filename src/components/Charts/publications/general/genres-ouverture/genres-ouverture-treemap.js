import { Toggle } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import treemapModule from 'highcharts/modules/treemap';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

treemapModule(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [isOa, setIsOa] = useState(false);
  const { lastObservationSnap } = useGlobals();
  const [chartComments, setChartComments] = useState('');
  const {
    allData: { dataGraph },
    isError,
    isLoading,
  } = useGetData(lastObservationSnap, isOa, domain);
  const idWithDomain = withDomain(id, domain);
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    dataGraph,
  );

  useEffect(() => {
    if (!isOa && dataGraph && dataGraph.length > 0) {
      // TODO Manage variables in comment
      // setChartComments(customComments(dataGraph, idWithDomain, intl));
      setChartComments('comments');
    }
  }, [dataGraph, idWithDomain, intl, isOa, lastObservationSnap]);

  return (
    <WrapperChart
      chartRef={chartRef}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
      isError={isError}
      isLoading={isLoading || !dataGraph}
    >
      <Toggle
        checked={isOa}
        label={intl.formatMessage({ id: 'app.details' })}
        onChange={() => setIsOa(!isOa)}
      />
      <HighchartsReact
        highcharts={Highcharts}
        id={id}
        options={optionsGraph}
        ref={chartRef}
      />
      {hasComments && chartComments && (
        <GraphComments comments={chartComments} hasFooter={hasFooter} />
      )}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.general.genres-ouverture-treemap.chart-repartition-genres',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
