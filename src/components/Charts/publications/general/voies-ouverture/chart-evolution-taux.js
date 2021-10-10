import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
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

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, domain, id }) => {
  const today = new Date();
  const chartRef = useRef();
  const intl = useIntl();
  const { lastObservationSnap } = useGlobals();
  const [chartComments, setChartComments] = useState('');
  const { allData, isLoading, isError } = useGetData(
    lastObservationSnap || today.getFullYear() - 1,
    domain,
  );
  const { dataGraph, categories } = allData;
  const idWithDomain = withDomain(id, domain);
  useEffect(() => {
    setChartComments(customComments(dataGraph, idWithDomain, intl));
  }, [dataGraph, idWithDomain, intl]);
  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    categories,
    dataGraph,
  );

  return (
    <WrapperChart
      id={id}
      domain={domain}
      chartRef={chartRef}
      isLoading={isLoading || !dataGraph || !categories}
      isError={isError}
      graphFooter={graphFooter}
      graphComments={false}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={idWithDomain}
      />
      {graphComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  domain: '',
  id: 'publi.general.voies-ouverture.chart-evolution-taux',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
