import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {isThisCardWaiting} from '../../state/commandTracking/commandTrackingSelectors';

import {StyledCard, StyledCardInner} from './_styled';

/**
 * One estimation card on the board.
 */
const Card = ({isWaiting, isSelected, cardCfg, onClick}) => {
  return (
    <StyledCard onClick={onClick} data-testid={'estimationCard.' + cardCfg.value}>
      <StyledCardInner
        className={isWaiting ? 'waiting-spinner' : ''}
        cardColor={cardCfg.color}
        selected={isSelected}
      >
        {cardCfg.label}
      </StyledCardInner>
    </StyledCard>
  );
};

Card.propTypes = {
  cardCfg: PropTypes.object,
  isSelected: PropTypes.bool,
  isWaiting: PropTypes.bool,
  onClick: PropTypes.func
};

export default connect((state, props) => ({
  isWaiting: isThisCardWaiting(state, props.cardCfg.value)
}))(Card);
