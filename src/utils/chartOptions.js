import {
  capitalize,
  cleanNumber,
  getCSSValue,
  getPercentageYAxis,
  getSource,
  getURLSearchParams,
  withtStudyType,
} from './helpers';

/**
 *
 * @param graphId
 * @param intl
 * @param {string} studyType
 * @param {Object} dataTitle
 * @returns {{exporting:
 * {chartOptions: {legend: {enabled: boolean}, subtitle: {text: *}, title: {text: *}},
 * buttons: {contextButton: {enabled: boolean}}, filename: *},
 * credits: {text: string},
 * responsive: {rules: [{chartOptions: {legend: {layout: string, verticalAlign: string, align: string}},
 * condition: {maxWidth: number}}]}, tooltip: {headerFormat: string, pointFormat: *},
 * title: {style: {color: string, fontSize: string, fontWeight: string}, text: *, align: string},
 * chart: {backgroundColor: string}
 * }}
 */
export function getGraphOptions({ id, intl, studyType = '', dataTitle = {} }) {
  let otherSources = [];
  const { bsoLocalAffiliation, commentsName, lastObservationYear, name } = getURLSearchParams(intl, id);
  otherSources = [name];
  // eslint-disable-next-line no-param-reassign
  dataTitle.commentsName = commentsName;
  const titleId = studyType ? withtStudyType(id, studyType.toLowerCase()) : id;
  const legend = intl.formatMessage({
    id: `${id}.legend`,
    defaultMessage: ' ',
  });
  let embargoText = '';
  let isEmbargo = false;
  if (lastObservationYear > process.env.REACT_APP_LAST_OBSERVATION) {
    isEmbargo = true;
  }
  if (bsoLocalAffiliation && isEmbargo) {
    embargoText = 'EMBARGO - Ne pas diffuser<br>avant la sortie du BSO national';
  }
  const tooltip = intl
    .formatMessage({
      id: `${titleId}.tooltip`,
      defaultMessage: ' ',
    })
    .replaceAll('((commentsName))', commentsName);
  const xAxis = intl.formatMessage({ id: `${id}.xAxis`, defaultMessage: ' ' });
  const yAxis = intl.formatMessage({ id: `${id}.yAxis`, defaultMessage: ' ' });
  const source = getSource(id, otherSources);
  const title = intl.formatMessage(
    { id: `${titleId}.title`, defaultMessage: ' ' },
    dataTitle,
  );
  return {
    chart: {
      backgroundColor: getCSSValue('--white'),
      events: {
        // eslint-disable-next-line object-shorthand, func-names
        load: function () {
          const target = window !== window.top ? '_blank' : '_self';
          let credits = this?.credits?.element?.onclick;
          // eslint-disable-next-line no-unused-vars
          credits = () => window.open(window.location.origin, target);
          this.renderer
            .text(embargoText, this.plotLeft, 150)
            .attr({
              zIndex: 5,
            })
            .css({
              fontSize: '36px',
            })
            .add();
        },
      },
    },
    title: { text: '' },
    tooltip: {
      headerFormat: '',
      pointFormat: tooltip,
    },
    credits: {
      text: intl.formatMessage({ id: 'app.credit' }),
      href: undefined,
    },
    xAxis: {
      title: { text: xAxis },
    },
    yAxis: {
      title: { text: yAxis },
    },
    legend: {
      verticalAlign: 'top',
      align: 'left',
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
        credits: {
          text: intl
            .formatMessage({ id: 'app.credit' })
            .concat(', Sources : ')
            .concat(source),
        },
        title: {
          text: title,
        },
      },
      enabled: false,
      filename: title,
    },
  };
}

export const chartOptions = {
  'publi.publishers.couts-publication.chart-distribution-par-annee': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart = {
        type: 'areasplinerange',
        inverted: true,
      };
      options.xAxis = {
        reversed: false,
        title: { text: intl.formatMessage({ id: 'app.publi.tarif-apc' }) },
        labels: {
          formatter() {
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
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-apc',
      });
      options.plotOptions = {
        areasplinerange: {
          marker: {
            enabled: false,
          },
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
    getOptions: (id, intl, categories, data, dataTitle, displayType) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.height = '1000px';
      options.chart.type = 'bar';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis(
        true,
        null,
        displayType === 'display-staff',
      );
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-oa',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            enabled: false,
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'publi.disciplines.voies-ouverture.chart-repartition-publications': {
    getOptions: (id, intl, categories, data, dataTitle, sortKey) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'bar';
      options.chart.height = '600px';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y === 0 ? '' : this.y.toFixed(0).concat(' %');
            },
          },
          dataSorting: {
            enabled: true,
            sortKey,
          },
        },
      };
      options.series = data;
      options.exporting.csv = {
        columnHeaderFormatter: (item) => (item.isXAxis ? 'field' : item.name),
      };
      return options;
    },
  },
  'thesis.disciplines.voies-ouverture.chart-repartition-thesis': {
    getOptions: (id, intl, categories, data, dataTitle, sortKey) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'bar';
      options.chart.height = '1000px';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y === 0 ? '' : this.y.toFixed(0).concat(' %');
            },
          },
          dataSorting: {
            enabled: true,
            sortKey,
          },
        },
      };
      options.series = data;
      options.exporting.csv = {
        columnHeaderFormatter: (item) => (item.isXAxis ? 'field' : item.name),
      };
      return options;
    },
  },
  'publi.disciplines.voies-ouverture.chart-evolution-comparaison-types-hebergement':
    {
      getOptions: (id, intl, data, dataTitle) => {
        const options = getGraphOptions({ id, intl, dataTitle });
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
          plotBands: [
            {
              color: 'white',
              zIndex: 1,
              dashStyle: 'dash',
              width: 2,
              from: 100,
              to: 1000,
            },
          ],
          title: {
            text: intl.formatMessage({
              id: 'app.voies-ouverture.types-hebergement.xAxis',
            }),
          },
          labels: {
            formatter() {
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
          plotBands: [
            {
              color: 'white',
              zIndex: 1,
              dashStyle: 'dash',
              width: 2,
              from: 100,
              to: 1000,
            },
          ],
          title: {
            text: intl.formatMessage({
              id: 'app.voies-ouverture.types-hebergement.yAxis',
            }),
          },
          labels: {
            formatter() {
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
          title: {
            text: intl.formatMessage({ id: 'app.discipline.bubbleSize' }),
          },
          bubbleLegend: {
            enabled: true,
            borderWidth: 3,
            borderColor: getCSSValue('--orange-soft-100'),
            color: getCSSValue('--orange-soft-25'),
            connectColor: getCSSValue('--orange-soft-100'),
            labels: {
              format: '{value:.0f}',
            },
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
        const annotations = [
          {
            labelOptions: {
              y: 0,
              overflow: 'none',
              shape: 'rect',
              backgroundColor: 'white',
              borderColor: getCSSValue('--g-400'),
              borderWidth: 1,
              useHTML: false,
              borderRadius: 0,
            },
            labels: [
              {
                point: {
                  x: 20,
                  y: 1,
                  xAxis: 0,
                  yAxis: 0,
                },
                text: intl.formatMessage({
                  id: 'app.below-line',
                }),
              },
              {
                point: {
                  x: window.innerWidth < 991 ? 20 : 10,
                  y: 20,
                  xAxis: 0,
                  yAxis: 0,
                },
                text: intl.formatMessage({
                  id: 'app.above-line',
                }),
              },
            ],
            draggable: '',
          },
        ];
        options.annotations = annotations;
        // Create a deep copy
        const exportingAnnotations = JSON.parse(JSON.stringify(annotations));
        exportingAnnotations[0].labels[1].point.x = 20;
        options.exporting.chartOptions.annotations = exportingAnnotations;
        options.responsive.rules[0].chartOptions.legend.align = 'right';
        return options;
      },
    },
  'publi.affiliations.pays.chart-classement-pays': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions({ id, intl });
      options.tooltip.pointFormat = intl.formatMessage({
        id: 'app.publi.affiliations.pays.chart-classement-pays.tooltip',
      });
      options.legend = { enabled: false };
      options.chart.type = 'bar';
      options.xAxis = { categories };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.plotOptions = {
        bar: {
          dataLabels: {
            enabled: true,
            formatter() {
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
      const options = getGraphOptions({ id, intl });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-oa-publisher',
      });
      options.legend.reversed = true;
      options.chart.type = 'area';
      options.yAxis = getPercentageYAxis(false);
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.publi.percentage-publi',
      });
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
    getOptions: (id, intl, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
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
      const options = getGraphOptions({ id, intl });
      options.chart.type = 'bar';
      options.legend.title.text = '';
      options.colors = [
        getCSSValue('--orange-soft-100'),
        getCSSValue('--orange-soft-175'),
      ];
      options.yAxis = {
        max: 100,
        min: 0,
        visible: false,
      };
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
            allowOverlap: true,
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
      options.exporting.csv = {
        columnHeaderFormatter: (item) => (item.isXAxis ? 'year' : item.name),
      };
      return options;
    },
  },
  'publi.general.dynamique-ouverture.chart-taux-ouverture-article': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions({ id, intl });
      options.chart.type = 'bar';
      options.legend.title.text = '';
      options.colors = [
        getCSSValue('--orange-soft-100'),
        getCSSValue('--orange-soft-175'),
      ];
      options.yAxis = {
        max: 100,
        min: 0,
        visible: false,
      };
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
            allowOverlap: true,
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
      options.exporting.csv = {
        columnHeaderFormatter: (item) => (item.isXAxis ? 'year' : item.name),
      };
      return options;
    },
  },
  'publi.general.dynamique-ouverture.chart-evolution-proportion': {
    getOptions: (id, intl, categories, data) => {
      const { startYear } = getURLSearchParams(intl);
      const pointStart = Math.max(startYear, categories?.[0] || -Infinity);
      const options = getGraphOptions({ id, intl });
      options.chart.type = 'spline';
      options.xAxis = {
        categories,
        tickInterval: 1,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.observation-dates',
      });
      options.plotOptions = {
        series: {
          pointStart,
        },
        spline: {
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            formatter() {
              const last = this.series.data[this.series.data.length - 1];
              if (
                this.point.category === last.category
                && this.point.y === last.y
              ) {
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
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'publi.general.voies-ouverture.chart-repartition-publications': {
    getOptions: (id, intl, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.legend = {};
      options.series = [
        {
          type: 'treemap',
          layoutAlgorithm: 'stripes',
          alternateStartingDirection: true,
          levels: [
            {
              level: 1,
              layoutAlgorithm: 'squarified',
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
            {
              level: 2,
              layoutAlgorithm: 'stripes',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b><br>{point.percentage:.0f} %',
              },
            },
          ],
          data,
        },
      ];
      options.exporting.csv = {
        columnHeaderFormatter: (item) => (item.isXAxis ? 'category' : 'data'),
      };
      return options;
    },
  },
  'publi.general.genres-ouverture.chart-repartition-genres': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.tooltip.pointFormat = intl.formatMessage({
        id: 'app.publi.general.genres-ouverture.chart-repartition-taux.tooltip',
      });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-genre' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.general.genres-ouverture.chart-repartition-genres-treemap': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions({ id, intl });
      options.tooltip.pointFormat = intl.formatMessage({
        id: 'app.publi.general.genres-ouverture.chart-repartition-genres.tooltip',
      });
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
  'publi.general.genres-ouverture.chart-evolution-proportion': {
    getOptions: (id, intl, categories, series, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'spline';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publication-genre',
      });
      options.plotOptions = {
        spline: {
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            formatter() {
              const last = this.series.data[this.series.data.length - 1];
              if (
                this.point.category === last.category
                && this.point.y === last.y
              ) {
                return this.point.y.toFixed(0).concat(' %');
              }
              // return '';
              return this.point.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = series;
      return options;
    },
  },
  'publi.general.langues-ouverture.chart-repartition-publications': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.tooltip.pointFormat = intl.formatMessage({
        id: 'app.publi.general.genres-ouverture.chart-repartition-taux.tooltip',
      });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-lang' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;

      return options;
    },
  },
  'publi.general.langues-ouverture.chart-repartition-publications-treemap': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions({ id, intl });
      options.tooltip.pointFormat = intl.formatMessage({
        id: 'app.publi.general.langues-ouverture.chart-repartition-publications.tooltip',
      });
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
      const options = getGraphOptions({ id, intl });
      options.legend.reversed = true;
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        labels: {
          format:
            '<div style="text-align:center;">Global France&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ANR<br /><br />{value}</div>',
          useHTML: true,
        },
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.plotOptions = {
        series: {
          stacking: 'normal',
          pointPadding: 0.1,
          groupPadding: 0.1,
          dataLabels: {
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'publi.general.impact-financement.chart-business-model': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions({ id, intl });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-oa-publisher',
      });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        labels: {
          format:
            '<div style="text-align:center;">Global France&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ANR<br /><br />{value}</div>',
          useHTML: true,
        },
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.publi.percentage-publi',
      });
      options.plotOptions = {
        series: {
          stacking: 'normal',
          pointPadding: 0.1,
          groupPadding: 0.1,
          dataLabels: {
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'publi.general.impact-financement.chart-taux-ouverture-all-grants': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions({ id, intl });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.plotOptions = {
        column: {
          dataLabels: {
            enabled: true,
            formatter() {
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
    getOptions: (id, intl, categories, data) => {
      const { startYear } = getURLSearchParams(intl);
      const pointStart = Math.max(startYear, categories?.[0] || -Infinity);
      const options = getGraphOptions({ id, intl });
      options.chart.type = 'line';
      options.xAxis = {
        categories,
        tickInterval: 1,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.funding-year',
      });
      options.plotOptions = {
        series: {
          pointStart,
        },
        line: {
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            formatter() {
              const last = this.series.data[this.series.data.length - 1];
              if (
                this.point.category === last.category
                && this.point.y === last.y
              ) {
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
  'publi.general.impact-financement.chart-repartition-taux': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.funding-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'publi.affiliations.dynamique-ouverture.chart-evolution-proportion': {
    getOptions: (id, intl, data, categories, dataTitle) => {
      const { startYear } = getURLSearchParams(intl);
      const pointStart = Math.max(startYear, categories?.[0] || -Infinity);
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'spline';
      options.xAxis = {
        tickInterval: 1,
        title: {
          text: intl.formatMessage({ id: 'app.publication-year' }),
        },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.observation-dates',
      });
      options.plotOptions = {
        series: {
          pointStart,
        },
        spline: {
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            formatter() {
              const last = this.series.data[this.series.data.length - 1];
              if (
                this.point.category === last.category
                && this.point.y === last.y
              ) {
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
      const options = getGraphOptions({ id, intl });
      options.legend.title.text = intl.formatMessage({
        id: 'app.observation-dates',
      });
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
            enabled: true,
            lineWidth: 2,
            fillColor: getCSSValue('--black'),
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'publi.affiliations.pays.chart-taux-rang-utile': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions({ id, intl });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-auteur-rang-utile',
      });
      options.plotOptions = {
        column: {
          dataLabels: {
            enabled: true,
            formatter() {
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
    getOptions: (id, intl, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
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
    getOptions: (id, intl, data, dataTitle, categories) => {
      const { startYear } = getURLSearchParams(intl);
      const pointStart = Math.max(startYear, categories?.[0] || -Infinity);
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'spline';
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.xAxis = {
        categories,
        tickInterval: 1,
        title: {
          text: intl.formatMessage({
            id: 'app.publication-year',
          }),
        },
      };
      options.legend.title.text = intl.formatMessage({
        id: 'app.observation-dates',
      });
      options.plotOptions = {
        series: {
          pointStart,
        },
        spline: {
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            formatter() {
              const last = this.series.data[this.series.data.length - 1];
              if (
                this.point.category === last.category
                && this.point.y === last.y
              ) {
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
  'publi.publishers.dynamique-ouverture-journals.chart-taux-ouverture': {
    getOptions: (id, intl, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
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
  'publi.affiliations.dynamique-ouverture.chart-taux-ouverture': {
    getOptions: (id, intl, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
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
    getOptions: (id, intl, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
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
        title: {
          text: intl.formatMessage({
            id: 'app.voies-ouverture.types-hebergement.xAxis',
          }),
        },
        plotBands: [
          {
            color: 'white',
            zIndex: 1,
            dashStyle: 'dash',
            width: 2,
            from: 100,
            to: 1000,
          },
        ],
        labels: {
          formatter() {
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
        title: {
          text: intl.formatMessage({
            id: 'app.voies-ouverture.types-hebergement.yAxis',
          }),
        },
        plotBands: [
          {
            color: 'white',
            zIndex: 1,
            dashStyle: 'dash',
            width: 2,
            from: 100,
            to: 1000,
          },
        ],
        labels: {
          formatter() {
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
        title: {
          text: intl.formatMessage({ id: 'app.discipline.bubbleSize' }),
        },
        bubbleLegend: {
          enabled: true,
          borderWidth: 3,
          borderColor: getCSSValue('--yellow-medium-100'),
          color: getCSSValue('--yellow-medium-25'),
          connectColor: getCSSValue('--yellow-medium-100'),
          labels: {
            formatter() {
              return this.value.toFixed(0);
            },
          },
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
      const annotations = [
        {
          labelOptions: {
            y: 0,
            overflow: 'none',
            shape: 'rect',
            backgroundColor: 'white',
            borderColor: getCSSValue('--g-400'),
            borderWidth: 1,
            useHTML: false,
            borderRadius: 0,
          },
          labels: [
            {
              point: {
                x: 20,
                y: 1,
                xAxis: 0,
                yAxis: 0,
              },
              text: intl.formatMessage({
                id: 'app.below-line',
              }),
            },
            {
              point: {
                x: window.innerWidth < 991 ? 20 : 10,
                y: 20,
                xAxis: 0,
                yAxis: 0,
              },
              text: intl.formatMessage({
                id: 'app.above-line',
              }),
            },
          ],
          draggable: '',
        },
      ];
      options.annotations = annotations;
      // Create a deep copy
      const exportingAnnotations = JSON.parse(JSON.stringify(annotations));
      exportingAnnotations[0].labels[1].point.x = 20;
      options.exporting.chartOptions.annotations = exportingAnnotations;
      options.responsive.rules[0].chartOptions.legend.align = 'right';
      return options;
    },
  },
  'publi.disciplines.dynamique-ouverture.chart-taux-ouverture': {
    getOptions: (id, intl, graph) => {
      const options = getGraphOptions({ id, intl });
      options.legend = {};
      options.credits.enabled = false;
      options.plotOptions = {
        column: {
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            formatter() {
              const last = this.series.data[this.series.data.length - 1];
              if (
                this.point.category === last.category
                && this.point.y === last.y
              ) {
                return this.point.y.toFixed(0).concat(' %');
              }
              return '';
            },
          },
        },
      };
      const { data, name } = graph;
      options.chart.type = 'column';
      options.xAxis = {
        type: 'category',
        categories: data.map((el) => el.name),
        labels: {
          rotation: -90,
          style: {
            color: getCSSValue('--g-800'),
          },
          formatter() {
            return this.isFirst || this.isLast ? this.value : null;
          },
        },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.min = 0;
      options.yAxis.max = 100;
      const nameClean = name.replace(/\n/g, '').replace('  ', ' ');
      options.series = [
        {
          name: intl.formatMessage({ id: `app.discipline.${nameClean}` }),
          color: getCSSValue('--orange-soft-125'),
          data: data.map((el, i) => ({
            name: el.name,
            bsoDomain: el.bsoDomain,
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
      options.subtitle = {
        text: capitalize(
          intl.formatMessage({ id: `app.discipline.${nameClean}` }),
        ),
        widthAdjust: 0,
        style: {
          fontWeight: 'bold',
        },
      };
      options.legend.enabled = false;
      return options;
    },
  },
  'thesis.disciplines.dynamique-ouverture.chart-taux-ouverture': {
    getOptions: (id, intl, graph) => {
      const options = getGraphOptions({ id, intl });
      options.legend = {};
      options.credits.enabled = false;
      options.plotOptions = {
        column: {
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            formatter() {
              const last = this.series.data[this.series.data.length - 1];
              if (
                this.point.category === last.category
                && this.point.y === last.y
              ) {
                return this.point.y.toFixed(0).concat(' %');
              }
              return '';
            },
          },
        },
      };
      const { data, name } = graph;
      options.chart.type = 'column';
      options.xAxis = {
        type: 'category',
        categories: data.map((el) => el.name),
        labels: {
          rotation: -90,
          style: {
            color: getCSSValue('--g-800'),
          },
          formatter() {
            return this.isFirst || this.isLast ? this.value : null;
          },
        },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.min = 0;
      options.yAxis.max = 100;
      const nameClean = name.replace(/\n/g, '').replace('  ', ' ');
      options.series = [
        {
          name: intl.formatMessage({ id: `app.discipline.${nameClean}` }),
          color: getCSSValue('--orange-soft-125'),
          data: data.map((el, i) => ({
            name: el.name,
            bsoDomain: el.bsoDomain,
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
      options.subtitle = {
        text: capitalize(
          intl.formatMessage({ id: `app.discipline.${nameClean}` }),
        ),
        widthAdjust: 0,
        style: {
          fontWeight: 'bold',
        },
      };
      options.legend.enabled = false;
      return options;
    },
  },
  'publi.publishers.repartition-licences.chart-repartition': {
    getOptions: (id, intl, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
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
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.height = '700px';
      options.chart.type = 'bar';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis(false);
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.publi.percentage-publi-open-publisher',
      });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-licence',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'publi.publishers.couts-publication.chart-depenses-estimees': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-apc',
      });
      options.legend.reversed = true;
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = {
        title: { text: intl.formatMessage({ id: 'app.publi.sum-apc' }) },
        stackLabels: {
          enabled: true,
          formatter() {
            return `${cleanNumber(this.total)} €`;
          },
          style: {
            fontWeight: 'bold',
          },
        },
        labels: {
          formatter() {
            return this.axis.defaultLabelFormatter.call(this).concat(' €');
          },
        },
      };
      options.series = data;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          minPointLength: 5,
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return cleanNumber(this.y).concat(' €');
            },
          },
        },
      };
      return options;
    },
  },
  'publi.publishers.couts-publication.chart-distribution': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-apc',
      });
      options.legend.reversed = true;
      options.chart.type = 'areaspline';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publi.tarif-apc' }) },
        labels: {
          formatter() {
            return this.axis.defaultLabelFormatter.call(this).concat(' €');
          },
        },
      };
      options.yAxis = {
        title: {
          text: intl.formatMessage({ id: 'app.publi.nb-publications' }),
        },
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
    getOptions: (id, intl, data, categories, dataTitle) => {
      const { startYear } = getURLSearchParams(intl);
      const pointStart = Math.max(startYear, categories?.[0] || -Infinity);
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'spline';
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.xAxis.title.text = intl.formatMessage({
        id: 'app.publication-year',
      });
      options.xAxis.tickInterval = 1;
      options.legend.title.text = intl.formatMessage({
        id: 'app.observation-dates',
      });
      options.plotOptions = {
        series: {
          pointStart,
        },
        spline: {
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            formatter() {
              const last = this.series.data[this.series.data.length - 1];
              if (
                this.point.category === last.category
                && this.point.y === last.y
              ) {
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
    getOptions: (id, intl, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
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
    getOptions: (id, intl, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
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
      options.plotOptions = {
        bar: {
          dataLabels: {
            enabled: true,
            style: {
              color: getCSSValue('--g-800'),
            },
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
      const options = getGraphOptions({ id, intl });
      const { data, color, name, annotationVisible } = graph;
      options.legend.enabled = false;
      options.credits.enabled = false;
      options.chart.type = 'column';
      options.subtitle = {
        text: name,
        widthAdjust: 0,
        style: {
          fontWeight: 'bold',
        },
      };
      options.plotOptions = {
        column: {
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            inside: false,
            formatter() {
              const sign = this.point.yoy > 0 ? '+' : '';
              const label = this.point.yoy
                ? sign.concat(this.point.yoy.toFixed(0)).concat(' %')
                : null;
              return label;
            },
          },
        },
      };
      options.xAxis = {
        type: 'category',
        categories: graph.data.map((el) => el.name),
        labels: {
          style: {
            color: getCSSValue('--g-800'),
            fontSize: '14px',
          },
          formatter() {
            return this.isFirst || this.isLast ? this.value : null;
          },
        },
      };
      options.yAxis = {
        title: {
          enabled: false,
        },
        min: 0,
        max: 42000,
      };
      options.series = [
        {
          data,
          color,
          name,
        },
      ];
      options.annotations = [
        {
          visible: annotationVisible,
          labels: [
            {
              point: {
                x: data[2]?.x - 0.1 || null,
                y: data[2]?.y + options.yAxis.max * 0.1 || null,
                yAxis: 0,
                xAxis: 0,
              },
              text: intl.formatMessage({
                id: 'app.yoy',
              }),
            },
          ],
          draggable: '',
          markerEnd: 'arrow',
          labelOptions: {
            shape: 'connector',
            distance: 40,
            style: {
              fontSize: '0.8em',
              textOutline: '1px white',
            },
          },
        },
      ];
      return options;
    },
  },
  'publi.repositories.dynamique-hal.chart-couverture-hal': {
    getOptions: (id, intl, publicationYears, data) => {
      const options = getGraphOptions({ id, intl });
      options.yAxis = getPercentageYAxis(false, 125);
      options.chart.type = 'column';
      options.xAxis = {
        publicationYears,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.publi.part-publications-archive',
      });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-oa',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
            style: {
              textOutline: 'none',
            },
          },
        },
      };
      options.series = data;
      options.exporting.chartOptions.yAxis = {
        max: 125,
        endOnTick: false,
        tickAmount: 6,
      };
      return options;
    },
  },
  'publi.publishers.poids-revues.chart-repartition': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions({ id, intl });
      options.series = data;
      options.chart.type = 'solidgauge';
      options.pane = {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc',
        },
      };
      let color = '#EEE';
      if (data) {
        options.series[0].dataLabels = {
          format:
            '<div style="text-align:center">'
            + '<span style="font-size:25px;">{y:.1f} %</span><br/>'
            + '<span style="font-size:12px;opacity:0.4">{point.y_abs} publications</span>'
            + '</div>',
        };
        color = options.series[0].color;
      }
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = {
        stops: [[100, color]],
        min: 0,
        max: 100,
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
          y: -70,
        },
        labels: {
          enabled: false,
        },
      };
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.publi.percentage-publi-bealls',
      });
      options.legend = { enabled: false };
      return options;
    },
  },
  'publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture': {
    getOptions: (id, intl, data) => {
      const options = getGraphOptions({ id, intl });
      options.legend.title.text = intl.formatMessage({
        id: 'app.observation-dates',
      });
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
      };
      options.plotOptions = {
        dumbbell: {
          grouping: false,
        },
        series: {
          marker: {
            enabled: true,
            lineWidth: 2,
            fillColor: getCSSValue('--black'),
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'general.dynamique.chart-evolution': {
    getOptions: (id, intl, data, studyType) => {
      const options = getGraphOptions({ id, intl, studyType });
      options.chart.type = 'bar';
      options.plotOptions = {
        series: {
          stacking: false,
          dataLabels: {
            enabled: false,
          },
        },
        bar: {
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} %',
          },
        },
      };
      options.yAxis = getPercentageYAxis(false);
      options.xAxis = {
        type: 'category',
        categories: data?.categories || [],
        title: {
          text: intl.formatMessage({ id: 'app.sponsor-type' }),
        },
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            color: getCSSValue('--g800'),
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      };
      options.series = data?.series || [];
      options.legend = { enabled: false };
      options.tooltip = {
        headerFormat: '',
        pointFormat: intl.formatMessage({
          id: `${withtStudyType(id, studyType)}.tooltip`,
        }),
      };
      return options;
    },
  },
  'general.trajectoires.chart-repartition': {
    getOptions: (id, intl, data, studyType) => {
      const nodeColor = {
        Completed: getCSSValue('--patient-125'),
        Unknown: getCSSValue('--patient-75'),
        Ongoing: getCSSValue('--patient-100'),
        closed: getCSSValue('--acces-ferme'),
        is_oa: getCSSValue('--acces-ouvert'),
        has_result: getCSSValue('--acces-ouvert'),
        no_result: getCSSValue('--negatif'),
        has_publications_result: getCSSValue('--publication-100'),
        no_publications_result: getCSSValue('--g-600'),
        start: getCSSValue('--patient-50'),
      };
      const getNodes = () => {
        const allNodes = ['Completed', 'Ongoing', 'Unknown'];
        const keysList = [
          {
            keyword: 'has_result',
            intlKey: 'app.studies.general.sankey.has_result.label',
          },
          {
            keyword: 'no_result',
            intlKey: 'app.studies.general.sankey.no_result.label',
          },
          {
            keyword: 'has_result-has_publications_result',
            intlKey: 'app.studies.general.sankey.has_publications_result.label',
          },
          {
            keyword: 'has_result-has_publications_result-closed',
            intlKey: 'app.studies.general.sankey.closed.label',
          },
          {
            keyword: 'has_result-has_publications_result-is_oa',
            intlKey: 'app.studies.general.sankey.is_oa.label',
          },
          {
            keyword: 'has_result-no_publications_result',
            intlKey: 'app.studies.general.sankey.no_publications_result.label',
          },
        ];
        const nodes = [];
        // TODO refacto
        allNodes.forEach((node) => {
          nodes.push({
            id: node,
            color: nodeColor[node],
            name: intl.formatMessage({
              id: `app.health-${studyType.toLowerCase()}.general.sankey.${node}.label`,
            }),
          });
          keysList.forEach((item) => {
            nodes.push({
              id: `${node}-${item.keyword}`,
              name: intl.formatMessage({ id: item.intlKey }),
              color: nodeColor[item.keyword?.split('-').slice(-1)],
            });
          });
        });
        return nodes;
      };
      const options = getGraphOptions({ id, intl, studyType });
      options.colors = [nodeColor.start];
      delete options.tooltip.pointFormat;
      options.series = [
        {
          keys: ['from', 'to', 'weight'],
          data,
          type: 'sankey',
          nodes: getNodes(),
        },
      ];
      return options;
    },
  },
  'resultats.type-diffusion.chart-repartition': {
    getOptions: (id, intl, data, studyType, dataTitle) => {
      const options = getGraphOptions({ id, intl, studyType, dataTitle });
      options.chart.type = 'bar';
      options.legend.enabled = false;
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            enabled: false,
          },
        },
        bar: {
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} %',
          },
        },
      };
      options.yAxis = getPercentageYAxis(false);
      options.xAxis = {
        type: 'category',
        title: {
          text: intl.formatMessage({ id: 'app.type-diffusion' }),
        },
        categories: data?.categories || [],
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            color: getCSSValue('--g800'),
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      };
      options.series = data?.series || [];
      options.legend.reversed = true;
      return options;
    },
  },
  'caracteristiques.quand.chart-evolution-temporalites': {
    getOptions: (
      id,
      intl,
      data,
      idWithDomainAndStudyType,
      studyType,
      dataTitle,
    ) => {
      const options = getGraphOptions({ id, intl, studyType, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories: data?.categoriesEvolution || [],
        title: { text: intl.formatMessage({ id: 'app.study-start-year' }) },
      };
      options.yAxis = getPercentageYAxis(false);
      options.yAxis.max = 100;
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data?.dataGraphEvolution || [];
      options.tooltip.pointFormat = intl.formatMessage({
        id: `${idWithDomainAndStudyType}.tooltip`,
      });
      return options;
    },
  },
  'caracteristiques.quand.chart-repartition-avant-apres': {
    getOptions: (
      id,
      intl,
      data,
      idWithDomainAndStudyType,
      studyType,
      dataTitle,
    ) => {
      const options = getGraphOptions({ id, intl, studyType, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories: data?.categoriesRepartition || [],
        labels: {
          overflow: 'allow',
          rotation: -90,
          useHTML: true,
          formatter() {
            const label = this.axis.defaultLabelFormatter.call(this);
            if (label === '0') {
              return intl.formatMessage({
                id: 'app.studies.start',
              });
            }
            return label;
          },
        },
      };
      options.plotOptions = {
        column: {
          dataLabels: {
            enabled: false,
          },
        },
        series: {
          pointWidth: 30,
        },
      };
      options.series = data?.dataGraphRepartition || [];
      options.tooltip.pointFormat = intl.formatMessage({
        id: `${idWithDomainAndStudyType}.tooltip`,
      });
      return options;
    },
  },
  'caracteristiques.quand.chart-distribution-declarations': {
    getOptions: (id, intl, data, studyType) => {
      const options = getGraphOptions({ id, intl, studyType });
      options.chart = {
        type: 'areasplinerange',
        inverted: false,
        height: '600px',
      };
      options.xAxis.gridLineWidth = 1;
      options.xAxis.max = 24;
      options.xAxis.min = -24;
      options.xAxis.labels = {
        formatter() {
          const label = this.axis.defaultLabelFormatter.call(this);
          if (label === '0') {
            return intl.formatMessage({
              id: 'app.studies.start',
            });
          }
          return label;
        },
      };
      options.yAxis.categories = data?.categoriesDistribution || [];
      options.yAxis.min = 0;
      options.yAxis.max = data?.categoriesDistribution?.length - 1 || 10;
      options.yAxis.reversed = true;
      options.plotOptions = {
        areasplinerange: {
          marker: {
            enabled: false,
          },
        },
      };
      options.series = data?.dataGraphDistribution || [];
      return options;
    },
  },
  'caracteristiques.duree.chart-nombre': {
    getOptions: (id, intl, data, studyType, dataTitle) => {
      // TODO refacto
      const options = getGraphOptions({ id, intl, studyType, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        tickInterval: 1,
        labels: {
          formatter() {
            if (this.isFirst) {
              return intl.formatMessage({
                id: 'app.health-interventional.caracteristiques.duree.chart-nombre.0-year',
              });
            }
            if (this.isLast) {
              return intl.formatMessage({
                id: 'app.health-interventional.caracteristiques.duree.chart-nombre.10-years-and-more',
              });
            }
            return intl.formatMessage(
              {
                id: 'app.health-interventional.caracteristiques.duree.chart-nombre.years',
              },
              { value1: this.value, value2: this.value + 1 },
            );
          },
        },
        title: {
          text: intl.formatMessage({
            id: `app.health-${studyType.toLowerCase()}.caracteristiques.duree.chart-nombre.xAxis`,
          }),
        },
      };
      options.yAxis = {
        categories: data?.categories || [],
        title: null,
      };
      options.series = data?.dataGraph || [];
      return options;
    },
  },
  'caracteristiques.combien.chart-groupes-patients': {
    getOptions: (id, intl, data, studyType, dataTitle) => {
      const options = getGraphOptions({ id, intl, studyType, dataTitle });
      options.chart.type = 'column';
      // TODO refacto
      options.xAxis = {
        categories: data?.categoriesGroupes || [],
        title: {
          text: intl.formatMessage({
            id: `app.health-${studyType.toLowerCase()}.caracteristiques.combien.chart-groupes-patients.xAxis`,
          }),
        },
      };
      options.yAxis = {
        visible: false,
        labels: {
          enabled: false,
        },
      };
      options.series = data?.dataGraphGroupes || [];
      return options;
    },
  },
  'caracteristiques.combien.chart-proportion-modes-repartition': {
    getOptions: (id, intl, data, studyType, dataTitle) => {
      const options = getGraphOptions({ id, intl, studyType, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories: data?.categoriesRepartition || [],
        title: { text: intl.formatMessage({ id: 'app.study-start-year' }) },
      };
      options.yAxis.stackLabels = {
        enabled: true,
      };
      options.series = data?.dataGraphRepartition || [];
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
        },
      };
      options.tooltip.useHTML = true;
      return options;
    },
  },
  'caracteristiques.types.chart-evolution-nombre': {
    getOptions: (
      id,
      intl,
      data,
      idWithDomainAndStudyType,
      studyType,
      dataTitle,
    ) => {
      // TODO refacto
      const options = getGraphOptions({ id, intl, studyType, dataTitle });
      options.chart.type = 'column';
      options.yAxis = getPercentageYAxis(false);
      options.xAxis.title = {
        text: intl.formatMessage({ id: 'app.study-start-year' }),
      };
      options.yAxis.max = 100;
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data?.dataGraph || [];
      options.tooltip.pointFormat = intl.formatMessage({
        id: `${idWithDomainAndStudyType}.tooltip`,
      });
      return options;
    },
  },
  'resultats.type-diffusion.chart-repartition-par-type': {
    getOptions: (id, intl, data, studyType, dataTitle) => {
      const options = getGraphOptions({ id, intl, studyType, dataTitle });
      options.chart.type = 'bar';
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            enabled: false,
          },
        },
        bar: {
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} %',
          },
        },
      };
      options.yAxis = getPercentageYAxis(false);
      options.xAxis = {
        type: 'category',
        categories: data?.categories || [],
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            color: getCSSValue('--g800'),
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      };
      options.series = data?.series || [];
      options.legend.reversed = true;
      return options;
    },
  },
  'resultats.plan-partage.chart-repartition': {
    getOptions: (id, intl, data, studyType, dataTitle) => {
      const options = getGraphOptions({ id, intl, studyType, dataTitle });
      options.chart.type = 'column';
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            enabled: false,
          },
        },
        column: {
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} %',
          },
        },
      };
      options.yAxis = getPercentageYAxis(false);
      options.xAxis = {
        type: 'category',
        categories: data?.categories || [],
        title: { text: intl.formatMessage({ id: 'app.study-start-year' }) },
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            color: getCSSValue('--g800'),
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      };
      options.legend.reversed = true;
      options.series = data?.series || [];
      return options;
    },
  },
  'resultats.delai-diffusion.chart-repartition': {
    getOptions: (
      id,
      intl,
      data,
      idWithDomainAndStudyType,
      studyType,
      dataTitle,
    ) => {
      const options = getGraphOptions({ id, intl, studyType, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories: data?.categories2 || [],
        plotLines: [
          {
            color: '#000',
            width: 1,
            value: 24,
          },
        ],
      };
      options.xAxis.labels = {
        overflow: 'allow',
        rotation: -90,
        step: 6,
        useHTML: true,
        formatter() {
          const label = this.axis.defaultLabelFormatter.call(this);
          // TODO refacto
          if (label.startsWith('0')) {
            return intl.formatMessage({
              id: `app.${studyType.toLowerCase()}.end`,
            });
          }
          return label;
        },
      };
      options.plotOptions = {
        column: {
          dataLabels: {
            enabled: false,
          },
        },
        series: {
          pointWidth: 10,
        },
      };
      options.series = data?.dataGraph2 || [];
      options.tooltip.pointFormat = intl.formatMessage({
        id: `${idWithDomainAndStudyType}.tooltip`,
      });
      return options;
    },
  },
  'resultats.delai-diffusion.chart-distribution': {
    getOptions: (id, intl, data, studyType) => {
      const options = getGraphOptions({ id, intl, studyType });
      options.chart = {
        type: 'areasplinerange',
        inverted: false,
        height: '600px',
      };
      options.xAxis.gridLineWidth = 1;
      options.xAxis.max = 60;
      options.xAxis.min = -36;
      options.xAxis.labels = {
        formatter() {
          const label = this.axis.defaultLabelFormatter.call(this);
          if (label === '0') {
            return intl.formatMessage({
              id: 'app.studies.end',
            });
          }
          return label;
        },
      };
      options.yAxis = {
        categories: data?.categories3 || [],
        min: 0,
        max: data?.categories3?.length - 1 || 10,
        title: false,
        reversed: true,
      };
      options.plotOptions = {
        areasplinerange: {
          marker: {
            enabled: false,
          },
        },
      };
      options.series = data?.dataGraph3 || [];
      return options;
    },
  },
  'resultats.publication.chart-repartition': {
    getOptions: (id, intl, data, studyType) => {
      const options = getGraphOptions({ id, intl, studyType });
      options.chart.type = 'column';
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            enabled: false,
          },
        },
        column: {
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} %',
          },
        },
      };
      options.yAxis = getPercentageYAxis(false);
      options.xAxis = {
        type: 'category',
        categories: data?.categories || [],
        title: {
          text: intl.formatMessage({ id: 'app.study-completion-year' }),
        },
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            color: getCSSValue('--g800'),
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      };
      options.series = data?.series || [];
      return options;
    },
  },
  'promoteurs.dynamique-ouverture.chart-part': {
    getOptions: (id, intl, data, studyType) => {
      const options = getGraphOptions({ id, intl, studyType });
      options.chart.type = 'bar';
      options.plotOptions = {
        series: {
          stacking: false,
          dataLabels: {
            enabled: false,
          },
        },
        bar: {
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} %',
          },
        },
      };
      options.legend = { enabled: false };
      options.yAxis = getPercentageYAxis(false);
      options.xAxis = {
        type: 'category',
        title: {
          text: intl.formatMessage({ id: 'app.sponsor-type' }),
        },
        categories: data?.categories || [],
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            color: getCSSValue('--g800'),
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      };
      options.series = data?.series || [];
      return options;
    },
  },
  'promoteurs.dynamique-ouverture.chart-evolution-nombre': {
    getOptions: (id, intl, graph, studyType) => {
      const options = getGraphOptions({ id, intl, studyType });
      options.chart.height = '900px';
      options.chart.type = 'bar';
      options.credits.enabled = false;
      options.plotOptions = {
        bar: {
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} %',
          },
        },
      };
      options.yAxis = getPercentageYAxis(false);
      options.yAxis.min = 0;
      options.yAxis.max = 100;
      options.xAxis = {
        type: 'category',
        title: {
          text: intl.formatMessage({ id: 'app.sponsor-type' }),
        },
        categories: graph?.categories2 || [],
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            color: getCSSValue('--g800'),
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      };
      options.series = graph?.series2 || [];
      options.legend.enabled = false;
      return options;
    },
  },
  'promoteurs.impact.chart-repartition': {
    getOptions: (id, intl, data, studyType) => {
      const options = getGraphOptions({ id, intl, studyType });
      options.chart.type = 'column';
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            enabled: false,
          },
        },
        column: {
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} %',
          },
        },
      };
      options.yAxis = getPercentageYAxis(true);
      options.xAxis = {
        type: 'category',
        title: {
          text: intl.formatMessage({ id: 'app.study-completion-year' }),
        },
        categories: data?.categories || [],
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          formatter() {
            const label = '<small>'
              .concat(intl.formatMessage({ id: 'app.fr-only' }))
              .concat('&nbsp; ')
              .concat(intl.formatMessage({ id: 'app.fr-foreign' }))
              .concat('<br />')
              .concat('</small>')
              .concat('<div style="text-align:center;">')
              .concat(this.value)
              .concat('</div>');
            return label;
          },
          useHTML: true,
          style: {
            color: getCSSValue('--g800'),
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      };
      options.series = data?.series || [];
      return options;
    },
  },
  'promoteurs.impact.chart-classement-pays': {
    getOptions: (id, intl, data, studyType) => {
      const options = getGraphOptions({ id, intl, studyType });
      options.chart.type = 'bar';
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            enabled: false,
          },
        },
        bar: {
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} %',
          },
        },
      };
      options.yAxis = getPercentageYAxis(false);
      options.xAxis = {
        type: 'category',
        categories: data?.categories || [],
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            color: getCSSValue('--g800'),
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      };
      options.series = data?.series || [];
      return options;
    },
  },
  'thesis.general.voies-ouverture.chart-repartition-taux': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.defense-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.oa-rate' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'data.general.voies-ouverture.chart-data-shared': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.shared-data' });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
        },
      };
      options.series = data;
      options.exporting.chartOptions.legend.enabled = false;
      return options;
    },
  },
  'data.general.voies-ouverture.chart-data-created': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.created-data' });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
        },
      };
      options.series = data;
      options.exporting.chartOptions.legend.enabled = false;
      return options;
    },
  },
  'software.general.voies-ouverture.chart-software-shared': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.shared-software',
      });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
        },
      };
      options.series = data;
      options.exporting.chartOptions.legend.enabled = false;
      return options;
    },
  },
  'software.general.voies-ouverture.chart-software-created': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.created-software',
      });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
        },
      };
      options.series = data;
      options.exporting.chartOptions.legend.enabled = false;
      return options;
    },
  },
  'software.general.voies-ouverture.chart-software-used': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.used-software',
      });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
        },
      };
      options.exporting.chartOptions.legend.enabled = false;
      options.series = data;
      return options;
    },
  },
  'software.oa.voies-ouverture.chart-software-shared': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'bar';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.shared-software',
      });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
        },
      };
      options.series = data;
      options.exporting.chartOptions.legend.enabled = false;
      return options;
    },
  },
  'data.general.voies-ouverture.chart-data-used': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.used-data',
      });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
        },
      };
      options.series = data;
      options.exporting.chartOptions.legend.enabled = false;
      return options;
    },
  },
  'data.general.voies-ouverture.chart-availibility': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.publication-year' }) },
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.availibility',
      });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
        },
      };
      options.series = data;
      options.exporting.chartOptions.legend.enabled = false;
      return options;
    },
  },
  'software.disciplines.voies-ouverture.chart-software-shared': {
    getOptions: (id, intl, categories, data, dataTitle, sortKey) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'bar';
      options.chart.height = '700px';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.shared-software',
      });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
          dataSorting: {
            enabled: true,
            sortKey,
          },
        },
      };
      options.series = data;
      options.exporting.csv = {
        columnHeaderFormatter: (item) => (item.isXAxis ? 'field' : item.name),
      };
      options.exporting.chartOptions.legend.enabled = false;
      return options;
    },
  },
  'software.disciplines.voies-ouverture.chart-software-created': {
    getOptions: (id, intl, categories, data, dataTitle, sortKey) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'bar';
      options.chart.height = '700px';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.created-software',
      });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
          dataSorting: {
            enabled: true,
            sortKey,
          },
        },
      };
      options.series = data;
      options.exporting.csv = {
        columnHeaderFormatter: (item) => (item.isXAxis ? 'field' : item.name),
      };
      options.exporting.chartOptions.legend.enabled = false;
      return options;
    },
  },
  'software.disciplines.voies-ouverture.chart-software-used': {
    getOptions: (id, intl, categories, data, dataTitle, sortKey) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'bar';
      options.chart.height = '700px';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.used-software',
      });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
          dataSorting: {
            enabled: true,
            sortKey,
          },
        },
      };
      options.series = data;
      options.exporting.csv = {
        columnHeaderFormatter: (item) => (item.isXAxis ? 'field' : item.name),
      };
      options.exporting.chartOptions.legend.enabled = false;
      return options;
    },
  },
  'data.disciplines.voies-ouverture.chart-data-shared': {
    getOptions: (id, intl, categories, data, dataTitle, sortKey) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'bar';
      options.chart.height = '700px';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.shared-data' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
          dataSorting: {
            enabled: true,
            sortKey,
          },
        },
      };
      options.series = data;
      options.exporting.csv = {
        columnHeaderFormatter: (item) => (item.isXAxis ? 'field' : item.name),
      };
      options.exporting.chartOptions.legend.enabled = false;
      return options;
    },
  },
  'data.disciplines.voies-ouverture.chart-data-created': {
    getOptions: (id, intl, categories, data, dataTitle, sortKey) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'bar';
      options.chart.height = '700px';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.created-data' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
          dataSorting: {
            enabled: true,
            sortKey,
          },
        },
      };
      options.series = data;
      options.exporting.csv = {
        columnHeaderFormatter: (item) => (item.isXAxis ? 'field' : item.name),
      };
      options.exporting.chartOptions.legend.enabled = false;
      return options;
    },
  },
  'data.disciplines.voies-ouverture.chart-data-used': {
    getOptions: (id, intl, categories, data, dataTitle, sortKey) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'bar';
      options.chart.height = '700px';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.used-data' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
          dataSorting: {
            enabled: true,
            sortKey,
          },
        },
      };
      options.series = data;
      options.exporting.csv = {
        columnHeaderFormatter: (item) => (item.isXAxis ? 'field' : item.name),
      };
      options.exporting.chartOptions.legend.enabled = false;
      return options;
    },
  },
  'data.disciplines.voies-ouverture.chart-availibility': {
    getOptions: (id, intl, categories, data, dataTitle, sortKey) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'bar';
      options.chart.height = '700px';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.availibility' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
          dataSorting: {
            enabled: true,
            sortKey,
          },
        },
      };
      options.series = data;
      options.exporting.csv = {
        columnHeaderFormatter: (item) => (item.isXAxis ? 'field' : item.name),
      };
      options.exporting.chartOptions.legend.enabled = false;
      return options;
    },
  },
  'data.editeurs.voies-ouverture.chart-availibility': {
    getOptions: (id, intl, categories, data, dataTitle, sortKey) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'bar';
      options.chart.height = '1000px';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({ id: 'app.availibility' });
      options.legend.title.text = intl.formatMessage({
        id: 'app.publi.type-hebergement',
      });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        series: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
          dataSorting: {
            enabled: true,
            sortKey,
          },
        },
      };
      options.series = data;
      options.exporting.csv = {
        columnHeaderFormatter: (item) => (item.isXAxis ? 'field' : item.name),
      };
      options.exporting.chartOptions.legend.enabled = false;
      return options;
    },
  },
  'orcid.general.present.chart-evolution': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'line';
      options.xAxis = {
        categories,
        labels: {
          rotation: -90,
        },
        title: { text: intl.formatMessage({ id: 'app.orcid.creation-date' }) },
      };
      options.yAxis.title.text = intl.formatMessage({ id: 'app.orcid.nb' });
      options.legend.title.text = null;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'orcid.general.present.chart-indicator-active': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: null,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.orcid.proportion',
      });
      options.legend.title.text = null;
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'orcid.general.present.chart-indicator-these-discipline': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'bar';
      options.chart.height = '650px';
      options.xAxis = {
        categories,
        title: null,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.orcid.these-proportion',
      });
      options.legend.title.text = null;
      options.legend.enabled = false;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'orcid.general.present.chart-indicator-these-year': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'line';
      options.xAxis = {
        categories,
        title: { text: '' },
        labels: {
          rotation: -90,
          overflow: 'allow',
          padding: 200,
        },
      };
      options.xAxis.title.text = intl.formatMessage({
        id: 'app.defense-year',
      });
      options.yAxis = getPercentageYAxis(true, null, false, 1);
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.orcid.these-proportion',
      });
      options.legend.title.text = null;
      options.legend.enabled = false;
      options.plotOptions = {
        line: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'orcid.general.present.chart-indicator-hal': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
        title: null,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.orcid.proportion',
      });
      options.legend.title.text = null;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'orcid.general.present.chart-indicator-work': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.orcid.proportion',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'orcid.general.present.chart-indicator-affiliationid': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.orcid.proportion',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'orcid.general.present.chart-indicator-idref-abes': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.orcid.proportion',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'orcid.general.present.chart-indicator-idref-hal': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.orcid.proportion',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'orcid.general.present.chart-indicator-idref-same': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.orcid.proportion',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'orcid.general.present.chart-indicator-idhal-abes': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.orcid.proportion',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'orcid.general.present.chart-indicator-idhal-hal': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.orcid.proportion',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'orcid.general.present.chart-indicator-idhal-same': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.type = 'column';
      options.xAxis = {
        categories,
      };
      options.yAxis = getPercentageYAxis();
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.orcid.proportion',
      });
      options.legend.reversed = true;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
            formatter() {
              return this.y.toFixed(0).concat(' %');
            },
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'orcid.general.present.chart-indicator-worksource': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.height = '650px';
      options.chart.type = 'bar';
      options.yAxis = getPercentageYAxis();
      options.xAxis = {
        categories,
        title: { text: intl.formatMessage({ id: 'app.orcid.work.source' }) },
      };
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.orcid.perc',
      });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'orcid.general.present.chart-indicator-affiliationsource': {
    getOptions: (id, intl, categories, data, dataTitle) => {
      const options = getGraphOptions({ id, intl, dataTitle });
      options.chart.height = '650px';
      options.chart.type = 'bar';
      options.yAxis = getPercentageYAxis();
      options.xAxis = {
        categories,
        title: {
          text: intl.formatMessage({ id: 'app.orcid.affiliation.source' }),
        },
      };
      options.yAxis.title.text = intl.formatMessage({
        id: 'app.orcid.perc',
      });
      options.legend.reversed = true;
      options.legend.enabled = false;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: false,
          },
        },
      };
      options.series = data;
      return options;
    },
  },
  'publi.others.collaborations.international-collaborations': {
    getOptions: (id, intl, categories, data) => {
      const options = getGraphOptions({ id, intl });
      options.chart.type = 'column';
      options.xAxis.categories = categories;
      options.plotOptions = {
        column: {
          stacking: 'normal',
          dataLabels: {
            style: {
              textOutline: 'none',
            },
            enabled: true,
          },
        },
      };
      options.series = data;
      options.tooltip.enabled = false;
      return options;
    },
  },
};
