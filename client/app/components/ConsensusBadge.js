import React from 'react';
import PropTypes from 'prop-types';

import {getCardConfigForValue} from '../services/getCardConfigForValue';

const ConsensusBadge = ({cardConfig, consensusValue}) => {
  const matchingCardConfig = getCardConfigForValue(cardConfig, consensusValue);

  return (
    <div
      className="consensus-badge"
      style={{background: matchingCardConfig ? matchingCardConfig.color : '#bdbfbf'}}
    >
      <div>{matchingCardConfig.label}</div>
    </div>
  );
};
ConsensusBadge.propTypes = {
  cardConfig: PropTypes.array,
  consensusValue: PropTypes.number
};

export default ConsensusBadge;
