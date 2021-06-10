/**
 *
 * @param variable
 * @returns {string}
 */
export function getCSSColour(variable) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
}

/**
 *
 * @param property
 * @param colour
 */
export function setCSSColour(property, colour) {
  document.documentElement.style.setProperty(property, colour);
}
