/* eslint-disable react/no-this-in-sfc */
import { Radio, RadioGroup } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import highchartsDumbbell from 'highcharts/modules/dumbbell';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import {
  getCSSValue,
  getObservationLabel,
  withDomain,
} from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import useGetData from './get-data';

highchartsMore(Highcharts);
highchartsDumbbell(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ hasFooter, hasComments, id, domain }) => {
  const intl = useIntl();
  const chartRef = useRef();
  const [sort, setSort] = useState('tri-open-access');
  const [optionsGraph, setOptionsGraph] = useState(null);
  const [activeData, setActiveData] = useState([]);
  const { observationSnaps, lastObservationSnap } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationSnaps, domain);
  const idWithDomain = withDomain(id, domain);
  const orangeSoft75 = getCSSValue('--orange-soft-75');
  const orangeSoft100 = getCSSValue('--orange-soft-100');
  const orangeSoft125 = getCSSValue('--orange-soft-125');
  const orangeSoft175 = getCSSValue('--orange-soft-175');

  useEffect(() => {
    let newData = null;
    const series = [];

    if (data && data.length > 0) {
      const dates = data[0].data.map((item) => item.name);
      // tri par progression si isActive
      if (sort === 'tri-progression') {
        newData = [...data].sort((a, b) => {
          const minA = a.data[0].y;
          const maxA = a.data[data[0].data.length - 1].y;
          const minB = b.data[0].y;
          const maxB = b.data[data[0].data.length - 1].y;
          return maxB - minB - (maxA - minA);
        });
      } else {
        // sinon, tri par valeur max de la dernière année
        newData = [...data].sort(
          (a, b) => b.data[data[0].data.length - 1].y
            - a.data[data[0].data.length - 1].y,
        );
      }

      for (let index = 1; index < dates.length + 1; index += 1) {
        let lowColor = '';
        let lineColor = 'white';
        let fillColor = '';
        let radius = 7;
        let showInLegend = true;
        const delta = parseInt(lastObservationSnap.substr(0, 4), 10)
          - parseInt(dates[index - 1].substr(0, 4), 10);
        // eslint-disable-next-line default-case
        switch (delta) {
        case 3:
          lowColor = orangeSoft75;
          fillColor = lowColor;
          break;
        case 2:
          lowColor = orangeSoft125;
          fillColor = lowColor;
          break;
        case 1:
          lowColor = orangeSoft175;
          fillColor = 'white';
          break;
        case 0:
          lowColor = orangeSoft100;
          lineColor = lowColor;
          fillColor = 'white';
          radius = 8;
          showInLegend = false;
          break;
        }
        series.push({
          name: dates[index - 1],
          data: newData.map((item) => ({
            name: intl.formatMessage({
              id: `app.discipline.${item.name
                .replace(/\n/g, '')
                .replace('  ', ' ')}`,
            }),
            bsoDomain: item.bsoDomain,
            low: item.data.find((el) => el.name === dates[index - 1])?.y,
            y_abs: item.data.find((el) => el.name === dates[index - 1])?.y_abs,
            y_tot: item.data.find((el) => el.name === dates[index - 1])?.y_tot,
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
        name: getObservationLabel(lastObservationSnap, intl),
        marker: {
          radius: 8,
          fillColor: 'white',
          symbol: 'circle',
          lineColor: orangeSoft100,
        },
      });
      const newDataCheck = newData.map((obj) => obj.name).join();
      const activeDataCheck = activeData.map((obj) => obj.name).join();

      if (activeDataCheck !== newDataCheck) {
        setActiveData(newData);
        setOptionsGraph(
          chartOptions[id].getOptions(withDomain(id, domain), intl, series),
        );
      }
    }
  }, [
    activeData,
    data,
    domain,
    id,
    idWithDomain,
    intl,
    lastObservationSnap,
    orangeSoft100,
    orangeSoft125,
    orangeSoft175,
    orangeSoft75,
    sort,
  ]);

  return (
    <WrapperChart
      id={id}
      domain={domain}
      isLoading={isLoading || !data || data.length <= 0}
      isError={isError}
      chartRef={chartRef}
      hasComments={hasComments}
      hasFooter={hasFooter}
    >
      <RadioGroup
        legend={intl.formatMessage({ id: 'app.publi.tri' })}
        isInline
        value={sort}
        onChange={(newValue) => {
          setSort(newValue);
        }}
        className='d-inline-block'
      >
        <Radio
          label={intl.formatMessage({ id: 'app.publi.tri-open-access' })}
          value='tri-open-access'
        />
        <Radio
          label={intl.formatMessage({ id: 'app.publi.tri-progression' })}
          value='tri-progression'
        />
      </RadioGroup>
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
  hasFooter: true,
  hasComments: true,
  id: 'publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture',
  domain: '',
};
Chart.propTypes = {
  hasFooter: PropTypes.bool,
  hasComments: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
  domain: PropTypes.oneOf(domains),
};

export default Chart;
