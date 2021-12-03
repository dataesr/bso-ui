import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { beforeLastObservationSnap, lastObservationSnap } = useGlobals();
  const { allData, isLoading, isError } = useGetData(
    lastObservationSnap,
    domain,
  );
  const { dataGraph, categories } = allData;
  const optionsGraph = chartOptions[id].getOptions(
    withDomain(id, domain),
    intl,
    categories,
    dataGraph,
  );

  return (
    <WrapperChart
      domain={domain}
      id={id}
      chartRef={chartRef}
      isLoading={isLoading || !dataGraph || !categories}
      isError={isError}
      dataTitle={{ publicationYear: beforeLastObservationSnap }}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={id}
      />
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  id: 'publi.disciplines.voies-ouverture.chart-repartition-publications',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
