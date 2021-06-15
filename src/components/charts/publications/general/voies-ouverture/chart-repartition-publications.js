import Highcharts from 'highcharts';
import treemapModule from 'highcharts/modules/treemap';
import HighchartsReact from 'highcharts-react-official';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import config from '../../../config';
import GraphComments from '../../../graph-comments';
import GraphFooter from '../../../graph-footer';
import useGetData from './get-data';

treemapModule(Highcharts);

const Chart = () => {
  const chartRef = useRef();
  const intl = useIntl();
  const graphId = 'app.sante-publi.general.voies-ouverture.chart-repartition-publications';
  const graphConfig = config.find((gf) => gf.id === graphId);
  const { observationDates, updateDate } = useGlobals();
  const { allData, isLoading, isError } = useGetData(observationDates[0] || 2020);

  if (isLoading) {
    return <>Loading...</>;
  }
  if (isError) {
    return <>Error 3</>;
  }

  const { dataGraph3 } = allData;

  const optionsGraph = {
    series: [
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
        data: dataGraph3,
      },
    ],
    title: {
      text: intl.formatMessage({ id: `${graphId}.title` }),
      align: 'left',
    },
  };

  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={graphId}
      />
      <GraphComments comments={intl.formatMessage({ id: `${graphId}.comments` })} />
      <GraphFooter
        date={updateDate}
        source={graphConfig.source}
        graphId={graphId}
      />
    </>
  );
};

export default Chart;
