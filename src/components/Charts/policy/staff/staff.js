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
  const [chartCommentsStaff, setChartCommentsStaff] = useState('');
  const [data, setData] = useState([]);
  const [optionsStaff, setOptionsStaff] = useState();
  const intl = useIntl();
  const chartRef = useRef();
  const id = 'other.policy.open-science-policy';
  const idStaff = 'other.policy.open-science-policy-staff';

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
    const optionsTmpStaff = { ...optionsTmp };
    optionsTmpStaff.series = [
      {
        color: getCSSValue('--ouvrir-la-science-purple'),
        data: [
          {
            name: 2016,
            y: 3.9410879218,
            y_abs: 5210,
            y_tot: 132197,
            y_percent: 3.9410879218,
          },
          {
            name: 2017,
            y: 3.9410879218,
            y_abs: 5210,
            y_tot: 132197,
            y_percent: 3.9410879218,
          },
          {
            name: 2018,
            y: 4.0787612427,
            y_abs: 5392,
            y_tot: 132197,
            y_percent: 4.0787612427,
          },
          {
            name: 2019,
            y: 29.6292654145,
            y_abs: 39169,
            y_tot: 132197,
            y_percent: 29.6292654145,
          },
          {
            name: 2020,
            y: 31.43944265,
            y_abs: 41562,
            y_tot: 132197,
            y_percent: 31.43944265,
          },
          {
            name: 2021,
            y: 54.7970074964,
            y_abs: 72440,
            y_tot: 132197,
            y_percent: 54.7970074964,
          },
          {
            name: 2022,
            y: 71.4010151516,
            y_abs: 94390,
            y_tot: 132197,
            y_percent: 71.4010151516,
          },
          {
            name: 2023,
            y: 76.777839134,
            y_abs: 101498,
            y_tot: 132197,
            y_percent: 76.777839134,
          },
          {
            name: 2024,
            y: 85.3309833052,
            y_abs: 112805,
            y_tot: 132197,
            y_percent: 85.3309833052,
          },
          {
            name: 2025,
            y: 86.4815389154,
            y_abs: 114326,
            y_tot: 132197,
            y_percent: 86.4815389154,
          },
          {
            name: 2026,
            y: 87.5428338011,
            y_abs: 115729,
            y_tot: 132197,
            y_percent: 87.5428338011,
          },
        ],
        marker: { symbol: 'square' },
        name: intl.formatMessage({
          id: 'other.policy.open-science-policy.legend-researchers',
        }),
        tooltip: {
          pointFormat: intl.formatMessage({
            id: 'other.policy.open-science-policy.tooltip-employees',
          }),
        },
      },
    ];
    optionsTmpStaff.exporting.chartOptions.legend.enabled = false;
    optionsTmpStaff.tooltip.shared = true;
    setOptionsStaff(optionsTmpStaff);
  }, [data, intl]);

  useEffect(() => {
    setChartCommentsStaff(
      customComments(
        {
          comments: {
            first: optionsStaff?.series?.[0]?.data?.[2]?.y.toFixed(0),
            last: optionsStaff?.series?.[0]?.data?.[10]?.y.toFixed(0),
          },
        },
        idStaff,
        intl,
      ),
    );
  }, [id, idStaff, intl, optionsStaff]);

  return (
    <ChartWrapper
      chartRef={chartRef}
      date='2026-07-20'
      domain=''
      hasComments={false}
      id={idStaff}
      isError={false}
      isLoading={false}
    >
      <HighchartsReact
        highcharts={Highcharts}
        id={idStaff}
        options={optionsStaff}
        ref={chartRef}
      />
      {chartCommentsStaff && (
        <GraphComments comments={chartCommentsStaff} hasFooter />
      )}
    </ChartWrapper>
  );
}

export default Chart;
