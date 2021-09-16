import { cleanNumber, getCSSValue, getPercentageYAxis } from './helpers';

/**
 *
 * @param id
 * @param data
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
  const legend = intl.messages[`${graphId}.legend`] ? intl.formatMessage({ id: `${graphId}.legend` }) : '';
  const tooltip = intl.messages[`${graphId}.tooltip`] ? intl.formatMessage({ id: `${graphId}.tooltip` }) : '';
  const xAxis = intl.messages[`${graphId}.xAxis`] ? intl.formatMessage({ id: `${graphId}.xAxis` }) : '';
  const yAxis = intl.messages[`${graphId}.yAxis`] ? intl.formatMessage({ id: `${graphId}.yAxis` }) : '';
  const source = intl.messages[`${graphId}.source`] ? intl.formatMessage({ id: `${graphId}.source` }) : 'source';
  return {
    chart: {
      backgroundColor: getCSSValue('--white'),
    },
    title: { text: '' },
    tooltip: {
      headerFormat: '',
      pointFormat: tooltip,
    },
    credits: { enabled: true, text: intl.formatMessage({ id: 'app.credit' }) },
    xAxis: {
      title: { text: xAxis },
    },
    yAxis: {
      title: { text: yAxis },
    },
    legend: {
      title: {
        text: legend,
        style: {
          color: getCSSValue('--blue-dark-75'),
          fontSize: '14px',
        },
      },
    },
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
          text: source,
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.publishers.couts-publication.chart-distribution-par-annee.tooltip' });
      options.chart = {
        type: 'areasplinerange',
        inverted: true,
      };
      options.xAxis = {
        reversed: false,
        title: { text: intl.formatMessage({ id: 'app.publi.tarif-apc' }) },
        labels: {
          // eslint-disable-next-line
          formatter: function () {
            return this.axis.defaultLabelFormatter.call(this).concat(' €');
          },
        },
      };
      options.yAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
        min: 0,
        max: categories && categories.length - 1,
      };
      options.legend.title.text = intl.formatMessage({ id: 'app.publi.type-apc' });
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.publishers.politiques-ouverture.chart-classement.tooltip' });
      options.chart.type = 'bar';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({ id: 'app.publi.type-oa' });
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.disciplines.voies-ouverture.chart-repartition-publications.tooltip' });
      options.chart.type = 'bar';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({ id: 'app.publi.type-hebergement' });
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

        options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.disciplines.voies-ouverture.chart-evolution-comparaison-types-hebergement.tooltip' });
        options.chart.type = 'bubble';
        options.chart.zoomType = 'xy';
        options.chart.height = '600px';
        options.series = data.bubbleGraph;
        options.xAxis = {
          gridLineDashStyle: 'dash',
          gridLineWidth: 1,
          endOnTick: false,
          min: 0,
          max: 109,
          plotBands: [{
            color: 'white',
            zIndex: 1,
            dashStyle: 'dash',
            width: 2,
            from: 100,
            to: 1000,
          }],
          title: { text: intl.formatMessage({ id: 'app.voies-ouverture.types-hebergement.xAxis' }) },
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
          max: 119,
          plotBands: [{
            color: 'white',
            zIndex: 1,
            dashStyle: 'dash',
            width: 2,
            from: 100,
            to: 1000,
          }],
          title: { text: intl.formatMessage({ id: 'app.voies-ouverture.types-hebergement.yAxis' }) },
          labels: {
            // eslint-disable-next-line
            formatter: function () {
              return this.axis.defaultLabelFormatter.call(this).concat(' %');
            },
          },
        };
        options.legend = {
          enabled: true,
          floating: true,
          align: 'right',
          y: -60,
          useHTML: true,
          title: { text: intl.formatMessage({ id: 'app.discipline.bubbleSize' }) },
          bubbleLegend: {
            enabled: true,
            borderWidth: 3,
            borderColor: getCSSValue('--orange-soft-100'),
            color: getCSSValue('--orange-soft-25'),
            connectColor: getCSSValue('--orange-soft-100'),
          },
        };
        options.plotOptions = {
          bubble: {
            minSize: 30,
            maxSize: 90,
            jitter: {
              x: 5,
              y: 5,
            },
            dataLabels: {
              enabled: 'true',
              format: '{point.discipline}',
              allowOverlap: true,
              style: {
                color: getCSSValue('--g-800'),
                textOverflow: 'clip',
              },
            },
          },
          series: {
            dataLabels: {
              enabled: true,
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
              backgroundColor: getCSSValue('--blue-soft-100'),
            },
          },
        ];

        return options;
      },
    },
  'publi.affiliations.pays.chart-classement-pays': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.affiliations.pays.chart-classement-pays.tooltip' });
      options.legend = { enabled: false };
      options.chart.type = 'bar';
      options.xAxis = { categories };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.publishers.type-ouverture.chart-evolution-repartition.tooltip' });
      options.legend.title.text = intl.formatMessage({ id: 'app.publi.type-oa-publisher' });
      options.chart.type = 'area';
      options.yAxis = getPercentageYAxis(false);
      options.yAxis.title.text = intl.formatMessage({ id: 'app.publi.percentage-publi' });
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
      options.legend = {};
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.publishers.type-ouverture.chart-repartition-modeles.tooltip' });
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.general.dynamique-ouverture.chart-taux-ouverture.tooltip' });
      options.chart.type = 'bar';
      options.legend.title.text = '';
      options.colors = [getCSSValue('--orange-soft-100'), getCSSValue('--orange-soft-175')];
      options.yAxis = { visible: false, min: 0, max: 100 };
      options.plotOptions = {
        series: {
          grouping: false,
        },
        bar: {
          states: {
            hover: {
              color: getCSSValue('--orange-soft-75'),
            },
          },
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} %',
            style: {
              color: getCSSValue('--g-800'),
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
            color: getCSSValue('--g-800'),
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      };
      options.series = data?.series;

      return options;
    },
  },
  'publi.general.dynamique-ouverture.chart-evolution-proportion': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);

      options.chart.type = 'spline';
      options.xAxis.title.text = intl.formatMessage({ id: 'app.publication-year' });
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.verticalAlign = 'top';
      options.legend.title.text = intl.formatMessage({ id: 'app.observation-dates' });
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.general.dynamique-ouverture.chart-evolution-proportion.tooltip' });
      options.plotOptions = { series: { pointStart: 2013 },
        spline: {
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            // eslint-disable-next-line
              formatter: function() {
              const last = this.series.data[this.series.data.length - 1];
              if ((this.point.category === last.category && this.point.y === last.y)) {
                return this.point.y.toFixed(0).concat(' %');
              }
              return '';
            },
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.general.voies-ouverture.chart-repartition-taux': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.general.voies-ouverture.chart-repartition-taux.tooltip' });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({ id: 'app.publi.type-hebergement' });
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
              return this.y.toFixed(0).concat(' %');
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.general.voies-ouverture.chart-evolution-taux.tooltip' });
      options.xAxis = {
        categories,
        tickmarkPlacement: 'on',
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({ id: 'app.publi.type-hebergement' });
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.general.voies-ouverture.chart-repartition-publications.tooltip' });
      options.legend = {};
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.general.genres-ouverture.chart-repartition-genres.tooltip' });
      options.legend = {};
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.general.langues-ouverture.chart-repartition-publications.tooltip' });
      options.legend = {};
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
      options.legend.title.text = intl.formatMessage({ id: 'app.publi.general.impact-financement.chart-taux-ouverture.legend' });
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.general.impact-financement.chart-taux-ouverture.tooltip' });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.affiliations.dynamique-ouverture.chart-evolution-proportion.tooltip' });
      options.chart.type = 'spline';
      options.xAxis = {
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.verticalAlign = 'top';
      options.legend.title.text = intl.formatMessage({ id: 'app.observation-dates' });
      options.plotOptions = {
        series: { pointStart: 2013 },
        spline: {
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            // eslint-disable-next-line
              formatter: function() {
              const last = this.series.data[this.series.data.length - 1];
              if ((this.point.category === last.category && this.point.y === last.y)) {
                return this.point.y.toFixed(0).concat(' %');
              }
              return '';
            },
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.affiliations.dynamique-ouverture.chart-evolution-taux': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);
      options.legend.title.text = intl.formatMessage({ id: 'app.observation-dates' });
      options.legend.verticalAlign = 'top';
      options.legend.align = 'left';
      options.chart = {
        type: 'dumbbell',
        inverted: true,
        zoomType: 'x',
        height: '600px',
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.yAxis.gridLineColor = getCSSValue('--g-500');
      options.yAxis.gridLineDashStyle = 'dot';
      options.xAxis = {
        type: 'category',
        categories: data[0].data.map((el) => intl.formatMessage({ id: `app.affiliations.${el.name}` })),
        labels: {
          style: {
            color: getCSSValue('--g-!00'),
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

      options.series = data;

      options.tooltip = {
        shared: true,
      };

      return options;
    },
  },
  'publi.affiliations.pays.chart-taux-rang-utile': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions(id, intl);
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.affiliations.pays.chart-taux-rang-utile.tooltip' });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({ id: 'app.publi.type-auteur-rang-utile' });
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.publishers.dynamique-ouverture.chart-taux-ouverture.tooltip' });
      options.legend = {};
      options.chart.type = 'bar';
      options.colors = [getCSSValue('--yellow-medium-125')];
      options.yAxis = { visible: false, min: 0, max: 100 };
      options.plotOptions = {
        bar: {
          states: {
            hover: {
              color: getCSSValue('--yellow-medium-75'),
            },
          },
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} %',
            style: {
              color: getCSSValue('--g-800'),
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
            color: getCSSValue('--g-800'),
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.publishers.dynamique-ouverture.chart-evolution-proportion.tooltip' });
      options.chart.type = 'spline';
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.xAxis.title.text = intl.formatMessage({ id: 'app.publication-year' });
      options.legend.verticalAlign = 'top';
      options.legend.title.text = intl.formatMessage({ id: 'app.observation-dates' });
      options.plotOptions = {
        series: { pointStart: 2013 },
        spline: {
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            // eslint-disable-next-line
              formatter: function() {
              const last = this.series.data[this.series.data.length - 1];
              if ((this.point.category === last.category && this.point.y === last.y)) {
                return this.point.y.toFixed(0).concat(' %');
              }
              return '';
            },
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.affiliations.dynamique-ouverture.chart-taux-ouverture': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.affiliations.dynamique-ouverture.chart-taux-ouverture.tooltip' });
      options.legend = {};
      options.chart.type = 'bar';
      options.colors = [getCSSValue('--orange-soft-100')];
      options.yAxis = { visible: false, min: 0, max: 100 };
      options.plotOptions = {
        bar: {
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f}%',
            style: {
              color: getCSSValue('--g-800'),
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
            color: getCSSValue('--g-800'),
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.publishers.politiques-ouverture.chart-comparaison.tooltip' });
      options.chart.type = 'bubble';
      options.chart.zoomType = 'xy';
      options.chart.height = '600px';
      options.series = data;
      options.xAxis = {
        min: 0,
        max: 109,
        gridLineDashStyle: 'dash',
        gridLineWidth: 1,
        endOnTick: false,
        title: { text: intl.formatMessage({ id: 'app.voies-ouverture.types-hebergement.xAxis' }) },
        plotBands: [{
          color: 'white',
          zIndex: 1,
          dashStyle: 'dash',
          width: 2,
          from: 100,
          to: 1000,
        }],
        labels: {
          // eslint-disable-next-line
          formatter: function () {
            return this.axis.defaultLabelFormatter.call(this).concat(' %');
          },
        },
      };
      options.yAxis = {
        min: 0,
        max: 119,
        gridLineDashStyle: 'dash',
        gridLineWidth: 1,
        endOnTick: false,
        title: { text: intl.formatMessage({ id: 'app.voies-ouverture.types-hebergement.yAxis' }) },
        plotBands: [{
          color: 'white',
          zIndex: 1,
          dashStyle: 'dash',
          width: 2,
          from: 100,
          to: 1000,
        }],
        labels: {
          // eslint-disable-next-line
          formatter: function () {
            return this.axis.defaultLabelFormatter.call(this).concat(' %');
          },
        },
      };
      options.legend = {
        enabled: true,
        floating: true,
        align: 'right',
        y: -60,
        useHTML: true,
        title: { text: intl.formatMessage({ id: 'app.discipline.bubbleSize' }) },
        bubbleLegend: {
          enabled: true,
          borderWidth: 3,
          borderColor: getCSSValue('--yellow-medium-100'),
          color: getCSSValue('--yellow-medium-25'),
          connectColor: getCSSValue('--yellow-medium-100'),
        },
      };
      options.plotOptions = {
        bubble: {
          minSize: 30,
          maxSize: 90,
          jitter: {
            x: 5,
            y: 5,
          },
        },
        series: {
          dataLabels: {
            allowOverlap: true,
            style: {
              textOutline: 'none',
              color: getCSSValue('--g-800'),
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
            backgroundColor: getCSSValue('--blue-soft-100'),
          },
        },
      ];

      return options;
    },
  },
  'publi.disciplines.dynamique-ouverture.chart-taux-ouverture': {
    getOptions: (id, intl, graph) => {
      const options = getGraphOptions(id, intl);
      options.legend = {};
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.disciplines.dynamique-ouverture.chart-taux-ouverture.tooltip' });
      options.credits = { enabled: false };
      const { data, name } = graph;
      options.chart.type = 'column';
      // options.legend = { width: '99%', align: 'right' };
      options.xAxis = {
        type: 'category',
        title: { text: intl.formatMessage({ id: 'app.observation-dates' }) },
        categories: data.map((el) => el.name),
        labels: {
          style: {
            color: getCSSValue('--g-800'),
            fontSize: '14px',
          },
        },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      const nameClean = name.replace(/\n/g, '').replace('  ', ' ');
      options.series = [
        {
          name: intl.formatMessage({ id: `app.discipline.${nameClean}` }),
          color: getCSSValue('--orange-soft-125'),
          data: data.map((el, i) => ({
            name: el.name,
            y: el.y,
            y_abs: el.y_abs,
            y_tot: el.y_tot,
            color:
              i === data.length - 1
                ? getCSSValue('--orange-soft-100')
                : getCSSValue('--orange-soft-125'),
          })),
        },
      ];

      return options;
    },
  },
  'publi.publishers.repartition-licences.chart-repartition': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.publishers.repartition-licences.chart-repartition.tooltip' });
      options.legend = {};
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.publishers.repartition-licences.chart-classement.tooltip' });
      options.chart.type = 'bar';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis(false);
      options.yAxis.title.text = intl.formatMessage({ id: 'app.publi.percentage-publi-open-publisher' });
      options.legend.title.text = intl.formatMessage({ id: 'app.publi.type-licence' });
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.publishers.couts-publication.chart-depenses-estimees.tooltip' });
      options.legend.title.text = intl.formatMessage({ id: 'app.publi.type-apc' });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = {
        title: { text: intl.formatMessage({ id: 'app.publi.sum-apc' }) },
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.publishers.couts-publication.chart-distribution.tooltip' });
      options.legend.title.text = intl.formatMessage({ id: 'app.publi.type-apc' });
      options.chart.type = 'column';
      options.chart.type = 'areaspline'; // 'column' dans la maquette
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publi.tarif-apc' }) },
        labels: {
          // eslint-disable-next-line
          formatter: function () {
            return this.axis.defaultLabelFormatter.call(this).concat(' €');
          },
        },
      };
      options.yAxis = {
        title: { text: intl.formatMessage({ id: 'app.publi.nb-publications' }) },
      };
      options.series = data;
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.repositories.dynamique-ouverture.chart-evolution-proportion.tooltip' });
      options.chart.type = 'spline';
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.xAxis.title.text = intl.formatMessage({ id: 'app.publication-year' });
      options.legend.verticalAlign = 'top';
      options.legend.title.text = intl.formatMessage({ id: 'app.observation-dates' });
      options.plotOptions = {
        series: { pointStart: 2013 },
        spline: {
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            // eslint-disable-next-line
              formatter: function() {
              const last = this.series.data[this.series.data.length - 1];
              if ((this.point.category === last.category && this.point.y === last.y)) {
                return this.point.y.toFixed(0).concat(' %');
              }
              return '';
            },
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.repositories.dynamique-ouverture.chart-taux-ouverture': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);
      options.legend = {};
      options.chart.type = 'bar';
      options.colors = [getCSSValue('--green-medium-125')];
      options.yAxis = { visible: false, min: 0, max: 100 };
      options.plotOptions = {
        bar: {
          states: {
            hover: {
              color: getCSSValue('--green-medium-75'),
            },
          },
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} %',
            style: {
              color: getCSSValue('--g-800'),
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
            color: getCSSValue('--g-800'),
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
      options.legend = {};
      options.chart.type = 'bar';
      options.chart.height = '700px';
      options.colors = [getCSSValue('--green-medium-125')];
      options.yAxis = { visible: false };
      options.xAxis = {
        type: 'category',
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            color: getCSSValue('--g-800'),
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
      options.legend = {};
      options.credits = { enabled: false };
      options.chart.type = 'column';
      options.xAxis = {
        type: 'category',
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
        categories: graph.data.map((el) => el.name),
        labels: {
          style: {
            color: getCSSValue('--g-800'),
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
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis.title.text = intl.formatMessage({ id: 'app.publi.nb-publications' });
      options.legend.title.text = intl.formatMessage({ id: 'app.publi.type-oa' });
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
      options.tooltip.pointFormat = intl.formatMessage({ id: 'app.publi.publishers.poids-revues.chart-repartition.tooltip' });
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
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis(false, 3);
      options.yAxis.title.text = intl.formatMessage({ id: 'app.publi.percentage-publi' });
      options.legend = { enabled: false };

      return options;
    },
  },
  'publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions(id, intl);
      options.legend.title.text = intl.formatMessage({ id: 'app.observation-dates' });
      options.legend.verticalAlign = 'top';
      options.legend.align = 'left';
      options.chart = {
        type: 'dumbbell',
        inverted: true,
        zoomType: 'x',
        height: '600px',
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.yAxis.gridLineColor = getCSSValue('--g-500');
      options.yAxis.gridLineDashStyle = 'dot';
      options.xAxis = {
        type: 'category',
        categories: data[0].data.map((el) => intl.formatMessage({
          id: `app.discipline.${el.name
            .replace(/\n/g, '')
            .replace('  ', ' ')}`,
        })),
        labels: {
          style: {
            color: getCSSValue('--g-800'),
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

      options.series = data;

      options.tooltip = {
        shared: true,
      };

      return options;
    },
  },
};
