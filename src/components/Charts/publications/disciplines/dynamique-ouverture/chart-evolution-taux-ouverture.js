/* eslint-disable react/require-default-props */
/* eslint-disable react/no-this-in-sfc */
import { Radio, RadioGroup } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import highchartsDumbbell from 'highcharts/modules/dumbbell';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import customComments from '../../../../../utils/chartComments';
import { chartOptions } from '../../../../../utils/chartOptions';
import { domains, graphIds } from '../../../../../utils/constants';
import {
  capitalize,
  cleanNumber,
  getCSSValue,
  getObservationLabel,
  getPublicationYearFromObservationSnap,
  withDomain,
} from '../../../../../utils/helpers';
import useGlobals from '../../../../../utils/Hooks/useGetGlobals';
import ChartWrapper from '../../../../ChartWrapper';
import GraphComments from '../../../graph-comments';
import useGetData from './get-data';

highchartsMore(Highcharts);
highchartsDumbbell(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

function Chart({
  domain = '',
  hasComments = true,
  hasFooter = true,
  id = 'publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture',
}) {
  const intl = useIntl();
  const chartRef = useRef();

  const [chartComments, setChartComments] = useState('');
  const [optionsGraph, setOptionsGraph] = useState(null);
  const [sort, setSort] = useState('sort-open-access');

  const { observationSnaps, lastObservationSnap } = useGlobals();
  const { data, isError, isLoading } = useGetData(observationSnaps, domain);
  const idWithDomain = withDomain(id, domain);

  useEffect(() => {
    let newData = [];
    const series = [];

    const dataHist = data?.dataHist || [];
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
      } else if (sort === 'sort-open-access') {
        newData = dataHist.sort(
          (a, b) => b.data[serieLength].y - a.data[serieLength].y,
        );
      } else {
        newData = dataHist.sort(
          (a, b) => b.data[serieLength].y_tot - a.data[serieLength].y_tot,
        );
      }

      for (let index = 1; index < dates.length + 1; index += 1) {
        let fillColor = '';
        let lineColor = 'white';
        let lowColor = '';
        let radius = 7;
        let showInLegend = true;
        const delta = parseInt(lastObservationSnap.substring(0, 4), 10)
          - parseInt(dates[index - 1].substring(0, 4), 10);
        switch (delta) {
        case 7:
          fillColor = getCSSValue('--orange-soft-25');
          lowColor = fillColor;
          break;
        case 6:
          fillColor = getCSSValue('--orange-soft-25');
          lowColor = fillColor;
          break;
        case 5:
          fillColor = getCSSValue('--orange-soft-50');
          lowColor = fillColor;
          break;
        case 4:
          fillColor = getCSSValue('--orange-soft-75');
          lowColor = fillColor;
          break;
        case 3:
          fillColor = getCSSValue('--orange-soft-125');
          lowColor = fillColor;
          break;
        case 2:
          fillColor = getCSSValue('--orange-soft-150');
          lowColor = fillColor;
          break;
        case 1:
          fillColor = getCSSValue('--orange-soft-175');
          lowColor = fillColor;
          break;
        case 0:
          fillColor = 'white';
          lineColor = getCSSValue('--orange-soft-100');
          lowColor = lineColor;
          radius = 8;
          showInLegend = false;
          break;
        default:
          fillColor = 'red';
          lowColor = fillColor;
          break;
        }
        series.push({
          name: dates[index - 1].replace('<br/>', ' - '),
          publicationYear: getPublicationYearFromObservationSnap(
            dates[index - 1],
          ),
          data: newData.map((item) => ({
            name: capitalize(
              intl.formatMessage({
                id: `app.discipline.${item.name
                  .replace(/\n/g, '')
                  .replace('  ', ' ')}`,
              }),
            )
              .concat('<br>(')
              .concat(intl.formatMessage({ id: 'app.effectif' }))
              .concat(' ')
              .concat(
                getPublicationYearFromObservationSnap(lastObservationSnap),
              )
              .concat(' = ')
              .concat(cleanNumber(item.data[item.data.length - 1].y_tot))
              .concat(')'),
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
          lineColor: getCSSValue('--orange-soft-100'),
        },
      });
      setOptionsGraph(chartOptions[id].getOptions(idWithDomain, intl, series));
    }
  }, [data, id, idWithDomain, intl, lastObservationSnap, sort]);

  useEffect(() => {
    setChartComments(customComments(data, idWithDomain, intl));
  }, [data, idWithDomain, intl]);

  return (
    <ChartWrapper
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
        <Radio
          label={`${intl.formatMessage({
            id: 'app.publi.sort-staff-in',
          })} ${getPublicationYearFromObservationSnap(lastObservationSnap)}`}
          value='sort-staff'
        />
      </RadioGroup>
      <HighchartsReact
        highcharts={Highcharts}
        id={idWithDomain}
        options={optionsGraph}
        ref={chartRef}
      />
      {hasComments && chartComments && (
        <GraphComments comments={chartComments} hasFooter={hasFooter} />
      )}
    </ChartWrapper>
  );
}

Chart.propTypes = {
  domain: PropTypes.oneOf(domains),
  hasComments: PropTypes.bool,
  hasFooter: PropTypes.bool,
  id: PropTypes.oneOf(graphIds),
};

export default Chart;
