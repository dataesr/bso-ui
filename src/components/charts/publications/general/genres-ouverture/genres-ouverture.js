import { Toggle } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import treemapModule from 'highcharts/modules/treemap';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { complexComments } from '../../../../../utils/chartComments';
import { getGraphOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
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
  const optionsGraph = getGraphOptions(id, intl);

  useEffect(() => {
    if (!isOa && dataGraph && dataGraph.length > 0) {
      setChartComments(
        complexComments(dataGraph, lastObservationSnap, id, intl),
      );
    }
  }, [dataGraph, id, intl, isOa, lastObservationSnap]);

  optionsGraph.series = [
    {
      type: 'treemap',
      layoutAlgorithm: 'stripes',
      alternateStartingDirection: true,
      levels: [
        {
          level: 1,
          layoutAlgorithm: 'sliceAndDice',
          dataLabels: {
            enabled: true,
            align: 'left',
            verticalAlign: 'top',
            style: {
              fontSize: '15px',
              fontWeight: 'bold',
            },
          },
        },
      ],
      data: dataGraph,
    },
  ];

  return (
    <WrapperChart
      id={id}
      chartRef={chartRef}
      graphComments={false}
      isLoading={isLoading || !dataGraph}
      isError={isError}
    >
      <Toggle
        isChecked={isOa}
        onChange={() => setIsOa(!isOa)}
        label={intl.formatMessage({ id: `${id}.toggle-label` })}
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
  id: 'app.national-publi.general.genres-ouverture.chart-repartition-genres',
};
Chart.propTypes = {
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
