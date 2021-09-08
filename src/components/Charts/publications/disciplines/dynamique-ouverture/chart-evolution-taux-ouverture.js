/* eslint-disable react/no-this-in-sfc */
import { Toggle } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import highchartsDumbbell from 'highcharts/modules/dumbbell';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import {
  orangesoft75,
  orangesoft100,
  orangesoft125,
  orangesoft175,
} from '../../../../../style/colours.module.scss';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { withDomain } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data';

highchartsMore(Highcharts);
highchartsDumbbell(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, id, domain }) => {
  const intl = useIntl();
  const chartRef = useRef();
  const [isActive, setIsActive] = useState(false);
  const [optionsGraph, setOptionsGraph] = useState(null);
  const { observationSnaps, lastObservationSnap } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationSnaps, domain);
  const idWithDomain = withDomain(id, domain);

  useEffect(() => {
    const series = [];

    if (data && data.length > 0) {
      const dates = data[0].data.map((item) => item.name);
      // tri par progression si isActive
      if (isActive) {
        data.sort((a, b) => {
          const minA = a.data[0].y;
          const maxA = a.data[data[0].data.length - 1].y;
          const minB = b.data[0].y;
          const maxB = b.data[data[0].data.length - 1].y;
          return maxB - minB - (maxA - minA);
        });
      } else {
        // sinon, tri par valeur max de la dernière année
        data.sort(
          (a, b) => b.data[data[0].data.length - 1].y
            - a.data[data[0].data.length - 1].y,
        );
      }
      for (let index = 1; index < dates.length + 1; index += 1) {
        let lowColor = '';
        let lineColor = '';
        let fillColor = '';
        let radius = 7;
        let showInLegend = true;
        const delta = parseInt(lastObservationSnap.substr(0, 4), 10)
          - parseInt(dates[index - 1].substr(0, 4), 10);
        // eslint-disable-next-line default-case
        switch (delta) {
        case 3:
          lowColor = orangesoft75;
          fillColor = lowColor;
          lineColor = 'white';
          radius = 7;
          showInLegend = true;
          break;
        case 2:
          lowColor = orangesoft125;
          fillColor = lowColor;
          lineColor = 'white';
          radius = 7;
          showInLegend = true;
          break;
        case 1:
          lowColor = orangesoft175;
          lineColor = lowColor;
          lineColor = 'white';
          radius = 7;
          showInLegend = true;
          break;
        case 0:
          lowColor = orangesoft100;
          lineColor = lowColor;
          fillColor = 'white';
          radius = 8;
          showInLegend = false;
          break;
        }
        series.push({
          name: dates[index - 1],
          data: data.map((item) => ({
            name: item.name,
            low: item.data.find((el) => el.name === dates[index - 1])?.y,
            high:
              item.data.find((el) => el.name === dates[index])?.y
              || item.data.find((el) => el.name === dates[index - 1])?.y,
          })),
          lowColor,
          showInLegend,
          color: lowColor,
          dashStyle: 'ShortDot',
          marker: {
            symbol: 'circle',
            radius,
            lineColor,
            fillColor,
          },
        });
      }
      series.push({
        type: 'scatter',
        name: lastObservationSnap,
        marker: {
          radius: 8,
          fillColor: 'white',
          symbol: 'circle',
          lineColor: orangesoft100,
        },
      });

      if (!optionsGraph) {
        setOptionsGraph(
          chartOptions[id].getOptions(idWithDomain, intl, series),
        );
      }
    }
  }, [
    data,
    id,
    idWithDomain,
    intl,
    isActive,
    lastObservationSnap,
    optionsGraph,
  ]);

  return (
    <WrapperChart
      id={id}
      idWithDomain={idWithDomain}
      isLoading={isLoading || !data || data.length <= 0}
      isError={isError}
      chartRef={chartRef}
      graphComments={graphComments}
      graphFooter={graphFooter}
    >
      <Toggle
        isChecked={isActive}
        onChange={() => setIsActive(!isActive)}
        label={intl.formatMessage({ id: `${idWithDomain}.toggle-label` })}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
        id={idWithDomain}
      />
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  id: 'publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
