import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {giveStoryEstimate} from '../actions';
import {StyledCardInner, StyledCard} from '../styled/Board';
import {isThisCardWaiting} from '../services/selectors';

/**
 * One estimation card on the board.
 */
const Card = ({giveStoryEstimate, isWaiting, isSelected, selectedStoryId, cardCfg}) => (
  <StyledCard
    onClick={() => giveStoryEstimate(selectedStoryId, cardCfg.value)}
    data-testid={'estimationCard.' + cardCfg.value}
  >
    <StyledCardInner
      className={isWaiting ? 'waiting-spinner' : ''}
      cardColor={cardCfg.color}
      selected={isSelected}
    >
      {cardCfg.label}
    </StyledCardInner>
  </StyledCard>
);

Card.propTypes = {
  cardCfg: PropTypes.object,
  isSelected: PropTypes.bool,
  selectedStoryId: PropTypes.string,
  isWaiting: PropTypes.bool,
  giveStoryEstimate: PropTypes.func
};

export default connect(
  (state, props) => ({
    isWaiting: isThisCardWaiting(state, props.cardCfg.value)
  }),
  {giveStoryEstimate}
)(Card);
