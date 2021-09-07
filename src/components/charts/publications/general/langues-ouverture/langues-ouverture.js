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
  discipline100,
  discipline125,
  discipline150,
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
  const chartRef = useRef();
  const [isActive, setIsActive] = useState(false);
  const [dates, setDates] = useState([]);
  const { lastObservationSnap } = useGlobals();
  const { data, isLoading, isError } = useGetData(lastObservationSnap, domain);
  const intl = useIntl();
  const idWithDomain = withDomain(id, domain);
  const series = [];

  useEffect(() => {
    if (data && data.length > 0 && !dates.length) {
      setDates(data[0].data.map((item) => item.name));
    }
  }, [data, dates.length]);

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

  for (let index = 1; index < dates.length; index += 1) {
    let lowColor = '';
    let lineColor = '';
    // eslint-disable-next-line default-case
    switch (index) {
    case 1:
      lowColor = discipline100;
      lineColor = '#fff';
      break;
    case 2:
      lowColor = discipline125;
      lineColor = '#fff';
      break;
    case 3:
      lowColor = discipline150;
      lineColor = '#fff';
      break;
    }
    series.push({
      name: dates[index],
      data: data.map((item) => ({
        name: item.name,
        low: item.data.find((el) => el.name === dates[index - 1]).y,
        high: item.data.find((el) => el.name === dates[index]).y,
      })),
      lowColor,
      marker: {
        symbol: 'circle',
        radius: 8,
        lineColor,
      },
      dashStyle: 'ShortDot',
      color: lowColor,
    });
  }
  series.push({
    name: lastObservationSnap,
    color: '#000',
  });

  const optionsGraph = chartOptions[id].getOptions(idWithDomain, intl, series);

  return (
    <WrapperChart
      id={id}
      isLoading={isLoading || !data || data.length <= 0}
      isError={isError}
      idWithDomain={idWithDomain}
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
        id={id}
      />
    </WrapperChart>
  );
};

Chart.defaultProps = {
  graphFooter: true,
  graphComments: true,
  id: 'publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture',
  domain: 'health',
};
Chart.propTypes = {
  graphFooter: PropTypes.bool,
  graphComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
