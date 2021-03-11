import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {giveStoryEstimate, clearStoryEstimate} from '../../state/actions/commandActions';
import {isThisCardWaiting} from '../../state/commandTracking/commandTrackingSelectors';

import {StyledCard, StyledCardInner} from './_styled';

/**
 * One estimation card on the board.
 */
const Card = ({giveStoryEstimate, clearStoryEstimate, isWaiting, isSelected, cardCfg}) => {
  return (
    <StyledCard onClick={onCardClick} data-testid={'estimationCard.' + cardCfg.value}>
      <StyledCardInner
        className={isWaiting ? 'waiting-spinner' : ''}
        cardColor={cardCfg.color}
        selected={isSelected}
      >
        {cardCfg.label}
      </StyledCardInner>
    </StyledCard>
  );

  function onCardClick() {
    if (isSelected) {
      clearStoryEstimate();
    } else {
      giveStoryEstimate(cardCfg.value);
    }
  }
};

Card.propTypes = {
  cardCfg: PropTypes.object,
  isSelected: PropTypes.bool,
  isWaiting: PropTypes.bool,
  giveStoryEstimate: PropTypes.func,
  clearStoryEstimate: PropTypes.func
};

export default connect(
  (state, props) => ({
    isWaiting: isThisCardWaiting(state, props.cardCfg.value)
  }),
  {giveStoryEstimate, clearStoryEstimate}
)(Card);
