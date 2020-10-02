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
const Card = ({card, selectedStoryId, ownEstimate, isWaiting, giveStoryEstimate}) => (
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

Card.propTypes = {
  card: PropTypes.object,
  selectedStoryId: PropTypes.string,
  ownEstimate: PropTypes.number,
  giveStoryEstimate: PropTypes.func,
  isWaiting: PropTypes.bool
};

export default connect(
  (state) => {
    const pendingEstimationCommand = getMatchingPendingCommand(state, 'giveStoryEstimate');

    return {
      selectedStoryId: state.selectedStory,
      ownEstimate:
        state.estimations &&
        state.estimations[state.selectedStory] &&
        state.estimations[state.selectedStory][state.userId],
      estimationWaiting: pendingEstimationCommand
        ? pendingEstimationCommand.payload.value
        : undefined,

      hasPendingClearCommand: hasMatchingPendingCommand(state, 'clearStoryEstimate')
    };
  },
  {giveStoryEstimate},
  (stateProps, dispatchProps, ownProps) => {
    const mergedProps = {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      isWaiting:
        ownProps.card.value === stateProps.estimationWaiting ||
        (stateProps.hasPendingClearCommand && ownProps.card.value === stateProps.ownEstimate)
    };
    delete mergedProps.estimationWaiting;
    delete mergedProps.hasPendingClearCommand;

    return mergedProps;
  }
)(Card);
