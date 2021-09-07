import {
  archiveouverte100,
  bluedark75,
  discipline100,
  discipline125,
  editeurplateforme100,
  g800,
} from '../style/colours.module.scss';
import {
  cleanNumber,
  getPercentageYAxis,
  getPublicationYearFromObservationSnap,
} from './helpers';

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

/**
 *
 * @param key
 * @param domain
 * @param parameters
 * @returns {*|{}}
 */
export function getFetchOptions(key, domain, ...parameters) {
  const allOptions = {
    publicationRate: ([
      observationSnap,
      needlePublisher = '*',
      oaHostType = '*',
    ]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            { wildcard: { 'publisher.keyword': needlePublisher } },
            {
              wildcard: {
                [`oa_details.${observationSnap}.oa_host_type`]: oaHostType,
              },
            },
          ],
        },
      },
      aggs: {
        by_publication_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_is_oa: {
              terms: {
                field: `oa_details.${observationSnap}.is_oa`,
              },
            },
          },
        },
      },
    }),
    publicationRateRangUtile: ([observationSnap]) => ({
      size: 0,
      aggs: {
        by_publication_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_author_useful_rank_fr: {
              terms: {
                field: 'author_useful_rank_fr',
              },
              aggs: {
                by_is_oa: {
                  terms: {
                    field: `oa_details.${observationSnap}.is_oa`,
                  },
                },
              },
            },
          },
        },
      },
    }),
    publicationRatePays: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
            { term: { author_useful_rank_fr: true } },
          ],
        },
      },
      aggs: {
        by_country: {
          terms: {
            field: 'detected_countries.keyword',
            size: 21,
          },
          aggs: {
            by_is_oa: {
              terms: {
                field: `oa_details.${observationSnap}.is_oa`,
              },
            },
          },
        },
      },
    }),
    repositoriesHisto: ([observationSnap]) => ({
      size: 0,
      aggs: {
        by_repository: {
          terms: {
            field: `oa_details.${observationSnap}.repositories.keyword`,
            exclude: 'pdfs.semanticscholar.org',
            size: 12,
          },
          aggs: {
            by_year: { terms: { field: 'year' } },
          },
        },
      },
    }),
    couvertureHAL: ([observationSnap, needleRepository = '*']) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                [`oa_details.${observationSnap}.oa_host_type`]: 'repository',
              },
            },
            {
              wildcard: {
                [`oa_details.${observationSnap}.repositories.keyword`]:
                  needleRepository,
              },
            },
          ],
        },
      },
      aggs: {
        by_publication_year: {
          terms: {
            field: 'year',
          },
        },
      },
    }),
    disciplinesHisto: ([observationSnap, disciplineField]) => ({
      size: 0,
      aggs: {
        by_discipline: {
          terms: {
            field: `${disciplineField}.keyword`,
            size: 25,
          },
          aggs: {
            by_observation_year: {
              terms: {
                field: `oa_details.${observationSnap}.observation_date.keyword`,
                size: 10000,
              },
              aggs: {
                by_year: {
                  terms: {
                    field: 'year',
                  },
                  aggs: {
                    by_is_oa: {
                      terms: {
                        field: `oa_details.${observationSnap}.is_oa`,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    disciplinesVoies: ([observationSnap]) => ({
      size: 0,
      aggs: {
        by_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_oa_host_type: {
              terms: {
                field: `oa_details.${observationSnap}.oa_host_type.keyword`,
              },
              aggs: {
                by_discipline: {
                  terms: {
                    field: 'bsso_classification.field.keyword',
                    size: 25,
                  },
                },
              },
            },
          },
        },
      },
    }),
    disciplinesVoiesEvolutions: ([observationSnap]) => ({
      size: 0,
      aggs: {
        by_discipline: {
          terms: {
            field: 'bsso_classification.field.keyword',
            size: 25,
          },
          aggs: {
            by_oa_colors: {
              terms: {
                field: `oa_details.${observationSnap}.oa_colors.keyword`,
              },
            },
          },
        },
      },
    }),
    publication: () => ({
      size: 0,
      aggs: {
        publication_count: {
          cardinality: {
            field: 'doi.keyword',
            precision_threshold: 1000,
          },
        },
      },
    }),
    publisher: () => ({
      size: 0,
      aggs: {
        publisher_count: {
          cardinality: {
            field: 'publisher.keyword',
            precision_threshold: 10,
          },
        },
      },
    }),
    publishersList: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
            {
              term: {
                [`oa_details.${observationSnap}.oa_host_type`]: 'publisher',
              },
            },
          ],
        },
      },
      aggs: {
        by_publisher: {
          terms: {
            field: 'publisher.keyword',
            size: 10000,
          },
        },
      },
    }),
    publishersTypesHisto: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                [`oa_details.${observationSnap}.oa_host_type`]: 'publisher',
              },
            },
          ],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_oa_colors: {
              terms: {
                field: `oa_details.${observationSnap}.oa_colors_with_priority_to_publisher.keyword`,
              },
            },
          },
        },
      },
    }),
    publishersPolitiqueHisto: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
            { exists: { field: `oa_details.${observationSnap}` } },
          ],
        },
      },
      aggs: {
        by_publisher: {
          terms: {
            field: 'publisher.keyword',
          },
          aggs: {
            by_oa_colors: {
              terms: {
                field: `oa_details.${observationSnap}.oa_colors_with_priority_to_publisher.keyword`,
              },
            },
          },
        },
      },
    }),
    publishersPolitiqueBulle: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
            { exists: { field: `oa_details.${observationSnap}` } },
          ],
        },
      },
      aggs: {
        by_publisher: {
          terms: {
            field: 'publisher.keyword',
          },
          aggs: {
            by_oa_colors: {
              terms: {
                field: `oa_details.${observationSnap}.oa_colors.keyword`,
              },
            },
          },
        },
      },
    }),
    publishersLicence: ([observationSnap, needlePublisher = '*']) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
            {
              term: {
                [`oa_details.${observationSnap}.oa_host_type`]: 'publisher',
              },
            },
            { wildcard: { 'publisher.keyword': needlePublisher } },
          ],
        },
      },
      aggs: {
        by_is_oa: {
          terms: {
            field: `oa_details.${observationSnap}.is_oa`,
          },
          aggs: {
            by_licence: {
              terms: {
                field: `oa_details.${observationSnap}.licence_publisher.keyword`,
              },
            },
          },
        },
        by_publisher: {
          terms: {
            field: 'publisher.keyword',
          },
          aggs: {
            by_licence: {
              terms: {
                field: `oa_details.${observationSnap}.licence_publisher.keyword`,
              },
            },
          },
        },
      },
    }),
    apcYear: ([observationSnap, needle]) => ({
      size: 0,
      query: {
        bool: {
          filter: [{ wildcard: { 'publisher.keyword': needle } }],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_oa_colors: {
              terms: {
                field: `oa_details.${observationSnap}.oa_colors.keyword`,
              },
              aggs: {
                apc: {
                  sum: {
                    field: 'amount_apc_EUR',
                  },
                },
              },
            },
          },
        },
      },
    }),
    apcHistogram: ([observationSnap, needle]) => ({
      size: 0,
      query: {
        bool: {
          filter: [{ wildcard: { 'publisher.keyword': needle } }],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_oa_colors: {
              terms: {
                field: `oa_details.${observationSnap}.oa_colors.keyword`,
              },
              aggs: {
                apc: {
                  histogram: {
                    field: 'amount_apc_EUR',
                    interval: 250,
                    hard_bounds: {
                      min: 0,
                      max: 6000,
                    },
                    extended_bounds: {
                      min: 0,
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    apcPercentile: ([observationSnap, needle]) => ({
      size: 0,
      query: {
        bool: {
          filter: [{ wildcard: { 'publisher.keyword': needle } }],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_oa_colors: {
              terms: {
                field: `oa_details.${observationSnap}.oa_colors.keyword`,
              },
              aggs: {
                apc: {
                  percentiles: {
                    field: 'amount_apc_EUR',
                  },
                },
              },
            },
          },
        },
      },
    }),
    predatory: () => ({
      size: 0,
      aggs: {
        by_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_predatory: {
              terms: {
                field: 'predatory_journal',
              },
            },
          },
        },
      },
    }),
    journal: () => ({
      size: 0,
      aggs: {
        journal_count: {
          cardinality: {
            field: 'journal_issn_l.keyword',
            precision_threshold: 10,
          },
        },
      },
    }),
    repository: () => ({
      size: 0,
      aggs: {
        repositories_count: {
          cardinality: {
            field: 'oa_details.2021Q2.repositories.keyword',
            precision_threshold: 10,
          },
        },
      },
    }),
    repositoriesList: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
            {
              term: {
                [`oa_details.${observationSnap}.oa_host_type`]: 'repository',
              },
            },
          ],
        },
      },
      aggs: {
        by_repository: {
          terms: {
            field: `oa_details.${observationSnap}.repositories.keyword`,
            size: 10000,
          },
        },
      },
    }),
    obsDates: () => ({
      size: 0,
      aggs: {
        observation_dates_count: {
          cardinality: {
            field: 'observation_dates.keyword',
            precision_threshold: 1,
          },
        },
      },
    }),
    observationSnaps: () => ({
      size: 0,
      aggs: {
        observation_dates: {
          terms: { field: 'observation_dates.keyword', size: 100 },
        },
      },
    }),
    interventional: () => ({
      size: 0,
      aggs: {
        study_type: {
          terms: { field: 'study_type.keyword' },
        },
      },
    }),
    observational: () => ({
      size: 0,
      aggs: {
        study_type: {
          terms: { field: 'study_type.keyword' },
        },
      },
    }),
    publiCardData: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
            { exists: { field: `oa_details.${observationSnap}` } },
          ],
        },
      },
      aggs: {
        count_publications: {
          cardinality: {
            field: 'doi.keyword',
            precision_threshold: 100,
          },
        },
        by_is_oa: {
          terms: {
            field: `oa_details.${observationSnap}.is_oa`,
          },
        },
        by_oa_colors: {
          terms: {
            field: `oa_details.${observationSnap}.oa_colors.keyword`,
          },
          aggs: {
            apc: {
              sum: {
                field: 'amount_apc_EUR',
              },
            },
          },
        },
        by_oa_colors_with_priority_to_publisher: {
          terms: {
            field: `oa_details.${observationSnap}.oa_colors_with_priority_to_publisher.keyword`,
          },
        },
        by_repositories: {
          terms: {
            field: `oa_details.${observationSnap}.repositories.keyword`,
            size: 15,
          },
        },
        by_lang: {
          terms: {
            field: 'lang.keyword',
          },
        },
        by_author_useful_rank: {
          terms: {
            field: 'author_useful_rank_countries.keyword',
            size: 2,
          },
        },
      },
    }),
    oaHostType: ([lastObservationSnap]) => ({
      size: 0,
      aggs: {
        by_publication_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_oa_host_type: {
              terms: {
                field: `oa_details.${lastObservationSnap}.oa_host_type.keyword`,
              },
            },
          },
        },
      },
    }),
    declarationRate: ([lastObservationSnap]) => ({
      size: 0,
      aggs: {
        by_is_oa: {
          terms: {
            field: `oa_details.${lastObservationSnap}.is_oa`,
          },
          aggs: {
            by_oa_host_type: {
              terms: {
                field: `oa_details.${lastObservationSnap}.oa_host_type.keyword`,
              },
              aggs: {
                by_grant_agency: {
                  terms: {
                    field: 'grants.agency.keyword',
                  },
                },
              },
            },
          },
        },
      },
    }),
    openingRate: ([observationSnap, queryFilter]) => ({
      size: 0,
      query: {
        bool: {
          filter: queryFilter,
        },
      },
      aggs: {
        by_publication_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_has_grant: {
              terms: {
                field: 'has_grant',
              },
              aggs: {
                by_is_oa: {
                  terms: {
                    field: `oa_details.${observationSnap}.is_oa`,
                  },
                },
              },
            },
            by_is_oa: {
              terms: {
                field: `oa_details.${observationSnap}.is_oa`,
              },
            },
          },
        },
      },
    }),
    allAgencies: ([lastObservationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(
                  lastObservationSnap,
                ),
              },
            },
            { exists: { field: `oa_details.${lastObservationSnap}` } },
          ],
        },
      },
      aggs: {
        by_agency: {
          terms: {
            field: 'grants.agency.keyword',
          },
        },
      },
    }),
    openingType: ([lastObservationSnap, field, splitField]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(
                  lastObservationSnap,
                ),
              },
            },
          ],
        },
      },
      aggs: {
        by_is_oa: {
          terms: {
            field: `oa_details.${lastObservationSnap}.${field}`,
            order: { _key: 'asc' },
          },
          aggs: {
            by_publication_split: {
              terms: {
                field: `${splitField}`,
              },
            },
          },
        },
      },
    }),
    affiliationsList: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
          ],
        },
      },
      aggs: {
        by_affiliation: {
          terms: {
            field: 'french_affiliations_types.keyword',
            size: 10000,
          },
        },
      },
    }),
  };
  const queryResponse = allOptions[key](parameters) || {};
  if (!queryResponse.query?.bool?.filter) {
    queryResponse.query = { bool: { filter: [] } };
  }
  if (domain) {
    queryResponse.query.bool.filter.push({
      term: { 'domains.keyword': domain },
    });
  }
  return queryResponse;
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

      options.chart = {
        type: 'bar',
        height: '600px',
      };

      options.xAxis = {
        categories,
      };

      options.legend = {
        title: {
          text: intl.formatMessage({ id: `${id}.legend` }),
        },
      };

      options.plotOptions = {
        series: {
          stacking: 'normal',
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
              enabled: true,
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
                text: intl.formatMessage({ id: `${id}.goal` }),
              },
            ],
            labelOptions: {
              borderRadius: 0,
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
        categories: data.map((el) => intl.formatMessage({ id: `app.discipline.${el.name}` })),
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
