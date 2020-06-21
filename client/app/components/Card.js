import React from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import {giveStoryEstimate} from '../actions';
import {
  getMatchingPendingCommand,
  hasMatchingPendingCommand
} from '../services/queryPendingCommands';

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
  const cardClasses = classnames('card clickable', {
    'card-selected': card.value === ownEstimate
  });
  const cardInnerClasses = classnames('card-inner', {
    waiting:
      card.value === estimationWaiting || (hasPendingClearCommand && card.value === ownEstimate)
  });

  const customCardStyle = card.color ? {background: card.color, color: 'white'} : {};
  return (
    <button className={cardClasses} onClick={() => giveStoryEstimate(selectedStoryId, card.value)}>
      <div className={cardInnerClasses} style={customCardStyle}>
        {card.label}
      </div>
    </button>
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
