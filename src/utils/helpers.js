/**
 *
 * @param property
 * @returns {string}
 */
export function getCSSProperty(property) {
  return getComputedStyle(document.documentElement).getPropertyValue(property);
}

/**
 *
 * @param property
 * @param value
 */
export function setCSSProperty(property, value) {
  document.documentElement.style.setProperty(property, value);
}

/**
 *
 * @param date
 * @param lang
 * @returns {string}
 */
export function getDateFormated(date, lang) {
  const dateFormat = { fr: 'fr-fr', en: 'en-en' };
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(dateFormat[lang], options);
}

/**
 *
 * @param path
 * @param object
 * @returns {*}
 */
export function getValueByPath(path, object) {
  return path.split('.').reduce((p, prop) => p[prop], object);
}

/**
 *
 * @param array
 * @param path
 * @returns {*[]}
 */
export function sortByPath(array, path) {
  return [...array].sort((a, b) => {
    const valueA = a ? getValueByPath(path, a).toLowerCase() : 0;
    const valueB = b ? getValueByPath(path, b).toLowerCase() : 0;
    if (valueA < valueB) {
      return -1;
    }
    if (valueA > valueB) {
      return 1;
    }
    return 0;
  });
}

/**
 *
 * @param num
 * @returns {string}
 */
export function cleanBigNumber(num) {
  const units = ['M', 'B', 'T', 'Q'];
  const unit = Math.floor((num / 1.0e1).toFixed(0).toString().length);
  const r = unit % 3;
  const x = Math.abs(Number(num)) / Number(`1.0e+${unit - r}`).toFixed(2);
  return `${x.toFixed(2)}${units[Math.floor(unit / 3) - 2]}`;
}

/**
 *
 * @param num
 * @param lang
 * @param options
 * @returns {*}
 */
export function formatNumberByLang(num, lang, options = {}) {
  return Intl.NumberFormat(`${lang}-${lang.toUpperCase()}`, options).format(
    num,
  );
}
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
 * @param parameter
 * @returns {*|{}}
 */
export function getFetchOptions(key, observationDate) {
  const allOptions = {
    publicationRate: (year) => ({
      size: 0,
      query: {
        bool: {
          filter: [{ term: { 'domains.keyword': 'health' } }],
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
                field: `oa_details.${year}.is_oa`,
              },
            },
          },
        },
      },
    }),
    repositoriesHisto: (year) => ({
      size: 0,
      query: {
        bool: {
          filter: [{ term: { 'domains.keyword': 'health' } }],
        },
      },
      aggs: {
        by_repository: {
          terms: {
            field: `oa_details.${year}.repositories.keyword`,
            missing: 'N/A',
            size: 13,
          },
          aggs: {
            by_year: { terms: { field: 'year' } },
          },
        },
      },
    }),
    disciplinesHisto: (year) => ({
      size: 0,
      query: {
        bool: {
          filter: [{ term: { 'domains.keyword': 'health' } }],
        },
      },
      aggs: {
        by_discipline: {
          terms: {
            field: 'bsso_classification.field.keyword',
          },
          aggs: {
            by_observation_year: {
              terms: {
                field: `oa_details.${year}.observation_date.keyword`,
                size: 10000,
              },
              aggs: {
                by_year: {
                  terms: {
                    field: 'year',
                  },
                },
              },
            },
          },
        },
      },
    }),
    publication: {
      size: 0,
      query: {
        bool: {
          filter: [{ term: { 'domains.keyword': 'health' } }],
        },
      },
      aggs: {
        publication_count: {
          cardinality: {
            field: 'doi.keyword',
            precision_threshold: 1000,
          },
        },
      },
    },
    publisher: {
      size: 0,
      query: {
        bool: {
          filter: [{ term: { 'domains.keyword': 'health' } }],
        },
      },
      aggs: {
        publisher_count: {
          cardinality: {
            field: 'publisher.keyword',
            precision_threshold: 10,
          },
        },
      },
    },
    publishersList: {
      size: 0,
      query: {
        bool: {
          filter: [{ term: { 'domains.keyword': 'health' } }],
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
    },
    publishersTypesHisto: (year) => ({
      size: 0,
      query: {
        bool: {
          filter: [{ term: { 'domains.keyword': 'health' } }],
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
                field: `oa_details.${year}.oa_colors_with_priority_to_publisher.keyword`,
              },
            },
          },
        },
      },
    }),
    journal: {
      size: 0,
      query: {
        bool: {
          filter: [{ term: { 'domains.keyword': 'health' } }],
        },
      },
      aggs: {
        journal_count: {
          cardinality: {
            field: 'journal_issn_l.keyword',
            precision_threshold: 10,
          },
        },
      },
    },
    repository: {
      size: 0,
      query: {
        bool: {
          filter: [{ term: { 'domains.keyword': 'health' } }],
        },
      },
      aggs: {
        repositories_count: {
          cardinality: {
            field: 'oa_details.2021Q2.repositories.keyword',
            precision_threshold: 10,
          },
        },
      },
    },
    obsDates: {
      size: 0,
      query: {
        bool: {
          filter: [{ term: { 'domains.keyword': 'health' } }],
        },
      },
      aggs: {
        observation_dates_count: {
          cardinality: {
            field: 'observation_dates.keyword',
            precision_threshold: 1,
          },
        },
      },
    },
    observationDates: {
      size: 0,
      query: {
        bool: {
          filter: [{ term: { 'domains.keyword': 'health' } }],
        },
      },
      aggs: {
        observation_dates: {
          terms: { field: 'observation_dates.keyword', size: 100 },
        },
      },
    },
    interventional: {
      size: 0,
      aggs: {
        study_type: {
          terms: { field: 'study_type.keyword' },
        },
      },
    },
    observational: {
      size: 0,
      aggs: {
        study_type: {
          terms: { field: 'study_type.keyword' },
        },
      },
    },
    publiSanteData: {
      size: 0,
      query: {
        bool: {
          filter: [
            { term: { 'domains.keyword': 'health' } },
            { exists: { field: 'oa_details.2020' } },
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
            field: 'oa_details.2020.is_oa',
          },
        },
        sum_apc: {
          sum: {
            field: 'amount_apc_EUR',
          },
        },
        by_oa_colors: {
          terms: {
            field: 'oa_details.2020.oa_colors.keyword',
          },
        },
        by_repositories: {
          terms: {
            field: 'oa_details.2020.repositories.keyword',
            size: 1,
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
    },
  };
  return (
    (observationDate ? allOptions[key](observationDate) : allOptions[key]) || {}
  );
}
