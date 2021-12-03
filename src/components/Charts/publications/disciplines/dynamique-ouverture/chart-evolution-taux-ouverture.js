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

import customComments from '../../../../../utils/chartComments';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import {
  capitalize,
  getCSSValue,
  getObservationLabel,
  withDomain,
} from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import WrapperChart from '../../../../WrapperChart';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

highchartsMore(Highcharts);
highchartsDumbbell(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

const Chart = ({ hasFooter, hasComments, id, domain }) => {
  const intl = useIntl();
  const chartRef = useRef();
  const [sort, setSort] = useState('sort-open-access');
  const [optionsGraph, setOptionsGraph] = useState(null);
  const [chartComments, setChartComments] = useState('');
  const { observationSnaps, lastObservationSnap } = useGlobals();
  const { data, isLoading, isError } = useGetData(observationSnaps, domain);
  const idWithDomain = withDomain(id, domain);
  const orangeSoft75 = getCSSValue('--orange-soft-75');
  const orangeSoft100 = getCSSValue('--orange-soft-100');
  const orangeSoft125 = getCSSValue('--orange-soft-125');
  const orangeSoft175 = getCSSValue('--orange-soft-175');

  useEffect(() => {
    let newData = [];
    const series = [];

    const dataHist = data.dataHist ? data.dataHist : [];
    if (dataHist && dataHist.length > 0) {
      const dates = dataHist[0].data.map((item) => item.name);
      const serieLength = dataHist[0]?.data.length - 1;
      if (sort === 'sort-progression') {
        newData = dataHist.sort((a, b) => {
          const minA = a.data[0].y;
          const maxA = a.data[serieLength].y;
          const minB = b.data[0].y;
          const maxB = b.data[serieLength].y;
          return maxB - minB - (maxA - minA);
        });
      } else {
        newData = dataHist.sort(
          (a, b) => b.data[serieLength].y - a.data[serieLength].y,
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
            name: capitalize(
              intl.formatMessage({
                id: `app.discipline.${item.name
                  .replace(/\n/g, '')
                  .replace('  ', ' ')}`,
              }),
            ),
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

      setOptionsGraph(
        chartOptions[id].getOptions(withDomain(id, domain), intl, series),
      );
    }
  }, [
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

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl));
  }, [data, idWithDomain, intl]);

  return (
    <WrapperChart
      chartRef={chartRef}
      domain={domain}
      hasComments={false}
      hasFooter={hasFooter}
      id={id}
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
        id={idWithDomain}
        highcharts={Highcharts}
        options={optionsGraph}
        ref={chartRef}
      />
      {hasComments && <GraphComments comments={chartComments} />}
    </WrapperChart>
  );
};

Chart.defaultProps = {
  domain: '',
  hasComments: true,
  hasFooter: true,
  id: 'publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture',
};
Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
