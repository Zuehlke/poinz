import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Card from './Card';

import {StyledCards} from './_styled';
import {getOwnEstimate} from '../../state/estimations/estimationsSelectors';
import {getCardConfigInOrder} from '../../state/room/roomSelectors';

/**
 * All estimation cards on the board.
 * (number of available cards and their value is set in cardConfig)
 */
const Cards = ({cardConfig, ownEstimate}) => (
  <StyledCards>
    {cardConfig.map((config) => (
      <Card
        key={'card_' + config.value}
        cardCfg={config}
        isSelected={ownEstimate === config.value}
      />
    ))}
  </StyledCards>
);

Cards.propTypes = {
  cardConfig: PropTypes.array,
  ownEstimate: PropTypes.number
};

export default connect((state) => ({
  cardConfig: getCardConfigInOrder(state),
  ownEstimate: getOwnEstimate(state)
}))(Cards);
