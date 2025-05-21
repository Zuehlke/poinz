import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {isThisCardWaiting} from '../../state/commandTracking/commandTrackingSelectors';

import {StyledCard, StyledCardInner} from './_styled';

/**
 * One estimation card on the board.
 */
const Card = ({isSelected, cardCfg, onClick}) => {
  const isWaiting = useSelector((state) => isThisCardWaiting(state, cardCfg.value));

  return (
    <StyledCard onClick={onClick} data-testid={'estimationCard.' + cardCfg.value}>
      <StyledCardInner
        className={isWaiting ? 'waiting-spinner' : ''}
        $cardColor={cardCfg.color}
        $selected={isSelected}
      >
        {cardCfg.label}
      </StyledCardInner>
    </StyledCard>
  );
};

Card.propTypes = {
  cardCfg: PropTypes.object,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func
};

export default Card;
