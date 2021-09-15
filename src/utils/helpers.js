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
export function cleanNumber(num) {
  let myCleanedNumber = '';
  if (num < 1000) {
    myCleanedNumber = num.toFixed(0);
  } else {
    const units = ['k', 'M', 'B', 'T', 'Q'];
    const unit = Math.floor((num / 1.0e1).toFixed(0).toString().length);
    const r = unit % 3;
    const x = Math.abs(Number(num)) / Number(`1.0e+${unit - r}`).toFixed(2);
    myCleanedNumber = `${x.toFixed(2)}${units[Math.floor(unit / 3) - 1]}`;
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

export function getPercentageYAxis(showTotal = true, max = 100) {
  return {
    min: 0,
    max,
    title: { text: '' },
    stackLabels: {
      enabled: true,
      // eslint-disable-next-line
      formatter: function () {
        // eslint-disable-next-line
        return showTotal && this.total
          ? this.total.toFixed(0).concat(' %')
          : '';
      },
      style: {
        fontWeight: 'bold',
      },
    },
    labels: {
      // eslint-disable-next-line
      formatter: function () {
        // eslint-disable-next-line
        return this.axis.defaultLabelFormatter.call(this).concat(' %');
      },
    },
  };
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

/**
 *
 * @param id
 * @param domain
 * @returns {string}
 */
export function withDomain(id, domain = 'national') {
  return `app.${domain || 'national'}-${id}`;
}

/**
 *
 * @param id
 * @param domain
 * @param studyType
 * @returns {string}
 */
 export function withDomainAndStudyType(id, domain = 'health', studyType = 'interventional') {
  return `app.${domain || 'health'}-${studyType || 'interventional'}.${id}`;
}
