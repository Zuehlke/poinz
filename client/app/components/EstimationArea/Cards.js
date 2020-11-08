import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Card from './Card';
import {getOwnEstimate} from '../../services/selectors';

import {StyledCards} from './_styled';

/**
 * All estimation cards on the board.
 * (number of available cards and their value is set in cardConfig)
 */
const Cards = ({cardConfig, selectedStoryId, ownEstimate}) => {
  return (
    <StyledCards>
      {cardConfig.map((config) => (
        <Card
          key={'card_' + config.value}
          cardCfg={config}
          selectedStoryId={selectedStoryId}
          isSelected={ownEstimate === config.value}
        />
      ))}
    </StyledCards>
  );
};

Cards.propTypes = {
  cardConfig: PropTypes.array,
  selectedStoryId: PropTypes.string,
  ownEstimate: PropTypes.number,
  giveStoryEstimate: PropTypes.func,
  isWaiting: PropTypes.bool
};

export default connect((state) => {
  const ownEstimate = getOwnEstimate(state);
  return {
    selectedStoryId: state.selectedStory,
    cardConfig: state.cardConfig,
    ownEstimate
  };
})(Cards);
