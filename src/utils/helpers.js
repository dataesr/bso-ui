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
    return valueA && valueA.localeCompare ? valueA.localeCompare(valueB) : 0;
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

export function getPercentageYAxis(
  showTotal = true,
  max = null,
  absolute = false,
  precision = 0,
) {
  const suffix = absolute ? '' : ' %';
  const axis = {
    title: { text: '' },
    stackLabels: {
      enabled: true,
      formatter() {
        return showTotal && this.total
          ? this.total.toFixed(precision).concat(suffix)
          : '';
      },
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
      },
    },
    labels: {
      formatter() {
        return this.axis.defaultLabelFormatter.call(this).concat(suffix);
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
    sources.push('HAL');
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
  if (
    id.includes('thesis')
    || id.includes('orcid.general.creation-by-year')
    || id.includes('orcid.general.chart-indicator-these-year')
    || id.includes('orcid.general.chart-indicator-these-discipline')
  ) {
    sources.push('theses.fr');
  }
  if (id.includes('hal')) {
    sources.push('HAL');
  }
  if (id.includes('orcid')) {
    sources.push('ORCID');
  }
  if (id.includes('idref')) {
    sources.push('idref');
  }
  if (id.includes('retractions')) {
    sources.push('Retractation Watch');
  }
  sources.push('MESR');
  sources.push(...otherSources);
  // Deduplicate sources
  return [...new Set(sources)].join(', ');
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
 * Calculate the bsoLocalAffiliation identifier according to the urlSearchParams
 * @param {Object} urlSearchParams
 * @returns {string}
 */
function getLocalAffiliation(urlSearchParams) {
  // Should adapt the graph only in iframes
  // Prevent seeing the whole website for a bsoLocalAffiliation
  if (!window.location.href.includes('integration')) {
    return undefined;
  }
  let bsoLocalAffiliation = urlSearchParams?.get('bsoLocalAffiliation')?.toLowerCase() || undefined;
  // If bsoLocalAffiliation exists in config
  if (
    Object.keys(locals)
      .map((item) => item.toLowerCase())
      .includes(bsoLocalAffiliation)
  ) {
    return bsoLocalAffiliation;
  }
  // If bsoLocalAffiliation is the Paysage or the RoR of a structure in locals config file
  const matched = Object.keys(locals).filter((key) => [
    locals[key]?.paysage?.toLowerCase(),
    locals[key]?.ror?.toLowerCase(),
    locals[key]?.ror?.replace('https://ror.org/', '').toLowerCase(),
  ].includes(bsoLocalAffiliation));
  if (bsoLocalAffiliation && matched.length > 0) {
    bsoLocalAffiliation = matched[0].toLocaleLowerCase();
  }
  return bsoLocalAffiliation;
}

/**
 * Create a dedicated object from search location
 * @param {string} search
 * @returns {Object}
 */
export function getURLSearchParams(intl = undefined, id = '') {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const bsoLocalAffiliation = getLocalAffiliation(urlSearchParams);
  // Turn all the keys of locals object to lower case?
  const localsLowerCase = Object.fromEntries(
    Object.entries(locals).map(([k, v]) => [k.toLowerCase(), v]),
  );
  const localAffiliationSettings = localsLowerCase?.[bsoLocalAffiliation];
  const alias = localAffiliationSettings?.alias;
  const bsoCountry = urlSearchParams.get('bsoCountry')?.toLowerCase()
    || localAffiliationSettings?.country
    || 'fr';
  let lastObservationYear = '2023Q4';
  if (urlSearchParams.get('lastObservationYear')?.toLowerCase() === 'latest') {
    lastObservationYear = process.env.REACT_APP_LAST_OBSERVATION;
  } else if (urlSearchParams.get('lastObservationYear')?.toLowerCase()) {
    lastObservationYear = urlSearchParams
      .get('lastObservationYear')
      ?.toLowerCase();
  } else if (localAffiliationSettings?.lastObservationYear) {
    lastObservationYear = localAffiliationSettings?.lastObservationYear;
  } else if (bsoLocalAffiliation === undefined) {
    lastObservationYear = process.env.REACT_APP_LAST_OBSERVATION;
  }
  let firstObservationYear = urlSearchParams.get('firstObservationYear')?.toLowerCase()
    || localAffiliationSettings?.firstObservationYear
    || '2018';
  const agency = urlSearchParams.get('agency')?.toLowerCase()
    || localAffiliationSettings?.agency;
  const idTypes = ['crossref'];
  const useHalId = (urlSearchParams.get('useHalId')?.toLowerCase() || 'false') === 'true';
  if (useHalId) {
    idTypes.push('hal_id');
    firstObservationYear = '2022';
  }
  const displayComment = !(
    urlSearchParams.get('displayComment')?.toLowerCase() === 'false'
  );
  const displayFooter = !(
    urlSearchParams.get('displayFooter')?.toLowerCase() === 'false'
  );
  const isPublication = window.location.pathname.startsWith('/publication')
    || id.startsWith('publi.')
    || id.startsWith('app.national-publi')
    || id.startsWith('app.health-publi');
  let commentsName = intl?.formatMessage({ id: 'app.french', defaultMessage: 'françaises' })
    || 'françaises';
  if (
    id.includes(
      'publi.general.dynamique-ouverture.chart-taux-ouverture-article',
    )
    && commentsName === 'françaises'
  ) {
    commentsName = 'français';
  }
  let displayTitle;
  let endYear;
  let name;
  let startYear = 2013;
  const selectedLang = sessionStorage.getItem('__bso_lang__');
  const commentsNameProperty = selectedLang === 'en' ? 'commentsNameEN' : 'commentsName';

  if (bsoLocalAffiliation) {
    commentsName = urlSearchParams.get('commentsName')?.toLowerCase()
      || localAffiliationSettings?.[commentsNameProperty]
      || 'du périmètre '.concat(bsoLocalAffiliation)
      || intl?.formatMessage({ id: 'app.french', defaultMessage: 'françaises' })
      || 'françaises';
    displayTitle = !(
      (
        urlSearchParams.get('displayTitle')
        || localAffiliationSettings?.displayTitle
      )?.toLowerCase() === 'false'
    );
    endYear = parseInt(
      urlSearchParams.get('endYear')?.toLowerCase()
        || localAffiliationSettings?.endYear,
      10,
    );
    name = urlSearchParams.get('name')?.toLowerCase()
      || localAffiliationSettings?.name
      || 'Périmètre '.concat(bsoLocalAffiliation);
    startYear = parseInt(
      urlSearchParams.get('startYear')?.toLowerCase()
        || localAffiliationSettings?.startYear
        || 2013,
      10,
    );
  }

  if (isPublication) {
    if (useHalId) {
      commentsName = commentsName.concat(
        ', ',
        intl?.formatMessage({
          id: 'app.doi-hal',
          defaultMessage: 'avec un DOI Crossref ou un identifiant HAL',
        }),
        ',',
      );
    } else {
      commentsName = commentsName.concat(
        ', ',
        intl?.formatMessage({
          id: 'app.doi',
          defaultMessage: 'avec un DOI Crossref',
        }),
        ',',
      );
    }
  }

  return {
    agency,
    bsoCountry,
    bsoLocalAffiliation: alias || bsoLocalAffiliation,
    commentsName,
    displayComment,
    displayTitle,
    displayFooter,
    endYear,
    firstObservationYear,
    idTypes,
    lastObservationYear,
    name,
    startYear,
  };
}

export function getAllIndexes(arr, val) {
  const indexes = [];
  for (let i = 0; i < arr.length; i += 1) if (arr[i] === val) indexes.push(i);
  return indexes;
}
