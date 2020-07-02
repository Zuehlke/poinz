import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Card from './Card';
import {StyledCards} from '../styled/Board';

/**
 * All estimation cards on the board.
 * (number of available cards and their value is set in cardConfig)
 */
const Cards = ({cardConfig}) => (
  <StyledCards>
    {cardConfig.map((config, index) => (
      <Card key={'card_' + index} card={config} />
    ))}
  </StyledCards>
);

Cards.propTypes = {
  cardConfig: PropTypes.array
};

export default connect((state) => ({
  cardConfig: state.cardConfig
}))(Cards);
