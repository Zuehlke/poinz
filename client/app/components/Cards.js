import React from 'react';
import Immutable from 'immutable';
import classnames from 'classnames';
import Card from './Card';

/**
 *
 * @param onCardSelected
 * @param {number} ownEstimate the estimation value the user did select
 */
const Cards = ({onCardSelected, ownEstimate, cardConfig})=> {

  const totalCardCount = cardConfig.size;
  const cardGridWitdh = Math.floor(24 / totalCardCount);

  return (
    <div className={`pure-g cards cards-${totalCardCount}`}>
      {
        cardConfig.map((config, index) => <Card key={'card_'+index} card={config} onCardSelected={onCardSelected}
                                                cardGridWitdh={cardGridWitdh} ownEstimate={ownEstimate}/>)
      }
    </div>
  );
};

export default Cards;
