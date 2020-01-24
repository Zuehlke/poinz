import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import {giveStoryEstimate} from '../actions';

/**
 * One estimation card on the board.
 */
const Card = ({card, selectedStoryId, ownEstimate, estimationWaiting, giveStoryEstimate}) => {

  const cardClasses = classnames('card clickable', {
    'card-selected': card.value === ownEstimate
  });
  const cardInnerClasses = classnames('card-inner', {
    'waiting': card.value === estimationWaiting
  });

  const customCardStyle = card.color ? {background: card.color, color: 'white'} : {};
  return (
    <button className={cardClasses} onClick={() => giveStoryEstimate(selectedStoryId, card.value)}>
      <div className={cardInnerClasses} style={customCardStyle}>{card.label}</div>
    </button>
  );
};

Card.propTypes = {
  card: PropTypes.object,
  selectedStoryId: PropTypes.string,
  ownEstimate: PropTypes.number,
  estimationWaiting: PropTypes.number,
  giveStoryEstimate: PropTypes.func
};

export default connect(
  state => {
    const pendingEstimationCommand = Object.values(state.pendingCommands).find(cmd => cmd.name === 'giveStoryEstimate');
    return {
      selectedStoryId: state.selectedStory,
      ownEstimate:  state.stories[state.selectedStory].estimations[state.userId],
      estimationWaiting: pendingEstimationCommand ? pendingEstimationCommand.payload.value : undefined
    };
  },
  dispatch => bindActionCreators({giveStoryEstimate}, dispatch)
)(Card);
