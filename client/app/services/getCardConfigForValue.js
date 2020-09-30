/**
 *
 * @param cardConfig {object} The complete cardConfig object from the redux state
 * @param numericValue {number} The numeric value to look up
 */
import {COLOR_WARNING} from '../styled/colors';

export function getCardConfigForValue(cardConfig, numericValue) {
  const matchingConfig = cardConfig.find((cc) => cc.value === numericValue);
  if (matchingConfig) {
    return matchingConfig;
  }

  return {
    value: numericValue,
    label: `${numericValue} !`,
    color: COLOR_WARNING
  };
}
