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

const Chart = ({ id, domain, hasComments }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const [chartComments, setChartComments] = useState('');
  const { lastObservationSnap } = useGlobals();
  const { allData, isLoading, isError } = useGetData(
    lastObservationSnap || 2020,
    domain,
  );
  const { dataGraphTreemap } = allData;
  const idWithDomain = withDomain(id, domain);
  useEffect(() => {
    setChartComments(customComments(allData, idWithDomain, intl));
  }, [allData, idWithDomain, intl]);
  const optionsGraph = chartOptions[id].getOptions(
    idWithDomain,
    intl,
    dataGraphTreemap,
  );

  return (
    <WrapperChart
      chartRef={chartRef}
      domain={domain}
      hasComments={false}
      id={id}
      isError={isError}
      isLoading={isLoading || !dataGraphTreemap}
    >
      <HighchartsReact
        highcharts={Highcharts}
        id={idWithDomain}
        options={optionsGraph}
        ref={chartRef}
      />
      {hasComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  id: 'publi.publishers.type-ouverture.chart-repartition-modeles',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
