import {
  archiveouverte100,
  bluedark75,
  discipline100,
  discipline125,
  editeurplateforme100,
  g800,
} from '../style/colours.module.scss';
import { cleanNumber, getPercentageYAxis } from './helpers';

/**
 *
 * @param graphId
 * @param intl
 * @returns {{exporting:
 * {chartOptions: {legend: {enabled: boolean}, subtitle: {text: *}, title: {text: *}},
 * buttons: {contextButton: {enabled: boolean}}, filename: *},
 * credits: {enabled: boolean},
 * responsive: {rules: [{chartOptions: {legend: {layout: string, verticalAlign: string, align: string}},
 * condition: {maxWidth: number}}]}, tooltip: {headerFormat: string, pointFormat: *},
 * title: {style: {color: string, fontSize: string, fontWeight: string}, text: *, align: string},
 * chart: {backgroundColor: string}
 * }}
 */
export function getGraphOptions(graphId, intl) {
  return {
    chart: {
      backgroundColor: 'var(--w-g750)',
    },
    title: { text: '' },
    tooltip: {
      headerFormat: '',
      pointFormat: intl.formatMessage({ id: `${graphId}.tooltip` }),
    },
    credits: { enabled: false },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 700,
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        },
      ],
    },
    exporting: {
      buttons: {
        contextButton: {
          enabled: true,
        },
      },
      chartOptions: {
        legend: {
          enabled: true,
        },
        title: {
          text: intl.formatMessage({ id: `${graphId}.title` }),
        },
        subtitle: {
          text: intl.formatMessage({ id: `${graphId}.source` }),
        },
      },
      enabled: false,
      filename: intl.formatMessage({ id: `${graphId}.title` }),
    },
  };
}

export const chartOptions = {
  'publi.publishers.couts-publication.chart-distribution-par-annee': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);

      options.chart = {
        type: 'areasplinerange',
        inverted: true,
      };
      options.xAxis = {
        title: { text: intl.formatMessage({ id: `${id}.xAxis` }) },
        reversed: false,
        labels: {
          // eslint-disable-next-line
          formatter: function () {
            return this.axis.defaultLabelFormatter.call(this).concat(' €');
          },
        },
      };
      options.yAxis = {
        categories,
        min: 0,
        max: categories && categories.length - 1,
      };
      options.plotOptions = {
        areasplinerange: {
          marker: {
            enabled: false,
          },
          // pointStart: xi[0]
        },
        scatter: {
          lineWidth: 2,
          zIndex: 1,
          marker: {
            fillColor: 'white',
            symbol: 'circle',
            lineWidth: 3,
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.publishers.politiques-ouverture.chart-classement': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'bar';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.legend = {
        title: {
          text: intl.formatMessage({ id: `${id}.legend` }),
        },
      };
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            enabled: false,
            // eslint-disable-next-line
            formatter: function () {
              // eslint-disable-next-line
              return this.y.toFixed(1).concat(' %');
            },
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.disciplines.voies-ouverture.chart-repartition-publications': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'bar';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.legend = {
        title: {
          text: intl.formatMessage({ id: `${id}.legend` }),
        },
      };
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            // eslint-disable-next-line
            formatter: function () {
              // eslint-disable-next-line
              return this.y.toFixed(1).concat(' %');
            },
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.disciplines.voies-ouverture.chart-evolution-comparaison-types-hebergement':
    {
      getOptions: (id, intl, data) => {
        const options = getGraphOptions(id, intl);

        options.chart.type = 'bubble';
        options.chart.zoomType = 'xy';
        options.series = data.bubbleGraph;
        options.xAxis = {
          gridLineDashStyle: 'dash',
          gridLineWidth: 1,
          endOnTick: false,
          min: 0,
          max: 109,
          title: { text: intl.formatMessage({ id: `${id}.xAxis` }) },
          labels: {
            // eslint-disable-next-line
            formatter: function () {
              return this.axis.defaultLabelFormatter.call(this).concat(' %');
            },
          },
        };
        options.yAxis = {
          gridLineDashStyle: 'dash',
          gridLineWidth: 1,
          endOnTick: false,
          min: 0,
          max: 120,
          title: { text: intl.formatMessage({ id: `${id}.yAxis` }) },
          labels: {
            // eslint-disable-next-line
            formatter: function () {
              return this.axis.defaultLabelFormatter.call(this).concat(' %');
            },
          },
        };
        options.legend = {
          enabled: false,
        };
        options.plotOptions = {
          bubble: {
            dataLabels: {
              style: {
                textOutline: 'none',
              },
            },
            minSize: 30,
            maxSize: 80,
          },
          series: {
            dataLabels: {
              enabled: true,
              allowOverlap: true,
              format: '{point.discipline}',
              filter: {
                property: 'z',
                operator: '>',
                value: '0.1',
              },
            },
          },
        };

        options.annotations = [
          {
            labels: [
              {
                point: {
                  x: 100,
                  y: 100,
                  xAxis: 0,
                  yAxis: 0,
                },
                text: intl.formatMessage({
                  id: 'app.publishers.objectif-science-ouverte',
                }),
              },
            ],
            draggable: '',
            labelOptions: {
              useHTML: true,
              borderRadius: 0,
              borderWidth: 0,
              backgroundColor: 'var(--blue-soft-100)',
            },
          },
        ];

        return options;
      },
    },
  'publi.affiliations.pays.chart-classement-pays': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'bar';
      options.xAxis = { categories };
      options.yAxis = getPercentageYAxis();
      options.legend = {
        title: {
          text: intl.formatMessage({ id: `${id}.legend` }),
        },
      };
      options.plotOptions = {
        bar: {
          dataLabels: {
            enabled: true,
            // eslint-disable-next-line
            formatter: function () {
              // eslint-disable-next-line
              return this.y.toFixed(1).concat(' %');
            },
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.publishers.type-ouverture.chart-evolution-repartition': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'area';
      options.yAxis = getPercentageYAxis(false);
      options.xAxis = {
        categories,
        tickmarkPlacement: 'on',
        title: {
          enabled: false,
        },
      };
      options.plotOptions = {
        area: {
          stacking: 'normal',
          lineColor: '#fff',
          lineWidth: 3,
          marker: {
            lineWidth: 1,
            lineColor: '#fff',
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.publishers.type-ouverture.chart-repartition-modeles': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.series = [
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
                format: '<b>{point.name}</b><br>{point.value:.0f} %',
                align: 'left',
                verticalAlign: 'top',
                style: {
                  fontSize: '15px',
                  fontWeight: 'bold',
                },
              },
            },
          ],
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            format: '{point.name}<br>{point.value:.0f} %',
            rotationMode: 'auto',
            filter: {
              property: 'value',
              operator: '>',
              value: '0.1',
            },
          },
          data,
        },
      ];

      return options;
    },
  },
  'publi.general.dynamique-ouverture.chart-taux-ouverture': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'bar';
      options.colors = [discipline100];
      options.yAxis = { visible: false, min: 0, max: 100 };
      options.plotOptions = {
        bar: {
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} %',
            style: {
              color: g800,
              fontSize: '20px',
              fontWeight: 'bold',
            },
          },
        },
      };
      options.xAxis = {
        type: 'category',
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            color: 'var(--g800)',
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      };
      options.series = [
        {
          data,
          showInLegend: false,
        },
      ];

      return options;
    },
  },
  'publi.general.dynamique-ouverture.chart-evolution-proportion': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'spline';
      options.xAxis = {
        title: { text: intl.formatMessage({ id: `${id}.xAxis` }) },
      };
      options.yAxis = getPercentageYAxis();
      options.legend = { verticalAlign: 'top' };
      options.plotOptions = { series: { pointStart: 2013 } };
      options.series = data;

      return options;
    },
  },
  'publi.general.voies-ouverture.chart-repartition-taux': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'column';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.legend = {
        title: {
          text: intl.formatMessage({ id: `${id}.legend` }),
        },
      };
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            // eslint-disable-next-line
            formatter: function () {
              // eslint-disable-next-line
              return this.y.toFixed(1).concat(' %');
            },
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.general.voies-ouverture.chart-evolution-taux': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'area';
      options.xAxis = {
        categories,
        tickmarkPlacement: 'on',
        title: {
          enabled: false,
        },
      };
      options.yAxis = getPercentageYAxis();
      options.legend = {
        title: {
          text: intl.formatMessage({ id: `${id}.legend` }),
        },
      };
      options.plotOptions = {
        area: {
          stacking: 'normal',
          lineColor: '#fff',
          lineWidth: 3,
          marker: {
            lineWidth: 1,
            lineColor: '#fff',
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.general.voies-ouverture.chart-repartition-publications': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.series = [
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
                format: '<b>{point.name}</b><br>{point.percentage:.0f} %',
                align: 'left',
                verticalAlign: 'top',
                style: {
                  fontSize: '15px',
                  fontWeight: 'bold',
                },
              },
            },
          ],
          data,
        },
      ];

      return options;
    },
  },
  'publi.general.genres-ouverture.chart-repartition-genres': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.series = [
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
          data,
        },
      ];

      return options;
    },
  },
  'publi.general.langues-ouverture.chart-repartition-publications': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.series = [
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
          data,
        },
      ];

      return options;
    },
  },
  'publi.disciplines.langues-ouverture.chart-repartition-publications': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.series = [
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
          data,
        },
      ];

      return options;
    },
  },
  'publi.general.impact-financement.chart-taux-ouverture': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'column';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.plotOptions = {
        column: {
          dataLabels: {
            enabled: true,
            // eslint-disable-next-line
            formatter: function () {
              // eslint-disable-next-line
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.general.impact-financement.chart-repartition-financements': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.series = [
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
                  textOutline: 'none',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  color: '#fff',
                },
              },
            },
          ],
          data,
        },
      ];

      return options;
    },
  },
  'publi.affiliations.dynamique-ouverture.chart-evolution-proportion': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'spline';
      options.xAxis = {
        title: { text: intl.formatMessage({ id: `${id}.xAxis` }) },
      };
      options.yAxis = getPercentageYAxis();
      options.legend = { verticalAlign: 'top' };
      options.plotOptions = { series: { pointStart: 2013 } };
      options.series = data;

      return options;
    },
  },
  'publi.affiliations.pays.chart-taux-rang-utile': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'column';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.legend = {
        title: {
          text: intl.formatMessage({ id: `${id}.legend` }),
        },
      };
      options.plotOptions = {
        column: {
          dataLabels: {
            enabled: true,
            // eslint-disable-next-line
            formatter: function () {
              // eslint-disable-next-line
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.publishers.dynamique-ouverture.chart-taux-ouverture': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'bar';
      options.colors = [editeurplateforme100];
      options.yAxis = { visible: false, min: 0, max: 100 };
      options.plotOptions = {
        bar: {
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} %',
            style: {
              color: g800,
              fontSize: '20px',
              fontWeight: 'bold',
            },
          },
        },
      };
      options.xAxis = {
        type: 'category',
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            color: 'var(--g800)',
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      };
      options.series = [
        {
          data,
          showInLegend: false,
        },
      ];

      return options;
    },
  },
  'publi.publishers.dynamique-ouverture.chart-evolution-proportion': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'spline';
      options.yAxis = getPercentageYAxis();
      options.xAxis = { title: { text: 'Années de publication' } };
      options.legend = { verticalAlign: 'top' };
      options.plotOptions = { series: { pointStart: 2013 } };
      options.series = data;

      return options;
    },
  },
  'publi.affiliations.dynamique-ouverture.chart-taux-ouverture': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'bar';
      options.colors = [discipline100];
      options.yAxis = { visible: false, min: 0, max: 100 };
      options.plotOptions = {
        bar: {
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f}%',
            style: {
              color: g800,
              fontSize: '20px',
              fontWeight: 'bold',
            },
          },
        },
      };
      options.xAxis = {
        type: 'category',
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            color: 'var(--g800)',
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      };
      options.series = [
        {
          data,
          showInLegend: false,
        },
      ];

      return options;
    },
  },
  'publi.publishers.politiques-ouverture.chart-comparaison': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'bubble';
      options.chart.zoomType = 'xy';
      options.series = data;
      options.xAxis = {
        min: 0,
        max: 110,
        title: { text: intl.formatMessage({ id: `${id}.xAxis` }) },
        labels: {
          // eslint-disable-next-line
          formatter: function () {
            return this.axis.defaultLabelFormatter.call(this).concat(' %');
          },
        },
      };
      options.yAxis = {
        min: 0,
        max: 110,
        title: { text: intl.formatMessage({ id: `${id}.yAxis` }) },
        labels: {
          // eslint-disable-next-line
          formatter: function () {
            return this.axis.defaultLabelFormatter.call(this).concat(' %');
          },
        },
      };
      options.legend = {
        enabled: false,
      };
      options.plotOptions = {
        series: {
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            format: '{point.publisher}',
            filter: {
              property: 'z',
              operator: '>',
              value: '0.1',
            },
          },
        },
      };

      return options;
    },
  },
  'publi.disciplines.dynamique-ouverture.chart-taux-ouverture': {
    getOptions: (id, intl, graph) => {
      const options = getGraphOptions(id, intl);
      const { data, name } = graph;
      options.chart.type = 'column';

      options.xAxis = {
        type: 'category',
        categories: data.map((el) => el.name),
        labels: {
          style: {
            color: 'var(--g800)',
            fontSize: '14px',
          },
        },
      };
      options.yAxis = getPercentageYAxis();

      options.series = [
        {
          name: intl.formatMessage({ id: `app.discipline.${name}` }),
          color: discipline125,
          data: data.map((el, i) => ({
            name: el.name,
            y: el.y,
            y_abs: el.y_abs,
            y_tot: el.y_tot,
            color: i === data.length - 1 ? discipline100 : discipline125,
          })),
        },
      ];

      return options;
    },
  },
  'publi.publishers.repartition-licences.chart-repartition': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.series = [
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
                format: '<b>{point.name}</b><br>{point.y_perc:.0f} %',
                align: 'left',
                verticalAlign: 'top',
                style: {
                  textOutline: 'none',
                  fontSize: '15px',
                  fontWeight: 'bold',
                },
              },
            },
          ],
          data,
        },
      ];

      return options;
    },
  },
  'publi.publishers.repartition-licences.chart-classement': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'bar';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis(false);
      options.legend = {
        title: {
          text: intl.formatMessage({ id: `${id}.legend` }),
        },
      };
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            // eslint-disable-next-line
            formatter: function () {
              // eslint-disable-next-line
              return this.y.toFixed(1).concat(' %');
            },
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.publishers.couts-publication.chart-depenses-estimees': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'column';
      options.xAxis = {
        categories,
      };
      options.yAxis = {
        stackLabels: {
          enabled: true,
          // eslint-disable-next-line
          formatter: function () {
            // eslint-disable-next-line
            return `${cleanNumber(this.total)} €`;
          },
          style: {
            fontWeight: 'bold',
          },
        },
        labels: {
          // eslint-disable-next-line
          formatter: function () {
            // eslint-disable-next-line
            return this.axis.defaultLabelFormatter.call(this).concat(' €');
          },
        },
      };
      options.series = data;
      options.legend = {
        title: {
          text: intl.formatMessage({ id: `${id}.legend` }),
        },
      };
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            // eslint-disable-next-line
            formatter: function () {
              // eslint-disable-next-line
              return cleanNumber(this.y).concat(' €');
            },
          },
        },
      };

      return options;
    },
  },
  'publi.publishers.couts-publication.chart-distribution': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'column';
      options.chart.type = 'areaspline'; // 'column' dans la maquette
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: `${id}.xAxis` }) },
        labels: {
          // eslint-disable-next-line
          formatter: function () {
            return this.axis.defaultLabelFormatter.call(this).concat(' €');
          },
        },
      };
      options.yAxis = {
        title: { text: intl.formatMessage({ id: `${id}.yAxis` }) },
      };
      options.series = data;
      options.legend = {
        title: {
          text: intl.formatMessage({ id: `${id}.legend` }),
        },
      };
      options.plotOptions = {
        series: {
          pointPadding: 0,
          groupPadding: 0,
          borderWidth: 0,
          shadow: false,
        },
        column: {
          stacking: false,
          dataLabels: {
            enabled: false,
          },
        },
      };

      return options;
    },
  },
  'publi.repositories.dynamique-ouverture.chart-evolution-proportion': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'spline';
      options.yAxis = getPercentageYAxis();
      options.xAxis = { title: { text: 'Années de publication' } };
      options.legend = { verticalAlign: 'top' };
      options.plotOptions = { series: { pointStart: 2013 } };
      options.series = data;

      return options;
    },
  },
  'publi.repositories.dynamique-ouverture.chart-taux-ouverture': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'bar';
      options.colors = [archiveouverte100];
      options.yAxis = { visible: false, min: 0, max: 100 };
      options.plotOptions = {
        bar: {
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} %',
            style: {
              color: g800,
              fontSize: '20px',
              fontWeight: 'bold',
            },
          },
        },
      };
      options.xAxis = {
        type: 'category',
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            color: 'var(--g800)',
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      };
      options.series = [
        {
          data,
          showInLegend: false,
        },
      ];

      return options;
    },
  },
  'publi.repositories.plus-utilisees.chart-nombre-documents': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'bar';
      options.chart.height = '700px';
      options.colors = [archiveouverte100];
      options.yAxis = { visible: false };
      options.xAxis = {
        type: 'category',
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            color: 'var(--g800)',
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      };
      options.series = [
        {
          data,
          showInLegend: false,
        },
      ];

      return options;
    },
  },
  'publi.repositories.dynamique-depot.chart-nombre-documents-depots': {
    getOptions: (id, intl, graph) => {
      const options = getGraphOptions(id, intl);
      const { data, color, name } = graph;
      options.chart.type = 'column';
      options.xAxis = {
        type: 'category',
        categories: graph.data.map((el) => el.name),
        labels: {
          style: {
            color: 'var(--g800)',
            fontSize: '14px',
          },
        },
      };
      options.yAxis = {
        title: {
          enabled: false,
        },
      };
      options.series = [
        {
          data,
          color,
          name,
        },
      ];
      return options;
    },
  },
  'publi.repositories.dynamique-hal.chart-couverture-hal': {
    getOptions: (id, intl, publicationYears, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'column';
      options.xAxis = {
        publicationYears,
      };
      options.legend = {
        title: {
          text: intl.formatMessage({ id: `${id}.legend` }),
        },
      };
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            style: {
              textOutline: 'none',
            },
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.publishers.poids-revues.chart-repartition': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);

      options.series = data;
      options.chart.type = 'column';
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            // eslint-disable-next-line
            formatter: function () {
              // eslint-disable-next-line
              return this.y.toFixed(1).concat(' %');
            },
          },
        },
      };
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis(false, 3);
      options.legend = { enabled: false };

      return options;
    },
  },
  'publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.chart = {
        type: 'dumbbell',
        inverted: true,
        zoomType: 'x',
        height: '600px',
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.gridLineColor = 'var(--g500)';
      options.yAxis.gridLineDashStyle = 'dot';
      options.xAxis = {
        type: 'category',
        categories: data[0].data.map((el) => intl.formatMessage({ id: `app.discipline.${el.name}` })),
        labels: {
          style: {
            color: 'var(--g800)',
            fontSize: '14px',
          },
        },
      };

      options.plotOptions = {
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

      options.legend = {
        verticalAlign: 'top',
        align: 'left',
        title: {
          text: intl.formatMessage({ id: `${id}.legend` }),
          style: {
            color: bluedark75,
            fontSize: '14px',
          },
        },
      };

      options.series = data;

      options.tooltip = {
        shared: true,
      };

      return options;
    },
  },
};
