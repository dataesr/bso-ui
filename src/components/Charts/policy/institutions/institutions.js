import axios from 'axios';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import customComments from '../../../../utils/chartComments';
import { getGraphOptions } from '../../../../utils/chartOptions';
import {
  getCSSValue,
  getPercentageYAxis,
} from '../../../../utils/helpers';
import ChartWrapper from '../../../ChartWrapper';
import GraphComments from '../../graph-comments';

HCExporting(Highcharts);
HCExportingData(Highcharts);

const END_YEAR = new Date().getFullYear();
const OPENDATASOFT_LIMIT = 100;
const START_YEAR = 2016;

function Chart() {
  const [chartComments, setChartComments] = useState('');
  const [data, setData] = useState([]);
  const [options, setOptions] = useState();
  const intl = useIntl();
  const chartRef = useRef();
  const id = 'other.policy.open-science-policy';

  useEffect(() => {
    const getDataFromPage = async ({
      limit = OPENDATASOFT_LIMIT,
      offset = 0,
    } = {}) => {
      let url =
        'https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets';
      url += `/fr-esr-politiques-so-etablissements/records?limit=${limit}&offset=${offset}&order_by=uo_lib`;
      const response = await axios.get(url, {
        headers: { accept: 'application/json; charset=utf-8' },
      });
      return response?.data;
    };
    const getData = async () => {
      let allData = [];
      let count = 0;
      let offset = 0;
      do {
        // eslint-disable-next-line no-await-in-loop
        const results = await getDataFromPage({ offset });
        count = results.total_count;
        offset += OPENDATASOFT_LIMIT;
        allData = [...allData, ...results?.results];
      } while (allData.length < count);
      setData(allData);
    };
    getData();
  }, []);

  useEffect(() => {
    const years = [...Array(END_YEAR - START_YEAR + 1).keys()].map(
      (year) => year + START_YEAR,
    );
    const tmp = {};
    years.forEach((year) => {
      tmp[year] = { y: 0, y_percent: 0, y_tot: data.length, y_abs: 0 };
    });
    data.forEach((item) => {
      if (
        item?.premiere_annee_de_publication_annees_de_mises_a_jour_du_document_cadre
      ) {
        tmp[
          item.premiere_annee_de_publication_annees_de_mises_a_jour_du_document_cadre.split(
            ',',
          )[0]
        ].y_abs += 1;
      }
    });
    const series = {};
    Object.keys(tmp).forEach((year) => {
      const yAbs = Object.keys(tmp)
        .filter((key) => key <= year)
        .reduce((acc, curr) => acc + tmp[curr].y_abs, 0);
      series[year] = {
        name: year,
        total: data.length,
        y_abs: yAbs,
        y_tot: data.length,
        y: (yAbs / data.length) * 100,
        y_percent: (yAbs / data.length) * 100,
      };
    });
    const optionsTmp = getGraphOptions({ id, intl });
    optionsTmp.xAxis.tickInterval = 1;
    optionsTmp.xAxis.plotBands = [
      {
        color: getCSSValue('--ouvrir-la-science-green'),
        from: 2018,
        label: { text: 'PNSO 1' },
        to: 2021,
      },
      {
        color: getCSSValue('--ouvrir-la-science-yellow'),
        from: 2021,
        label: { text: 'PNSO 2' },
        to: END_YEAR,
      },
    ];
    optionsTmp.yAxis = { ...getPercentageYAxis(), max: 100 };
    optionsTmp.legend.enabled = true;
    optionsTmp.plotOptions = {
      series: {
        pointStart: START_YEAR,
      },
    };
    optionsTmp.series = [
      {
        color: getCSSValue('--ouvrir-la-science-blue'),
        data: Object.values(series),
        marker: { symbol: 'circle' },
        name: intl.formatMessage({
          id: 'other.policy.open-science-policy.legend-structures',
        }),
        tooltip: {
          pointFormat: intl.formatMessage({
            id: 'other.policy.open-science-policy.tooltip-structures',
          }),
        },
      },
    ];
    optionsTmp.exporting.chartOptions.legend.enabled = false;
    optionsTmp.tooltip.shared = true;
    setOptions(optionsTmp);
  }, [data, intl]);

  useEffect(() => {
    setChartComments(
      customComments(
        {
          comments: {},
          ctas: ['https://hal-lara.archives-ouvertes.fr/hal-04842977'],
        },
        id,
        intl,
      ),
    );
  }, [id, intl]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      date='2026-07-20'
      domain=''
      hasComments={false}
      id={id}
      isError={false}
      isLoading={false}
    >
      <HighchartsReact
        highcharts={Highcharts}
        id={id}
        options={options}
        ref={chartRef}
      />
      {chartComments && (
        <GraphComments comments={chartComments} hasFooter />
      )}
    </ChartWrapper>
  );
}

export default Chart;
