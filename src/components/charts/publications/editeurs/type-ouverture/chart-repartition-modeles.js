import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import treemapModule from 'highcharts/modules/treemap';
import HighchartsReact from 'highcharts-react-official';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import { getGraphOptions } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import GraphTitle from '../../../graph-title';
import useGetData from './get-data-evolution-repartition';

treemapModule(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = () => {
  const chartRef = useRef();
  const intl = useIntl();
  const graphId = 'app.sante-publi.publishers.type-ouverture.chart-repartition-modeles';
  const { observationSnaps, updateDate } = useGlobals();
  const { allData, isLoading, isError } = useGetData(
    observationSnaps[0] || 2020,
  );
  const { dataGraphTreemap } = allData;

  if (isLoading || !dataGraphTreemap) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

  const optionsGraph = getGraphOptions(graphId, intl);
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
            format: '<b>{point.name}</b><br>{point.value:.0f} %',
            align: 'left',
            verticalAlign: 'top',
            style: {
              fontSize: '15px',
              fontWeight: 'bold',
            },
          },
        },
      ],
      dataLabels: {
        format: '{point.name}<br>{point.value:.0f} %',
        rotationMode: 'auto',
        filter: {
          property: 'value',
          operator: '>',
          value: '0.1',
        },
      },
      data: dataGraphTreemap,
    },
  ];
  const exportChartPng = () => {
    chartRef.current.chart.exportChart({
      type: 'image/png',
    });
  };
  const exportChartCsv = () => {
    chartRef.current.chart.downloadCSV();
  };

  return (
    <>
      <div className='graph-container'>
        <GraphTitle title={intl.formatMessage({ id: `${graphId}.title` })} />
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsGraph}
          ref={chartRef}
          id={graphId}
        />
        <GraphComments
          comments={intl.formatMessage({ id: `${graphId}.comments` })}
        />
      </div>
      <GraphFooter
        date={updateDate}
        source={intl.formatMessage({ id: `${graphId}.source` })}
        graphId={graphId}
        onPngButtonClick={exportChartPng}
        onCsvButtonClick={exportChartCsv}
      />
    </>
  );
};

export default Chart;
