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
import useGetData from './get-data-dumbbell';

highchartsMore(Highcharts);
highchartsDumbbell(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ domain, hasComments, hasFooter, id }) => {
  const intl = useIntl();
  const chartRef = useRef();
  const [sort, setSort] = useState('sort-open-access');
  const [optionsGraph, setOptionsGraph] = useState(null);
  const [activeData, setActiveData] = useState([]);
  const { lastObservationSnap, observationSnaps } = useGlobals();
  const { data, isError, isLoading } = useGetData(observationSnaps, domain);
  const idWithDomain = withDomain(id, domain);

  useEffect(() => {
    let newData = null;
    const series = [];

    if (data && data.length > 0) {
      const dates = data[0].data.map((item) => item.name);
      if (sort === 'sort-progression') {
        newData = [...data].sort((a, b) => {
          const minA = a.data[0].y;
          const maxA = a.data[data[0].data.length - 1].y;
          const minB = b.data[0].y;
          const maxB = b.data[data[0].data.length - 1].y;
          return maxB - minB - (maxA - minA);
        });
      } else {
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
        case 4:
          lowColor = getCSSValue('--affiliations-etablissements-50');
          fillColor = lowColor;
          break;
        case 3:
          lowColor = getCSSValue('--affiliations-etablissements-75');
          fillColor = lowColor;
          break;
        case 2:
          lowColor = getCSSValue('--affiliations-etablissements-100');
          fillColor = lowColor;
          break;
        case 1:
          lowColor = getCSSValue('--affiliations-etablissements-125');
          fillColor = 'white';
          break;
        case 0:
          lowColor = getCSSValue('--affiliations-etablissements-150');
          lineColor = lowColor;
          fillColor = 'white';
          radius = 8;
          showInLegend = false;
          break;
        }
        series.push({
          name: dates[index - 1],
          data: newData.map((item) => ({
            name: item.name,
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
          lineColor: getCSSValue('--affiliations-etablissements-100'),
        },
      });

      const newDataCheck = newData.map((obj) => obj.name).join();
      const activeDataCheck = activeData.map((obj) => obj.name).join();

      if (activeDataCheck !== newDataCheck) {
        setActiveData(newData);
        setOptionsGraph(
          chartOptions[id].getOptions(idWithDomain, intl, series),
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
    optionsGraph,
    sort,
  ]);

  return (
    <WrapperChart
      chartRef={chartRef}
      domain={domain}
      hasComments={hasComments}
      hasFooter={hasFooter}
      id={id}
      idWithDomain={idWithDomain}
      isError={isError}
      isLoading={isLoading || !data || data.length <= 0}
    >
      <RadioGroup
        className='d-inline-block'
        isInline
        legend={intl.formatMessage({ id: 'app.publi.sort' })}
        onChange={(newValue) => setSort(newValue)}
        value={sort}
      >
        <Radio
          label={intl.formatMessage({ id: 'app.publi.sort-open-access' })}
          value='sort-open-access'
        />
        <Radio
          label={intl.formatMessage({ id: 'app.publi.sort-progression' })}
          value='sort-progression'
        />
      </RadioGroup>
      <HighchartsReact
        highcharts={Highcharts}
        id={idWithDomain}
        options={optionsGraph}
        ref={chartRef}
      />
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.affiliations.dynamique-ouverture.chart-evolution-taux',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
