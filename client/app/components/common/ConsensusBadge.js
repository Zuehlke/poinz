import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {getCardConfigForValue} from '../../state/selectors/getCardConfigForValue';

import {StyledConsensusBadge} from './_styled';

const ConsensusBadge = ({matchingCardConfig}) => {
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
  consensusValue: PropTypes.number,
  matchingCardConfig: PropTypes.object
};

export default connect((state, props) => ({
  matchingCardConfig: getCardConfigForValue({...state, cardConfigLookupValue: props.consensusValue})
}))(ConsensusBadge);
