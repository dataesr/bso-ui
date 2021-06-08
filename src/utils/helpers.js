export function getCSSColour(variable) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
}

export function setCSSColour(property, colour) {
  document.documentElement.style.setProperty(property, colour);
}
