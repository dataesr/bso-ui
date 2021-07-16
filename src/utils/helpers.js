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
    title: {
      text: intl.formatMessage({ id: `${graphId}.title` }),
      align: 'left',
      style: {
        color: 'var(--blue-dark-125)',
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
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
