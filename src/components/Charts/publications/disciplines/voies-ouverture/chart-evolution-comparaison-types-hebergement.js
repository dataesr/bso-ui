/* eslint-disable react/no-this-in-sfc */
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import HighchartsAnnotations from 'highcharts/modules/annotations';
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
import useGetData from './get-data-evolution';

HCExporting(Highcharts);
HCExportingData(Highcharts);
highchartsMore(Highcharts);
HighchartsAnnotations(Highcharts);

const Chart = ({ graphFooter, graphComments, id, domain }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { lastObservationSnap } = useGlobals();
  const { data, isLoading } = useGetData(lastObservationSnap, domain);
  const idWithDomain = withDomain(id, domain);
  const optionsGraph = chartOptions[id].getOptions(idWithDomain, intl, data);

  return (
    <WrapperChart
      idWithDomain={idWithDomain}
      id={id}
      isLoading={isLoading || !data.bubbleGraph}
      chartRef={chartRef}
      graphFooter={graphFooter}
      graphComments={graphComments}
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
  graphFooter: true,
  graphComments: true,
  id: 'publi.disciplines.voies-ouverture.chart-evolution-comparaison-types-hebergement',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
