import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {StyledConsensusBadge} from './_styled';
import {getMatchingCardConfig} from '../../state/room/roomSelectors';

const ConsensusBadge = ({matchingCardConfig}) => (
  <StyledConsensusBadge
    cardColor={matchingCardConfig && matchingCardConfig.color}
    data-testid="consensusBadge"
  >
    <div>{matchingCardConfig.label}</div>
  </StyledConsensusBadge>
);

ConsensusBadge.propTypes = {
  consensusValue: PropTypes.number,
  matchingCardConfig: PropTypes.object
};

export default connect((state, props) => ({
  matchingCardConfig: getMatchingCardConfig(state, props.consensusValue)
}))(ConsensusBadge);
