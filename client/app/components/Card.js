import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {giveStoryEstimate} from '../actions';
import {
  getMatchingPendingCommand,
  hasMatchingPendingCommand
} from '../services/queryPendingCommands';
import {StyledCardInner, StyledCard} from '../styled/Board';

/**
 * One estimation card on the board.
 */
const Card = ({
  card,
  selectedStoryId,
  ownEstimate,
  estimationWaiting,
  hasPendingClearCommand,
  giveStoryEstimate
}) => {
  const isWaiting =
    card.value === estimationWaiting || (hasPendingClearCommand && card.value === ownEstimate);

  return (
    <StyledCard
      onClick={() => giveStoryEstimate(selectedStoryId, card.value)}
      data-testid={'estimationCard.' + card.value}
    >
      <StyledCardInner
        className={isWaiting ? 'waiting-spinner' : ''}
        cardColor={card.color}
        selected={card.value === ownEstimate}
      >
        {card.label}
      </StyledCardInner>
    </StyledCard>
  );
};

Card.propTypes = {
  card: PropTypes.object,
  selectedStoryId: PropTypes.string,
  ownEstimate: PropTypes.number,
  estimationWaiting: PropTypes.number,
  hasPendingClearCommand: PropTypes.bool,
  giveStoryEstimate: PropTypes.func
};

export default connect(
  (state) => {
    const pendingEstimationCommand = getMatchingPendingCommand(state, 'giveStoryEstimate');

    return {
      selectedStoryId: state.selectedStory,
      ownEstimate: state.stories[state.selectedStory].estimations[state.userId],
      estimationWaiting: pendingEstimationCommand
        ? pendingEstimationCommand.payload.value
        : undefined,

      hasPendingClearCommand: hasMatchingPendingCommand(state, 'clearStoryEstimate')
    };
  },
  {giveStoryEstimate}
)(Card);
