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
    const nameA = a ? getValueByPath(path, a).toLowerCase() : 0;
    const nameB = b ? getValueByPath(path, b).toLowerCase() : 0;
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
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
export function getFetchOptions(key, parameter) {
  const allOptions = {
    publicationRate: (year) => ({
      size: 0,
      aggs: {
        by_publication_year: {
          terms: {
            field: 'publication_year',
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
            field: 'oa_details.2021Q1.repositories.keyword',
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
  };
  return (parameter ? allOptions[key](parameter) : allOptions[key]) || {};
}
