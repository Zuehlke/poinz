import React from 'react';
import Immutable from 'immutable';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classnames from 'classnames';

import {giveStoryEstimate} from '../actions';

/**
 * One estimation card on the board.
 */
const Card = ({card, selectedStoryId, ownEstimate, estimationWaiting, giveStoryEstimate}) => {

  const cardClasses = classnames('card clickable pure-u-1 pure-u-md-2-24', {
    'card-selected': card.get('value') === ownEstimate
  });
  const cardInnerClasses = classnames('card-inner', {
    'waiting': card.get('value') === estimationWaiting
  });

  const customCardStyle = card.get('color') ? {background: card.get('color'), color: 'white'} : {};
  return (
    <button className={cardClasses} onClick={() => giveStoryEstimate(selectedStoryId, card.get('value'))}>
      <div className={cardInnerClasses} style={customCardStyle}>{card.get('label')}</div>
    </button>
  );
};

Card.propTypes = {
  card: React.PropTypes.instanceOf(Immutable.Map),
  selectedStoryId: React.PropTypes.string,
  ownEstimate: React.PropTypes.number,
  estimationWaiting: React.PropTypes.number,
  giveStoryEstimate: React.PropTypes.func
};

export default connect(
  state => {
    const pendingEstimationCommand = state.get('pendingCommands').find(cmd => cmd.name === 'giveStoryEstimate');
    return {
      selectedStoryId: state.get('selectedStory'),
      ownEstimate: state.getIn(['stories', state.get('selectedStory'), 'estimations', state.get('userId')]),
      estimationWaiting: pendingEstimationCommand ? pendingEstimationCommand.payload.value : undefined
    };
  },
  dispatch => bindActionCreators({giveStoryEstimate}, dispatch)
)(Card);
