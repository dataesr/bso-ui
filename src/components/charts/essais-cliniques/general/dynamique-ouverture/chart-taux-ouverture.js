import '../../../graph.scss';

import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { discipline100, g800 } from '../../../../../style/colours.module.scss';
import { simpleComments } from '../../../../../utils/chartComments';
import { getGraphOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, domain, id }) => {
  const chartRef = useRef();
  const intl = useIntl();
  const { observationSnaps } = useGlobals();
  const [chartComments, setChartComments] = useState('');
  const { data, isLoading, isError } = useGetData(observationSnaps, domain);
  const { dataGraph1 } = data;
  const optionsGraph1 = getGraphOptions(id, intl);

  useEffect(() => {
    setChartComments(simpleComments(dataGraph1, id, intl));
  }, [dataGraph1, id, intl]);

  optionsGraph1.chart.type = 'bar';
  optionsGraph1.colors = [discipline100];
  optionsGraph1.yAxis = { visible: false, min: 0, max: 100 };
  optionsGraph1.plotOptions = {
    bar: {
      dataLabels: {
        enabled: true,
        format: '{point.y:.0f} %',
        style: {
          color: g800,
          fontSize: '20px',
          fontWeight: 'bold',
        },
      },
    },
  };
  optionsGraph1.xAxis = {
    type: 'category',
    lineWidth: 0,
    tickWidth: 0,
    labels: {
      style: {
        color: 'var(--g800)',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
  };
  optionsGraph1.series = [
    {
      data: dataGraph1,
      showInLegend: false,
    },
  ];

  return (
    <WrapperChart
      isLoading={isLoading || !dataGraph1}
      isError={isError}
      id={id}
      chartRef={chartRef}
      graphFooter={graphFooter}
      graphComments={false}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph1}
        ref={chartRef}
        id={id}
      />
      {graphComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  domain: '',
  id: 'app.national-publi.general.dynamique-ouverture.chart-taux-ouverture',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
