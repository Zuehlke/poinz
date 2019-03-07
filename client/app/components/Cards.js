import React from 'react';
import Immutable from 'immutable';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Card from './Card';

/**
 * All estimation cards on the board.
 * (number of available cards and their value is set in cardConfig)
 */
const Cards = ({cardConfig})=> (
  <div className="cards">
    {
      cardConfig.map((config, index) => (
        <Card
          key={'card_'+index}
          card={config}
        />
      ))
    }
  </div>
);

Cards.propTypes = {
  cardConfig: PropTypes.instanceOf(Immutable.List)
};

export default connect(
  state => ({
    cardConfig: state.get('cardConfig')
  })
)(Cards);
