import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {giveStoryEstimate} from '../actions';
import {isThisCardWaiting} from '../services/selectors';
import {StyledCardInner, StyledCard} from '../styled/Board';
import {getOwnEstimate} from '../services/selectors';

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
  (state, props) => {
    const ownEstimate = getOwnEstimate(state);
    return {
      selectedStoryId: state.selectedStory,
      ownEstimate,
      isWaiting: isThisCardWaiting(state, props.card.value, ownEstimate)
    };
  },
  {giveStoryEstimate}
)(Card);
