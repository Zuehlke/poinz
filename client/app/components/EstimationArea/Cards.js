import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

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
const Cards = ({
  cardConfig,
  ownEstimate,
  withConfidence,
  giveStoryEstimate,
  clearStoryEstimate
}) => {
  const hasEstimate = ownEstimate !== undefined;
  const ownEstimateValue = hasEstimate && ownEstimate.value;
  const [confidence, setConfidence] = useState(0);

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

  function onConfidenceChange(conf) {
    setConfidence(conf);
    if (hasEstimate) {
      giveStoryEstimate(ownEstimateValue, conf);
    }
  }

  function onCardClick(value) {
    if (ownEstimate === value) {
      clearStoryEstimate();
    } else {
      giveStoryEstimate(value, confidence);
    }
  }
};

Cards.propTypes = {
  cardConfig: PropTypes.array,
  withConfidence: PropTypes.bool,
  ownEstimate: PropTypes.shape({
    value: PropTypes.number.isRequired,
    confidence: PropTypes.number
  }),
  giveStoryEstimate: PropTypes.func,
  clearStoryEstimate: PropTypes.func
};

export default connect(
  (state) => ({
    withConfidence: state.room.withConfidence,
    cardConfig: getCardConfigInOrder(state),
    ownEstimate: getOwnEstimate(state)
  }),
  {
    giveStoryEstimate,
    clearStoryEstimate
  }
)(Cards);
