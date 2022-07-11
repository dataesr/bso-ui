import locals from '../config/locals.json';

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
 * @param precision
 * @returns {string}
 */
export function cleanNumber(num, precision = 1) {
  let myCleanedNumber;
  if (num < 1000) {
    myCleanedNumber = num.toFixed(0);
  } else {
    const units = ['k', 'M', 'B', 'T', 'Q'];
    const unit = Math.floor((num / 1.0e1).toFixed(0).toString().length);
    const r = unit % 3;
    const x = Math.abs(Number(num)) / Number(`1.0e+${unit - r}`);
    myCleanedNumber = `${x.toFixed(precision)} ${
      units[Math.floor(unit / 3) - 1]
    }`;
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
export function clearSessionStorage(keys) {
  for (let i = 0; i < keys.length; i += 1) {
    sessionStorage.removeItem(keys[i]);
  }
}

/**
 *
 * @param observationSnap
 * @returns {string}
 */
export function getPublicationYearFromObservationSnap(observationSnap) {
  let publicationYear;
  if (observationSnap.length > 4) {
    publicationYear = parseFloat(observationSnap.substring(0, 4)) - 1;
  } else {
    publicationYear = observationSnap - 1;
  }
  return publicationYear;
}

export function getObservationLabel(observationSnap, intl, newline = false) {
  let label = observationSnap?.substring(0, 4);
  if (observationSnap?.length > 4) {
    const quarter = observationSnap?.substring(4, 6);
    const sep = newline ? '<br/>' : ' - ';
    if (quarter !== 'Q4' && intl.messages[`app.${quarter}`]) {
      label = label
        .concat(sep)
        .concat(intl.formatMessage({ id: `app.${quarter}` }));
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
 * List all the sources used to build a graph
 * @param {string} id
 * @param {string[]} otherSources
 * @returns {string}
 */
export function getSource(id, otherSources = []) {
  const sources = [];
  if (id.includes('-publi') || id.includes('publication')) {
    sources.push('Unpaywall');
  }
  if (
    id.includes('health-general')
    || id.includes('health-caracteristiques')
    || id.includes('health-promoteurs')
    || id.includes('health-resultats')
  ) {
    sources.push('clinicaltrials.gov');
    sources.push('EU Clinical Trial Register');
  }
  if (id.includes('health-publi')) {
    sources.push('PubMed');
  }
  if (id.includes('couts-publi')) {
    sources.push('openAPC');
    sources.push('DOAJ');
  }
  if (id.includes('publishers.poids-revue')) {
    sources.push('beallslist.net');
  }
  sources.push('MESRI');
  sources.push(...otherSources);
  return sources.join(', ');
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

/**
 *
 * @returns boolean
 */
export function isInLocal() {
  return (
    window.location.hostname === 'localhost'
    || window.location.hostname === '127.0.0.1'
  );
}

/**
 *
 * @returns boolean
 */
export function isInProduction() {
  return process.env.REACT_APP_ENV === 'production';
}

/**
 * Create a dedicated object from search location
 * @param {string} search
 * @returns {Object}
 */
export function getURLSearchParams(intl = undefined) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const bsoLocalAffiliation = urlSearchParams.get('bsoLocalAffiliation')?.toLowerCase() || undefined;
  const bsoCountry = urlSearchParams.get('bsoCountry')?.toLowerCase()
    || locals?.[bsoLocalAffiliation]?.country
    || 'fr';
  const observationYear = urlSearchParams.get('observationYear')?.toLowerCase()
    || locals?.[bsoLocalAffiliation]?.observationYear
    || process.env.REACT_APP_LAST_OBSERVATION;
  const idTypes = ['doi'];
  const useHalId = (urlSearchParams.get('useHalId')?.toLowerCase() || 'false') === 'true';
  if (useHalId) {
    idTypes.push('hal');
  }
  const displayComment = !(
    urlSearchParams.get('displayComment')?.toLowerCase() === 'false'
  );
  const displayFooter = !(
    urlSearchParams.get('displayFooter')?.toLowerCase() === 'false'
  );
  let commentsName = intl?.formatMessage({ id: 'app.french', defaultMessage: 'françaises' })
    || 'françaises';
  let displayTitle;
  let endYear;
  let name;
  let startYear = 2013;
  const selectedLang = sessionStorage.getItem('__bso_lang__');
  const commentsNameProperty = selectedLang === 'en' ? 'commentsNameEN' : 'commentsName';

  if (bsoLocalAffiliation) {
    commentsName = urlSearchParams.get('commentsName')?.toLowerCase()
      || locals?.[bsoLocalAffiliation]?.[commentsNameProperty]
      || intl.formatMessage({ id: 'app.french', defaultMessage: 'françaises' });
    displayTitle = !(
      (
        urlSearchParams.get('displayTitle')
        || locals?.[bsoLocalAffiliation]?.displayTitle
      )?.toLowerCase() === 'false'
    );
    endYear = parseInt(
      urlSearchParams.get('endYear')?.toLowerCase()
        || locals?.[bsoLocalAffiliation]?.endYear,
      10,
    );
    name = urlSearchParams.get('name')?.toLowerCase()
      || locals?.[bsoLocalAffiliation]?.name;
    startYear = parseInt(
      urlSearchParams.get('startYear')?.toLowerCase()
        || locals?.[bsoLocalAffiliation]?.startYear
        || 2013,
      10,
    );
  }

  return {
    bsoCountry,
    bsoLocalAffiliation,
    commentsName,
    displayComment,
    displayTitle,
    displayFooter,
    endYear,
    idTypes,
    name,
    observationYear,
    startYear,
  };
}

export function getAllIndexes(arr, val) {
  const indexes = [];
  for (let i = 0; i < arr.length; i += 1) if (arr[i] === val) indexes.push(i);
  return indexes;
}
