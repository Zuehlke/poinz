import React from 'react';
import PropTypes from 'prop-types';

import {getCardConfigForValue} from '../../services/getCardConfigForValue';

import {StyledConsensusBadge} from './_styled';

const ConsensusBadge = ({cardConfig, consensusValue}) => {
  const matchingCardConfig = getCardConfigForValue(cardConfig, consensusValue);

  return (
    <StyledConsensusBadge
      cardColor={matchingCardConfig && matchingCardConfig.color}
      data-testid="consensusBadge"
    >
      <div>{matchingCardConfig.label}</div>
    </StyledConsensusBadge>
  );
};
ConsensusBadge.propTypes = {
  cardConfig: PropTypes.array,
  consensusValue: PropTypes.number
};

export default ConsensusBadge;
