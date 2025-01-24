import {COLOR_WARNING} from '../../components/colors';

export const getRoomId = (state) => state.room.roomId;
export const getCardConfigInOrder = (state) => state.room.cardConfig.ordered;

/**
 * Returns the matching cardConfig (consisting of color, label and value) for the given numerical value.
 * Will never return undefined.
 *
 * @param state
 * @param numericValue
 * @return {{color: string, label: string, value}}
 */
export const getMatchingCardConfig = (state, numericValue) => {
  const match = state.room.cardConfig.byValue[numericValue];

  if (match) {
    return match;
  }

  return {
    value: numericValue,
    label: `${numericValue} !`,
    color: COLOR_WARNING
  };
};
