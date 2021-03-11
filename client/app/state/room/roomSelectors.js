import {COLOR_WARNING} from '../../components/colors';

export const getRoomId = (state) => state.room.roomId;
export const getCardConfigInOrder = (state) => state.room.cardConfig.ordered;
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
