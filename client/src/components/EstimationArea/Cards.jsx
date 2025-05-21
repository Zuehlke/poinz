import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Card from './Card';

import {StyledCards, StyledCardsWrapper} from './_styled';
import {getOwnEstimate} from '../../state/estimations/estimationsSelectors';
import {getCardConfigInOrder} from '../../state/room/roomSelectors';
import {clearStoryEstimate, giveStoryEstimate} from '../../state/actions/commandActions';
import ConfidenceButtons from './ConfidenceButtons';

/**
 * All estimation cards on the board, where the user can choose/vote/estimate.
 *
 * (number of available cards and their value is set in cardConfig)
 */
const Cards = () => {
  const dispatch = useDispatch();
  const withConfidence = useSelector(state => state.room.withConfidence);
  const cardConfig = useSelector(getCardConfigInOrder);
  const ownEstimate = useSelector(getOwnEstimate);

  const hasEstimate = ownEstimate !== undefined;
  const ownEstimateValue = hasEstimate && ownEstimate.value;
  const [confidence, setConfidence] = useState(0);

  const onConfidenceChange = (conf) => {
    setConfidence(conf);
    if (hasEstimate) {
      dispatch(giveStoryEstimate(ownEstimateValue, conf));
    }
  };

  const onCardClick = (value) => {
    if (ownEstimate && ownEstimate.value === value) {
      dispatch(clearStoryEstimate());
    } else {
      dispatch(giveStoryEstimate(value, confidence));
    }
  };

  return (
    <StyledCards>
      {withConfidence && (
        <ConfidenceButtons
          onConfidenceChange={onConfidenceChange}
          selectedConfidence={confidence}
        />
      )}

      <StyledCardsWrapper>
        {cardConfig.map((config) => (
          <Card
            key={'card_' + config.value}
            cardCfg={config}
            isSelected={ownEstimateValue === config.value}
            onClick={() => onCardClick(config.value)}
          />
        ))}
      </StyledCardsWrapper>
    </StyledCards>
  );
};

export default Cards;
