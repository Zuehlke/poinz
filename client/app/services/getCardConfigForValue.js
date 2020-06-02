/**
 *
 * @param cardConfig {object} The complete cardConfig object from the redux state
 * @param numericValue {number} The numeric value, see initialState.js
 */
export function getCardConfigForValue(cardConfig, numericValue) {
  return cardConfig.find((cc) => cc.value === numericValue);
}
