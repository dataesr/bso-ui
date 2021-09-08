/* eslint-disable react/no-this-in-sfc */
import { Toggle } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import highchartsDumbbell from 'highcharts/modules/dumbbell';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import {
  bluedark75,
  orangesoft75,
  orangesoft100,
  orangesoft125,
  orangesoft175,
} from '../../../../../style/colours.module.scss';
import { getGraphOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import { getPercentageYAxis } from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import Loader from '../../../../Loader';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data';

highchartsMore(Highcharts);
highchartsDumbbell(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ graphFooter, graphComments, domain, id }) => {
  const intl = useIntl();
  const chartRef = useRef();
  const graphId = 'app.sante-publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture';
  const [isActive, setIsActive] = useState(false);
  const { observationSnaps } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationSnaps, domain);

  if (isLoading || !data || data.length <= 0) {
    return <Loader />;
  }
  if (isError) {
    return <>Error</>;
  }

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
      (a, b) => b.data[data[0].data.length - 1].y - a.data[data[0].data.length - 1].y,
    );
  }
  const graphOptions = getGraphOptions(graphId, intl);

  graphOptions.chart = {
    type: 'dumbbell',
    inverted: true,
    zoomType: 'x',
    height: '600px',
  };

  const dates = data[0].data.map((item) => item.name);

  graphOptions.yAxis = getPercentageYAxis();
  graphOptions.yAxis.gridLineColor = 'var(--g500)';
  graphOptions.yAxis.gridLineDashStyle = 'dot';

  graphOptions.xAxis = {
    type: 'category',
    categories: data.map((el) => intl.formatMessage({ id: `app.discipline.${el.name}` })),
    labels: {
      style: {
        color: 'var(--g800)',
        fontSize: '14px',
      },
    },
  };

  graphOptions.plotOptions = {
    dumbbell: {
      grouping: false,
    },
    series: {
      marker: {
        lineWidth: 2,
        fillColor: '#000',
      },
    },
  };

  graphOptions.legend = {
    verticalAlign: 'top',
    align: 'left',
    title: {
      text: intl.formatMessage({ id: `${graphId}.legend` }),
      style: {
        color: bluedark75,
        fontSize: '14px',
      },
    },
  };

  const series = [];
  for (let index = 1; index <= dates.length; index += 1) {
    let lowColor = '';
    let lineColor = 'white';
    let fillColor = '';
    // eslint-disable-next-line default-case
    switch (index) {
    case 1:
      lowColor = orangesoft75;
      fillColor = lowColor;
      break;
    case 2:
      lowColor = orangesoft125;
      fillColor = lowColor;
      break;
    case 3:
      lowColor = orangesoft175;
      lineColor = lowColor;
      break;
    case 4:
      lowColor = orangesoft100;
      lineColor = lowColor;
      fillColor = 'white';
      break;
    }
    series.push({
      name: dates[index],
      data: data.map((item) => ({
        name: item.name,
        low: item.data.find((el) => el.name === dates[index - 1])?.y || 70,
        high: item.data.find((el) => el.name === dates[index])?.y || 70,
      })),
      lowColor,
      marker: {
        symbol: 'circle',
        radius: 8,
        lineColor,
        fillColor,
      },
      dashStyle: 'ShortDot',
      color: lowColor,
    });
  }
  graphOptions.series = series;

  graphOptions.tooltip = {
    shared: true,
  };

  return (
    <WrapperChart
      id={id}
      chartRef={chartRef}
      graphComments={graphComments}
      graphFooter={graphFooter}
    >
      <Toggle
        isChecked={isActive}
        onChange={() => setIsActive(!isActive)}
        label={intl.formatMessage({ id: `${graphId}.toggle-label` })}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={graphOptions}
        ref={chartRef}
        id={id}
      />
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  id: 'app.national-publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture',
  domain: '',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
