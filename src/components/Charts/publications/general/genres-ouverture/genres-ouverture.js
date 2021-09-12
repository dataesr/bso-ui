import { Toggle } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import treemapModule from 'highcharts/modules/treemap';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import customComments from '../../../../../utils/chartComments';
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

const Chart = ({ id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [isOa, setIsOa] = useState(false);
  const { lastObservationSnap } = useGlobals();
  const [chartComments, setChartComments] = useState('');
  const {
    allData: { dataGraph },
    isLoading,
    isError,
  } = useGetData(lastObservationSnap || '2020', isOa, domain);
  const idWithDomain = withDomain(id, domain);

  useEffect(() => {
    if (!isOa && dataGraph && dataGraph.length > 0) {
      setChartComments(customComments(dataGraph, idWithDomain, intl));
    }
  }, [dataGraph, idWithDomain, intl, isOa, lastObservationSnap]);
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    dataGraph,
  );

  return (
    <WrapperChart
      id={id}
      domain={domain}
      chartRef={chartRef}
      graphComments={false}
      isLoading={isLoading || !dataGraph}
      isError={isError}
    >
      <Toggle
        checked={isOa}
        onChange={() => setIsOa(!isOa)}
        label={intl.formatMessage({ id: `${idWithDomain}.toggle-label` })}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={id}
      />
      <GraphComments comments={chartComments} />
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  id: 'publi.general.genres-ouverture.chart-repartition-genres',
};
Chart.propTypes = {
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
