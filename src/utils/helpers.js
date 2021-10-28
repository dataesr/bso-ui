/**
 *
 * @param property
 * @returns {string}
 */
export function getCSSValue(property) {
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
export function getFormattedDate(date, lang) {
  const dateFormat = { fr: 'fr-fr', en: 'en-en' };
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(dateFormat[lang], options);
}

/**
 *
 * @param path
 * @param object
 * @returns {*}
 * Returns null if path does not exist in object
 */
export function getValueByPath(path, object) {
  return path
    .split('.')
    .reduce((p, prop) => (p && prop in p ? p[prop] : null), object);
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
export function cleanNumber(num, precision = 1) {
  let myCleanedNumber = '';
  if (num < 1000) {
    myCleanedNumber = num.toFixed(0);
  } else {
    const units = ['k', 'M', 'B', 'T', 'Q'];
    const unit = Math.floor((num / 1.0e1).toFixed(0).toString().length);
    const r = unit % 3;
    const x = Math.abs(Number(num)) / Number(`1.0e+${unit - r}`);
    myCleanedNumber = `${x.toFixed(precision)} ${units[Math.floor(unit / 3) - 1]}`;
  }
  return myCleanedNumber;
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

export function getPercentageYAxis(showTotal = true, max = null) {
  const axis = {
    title: { text: '' },
    stackLabels: {
      enabled: true,
      formatter() {
        return showTotal && this.total
          ? this.total.toFixed(0).concat(' %')
          : '';
      },
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
      },
    },
    labels: {
      formatter() {
        return this.axis.defaultLabelFormatter.call(this).concat(' %');
      },
    },
  };
  if (max) {
    axis.max = max;
  }
  return axis;
}

/**
 *
 * @param keys
 */
export function clearLocalStorage(keys) {
  for (let i = 0; i < keys.length; i += 1) {
    localStorage.removeItem(keys[i]);
  }
}

/**
 *
 * @param observationSnap
 * @returns {string}
 */
export function getPublicationYearFromObservationSnap(observationSnap) {
  let publicationYear = '';

  if (observationSnap.length > 4) {
    publicationYear = parseFloat(observationSnap.substring(0, 4)) - 1;
  } else {
    publicationYear = observationSnap - 1;
  }

  return publicationYear || '2020';
}

export function getObservationLabel(observationSnap, intl, newline = false) {
  let label = observationSnap.substring(0, 4);
  if (observationSnap.length > 4) {
    const quarter = observationSnap.substring(4, 6);
    const sep = newline ? '<br/>' : ' - ';
    if (intl.messages[`app.${quarter}`]) {
      label = label.concat(sep).concat(intl.formatMessage({ id: `app.${quarter}` }));
    }
  }
  return label;
}

/**
 *
 * @param id
 * @param domain
 * @returns {string}
 */
export function withDomain(id, domain = 'national') {
  // TODO change graph id format
  return `app.${domain || 'national'}-${id}`;
}

/**
 *
 * @param id
 * @param studyType
 * @returns {string}
 */
export function withtStudyType(id, studyType = 'Interventional') {
  let newId = id;
  if (studyType) {
    newId = id.replace('-', `-${studyType.toLowerCase() || 'interventional'}.`);
  }
  return newId;
}

/**
 *
 * @param id
 * @param domain
 * @param studyType
 * @returns {string}
 * Context includes domain and studyType infos
 */
export function withContext(id, domain, studyType) {
  return withtStudyType(withDomain(id, domain), studyType);
}

/**
 *
 * @param id
 * @returns {string}
 */
export function getSource(id) {
  let source = '';
  if (id.includes('-publi') || id.includes('publication')) {
    source += 'Unpaywall, ';
  }
  if (id.includes('studies.')) {
    source += 'clinicaltrials.gov, EU Clinical Trial Register, ';
  }
  if (id.includes('health-publi')) {
    source += 'PubMed, ';
  }
  if (id.includes('couts-publi')) {
    source += 'openAPC, DOAJ, ';
  }
  if (id.includes('publishers.poids-revue')) {
    source += 'beallslist.net, ';
  }
  source += 'MESRI';
  return source;
}

/**
 *
 * @param str
 * @returns {string}
 * Capitalize the first letter of a word
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 *
 * @param str
 * @param key
 * @param array
 * @returns array
 */
export function stringIsIntTheKitchen(str, key, array) {
  return array.filter((elm) => str.startsWith(elm[key]));
}
