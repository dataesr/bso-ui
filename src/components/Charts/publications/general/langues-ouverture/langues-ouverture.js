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
  const idWithDomain = withDomain(id, domain);
  const [isOa, setIsOa] = useState(false);
  const [chartComments, setChartComments] = useState('');
  const { lastObservationSnap } = useGlobals();
  const {
    allData: { dataGraph },
    isLoading,
    isError,
  } = useGetData(lastObservationSnap || '2020', isOa, domain);

  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    dataGraph,
  );

  useEffect(() => {
    if (!isOa && dataGraph && dataGraph.length > 0) {
      setChartComments(customComments(dataGraph, idWithDomain, intl));
    }
  }, [dataGraph, idWithDomain, intl, isOa, lastObservationSnap]);

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
        label={intl.formatMessage({ id: 'app.details' })}
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
  id: 'publi.general.langues-ouverture.chart-repartition-publications',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
