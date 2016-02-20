import React from 'react';
import Card from './Card';

/**
 *
 * @param onCardSelected
 * @param {number} ownEstimate the estimation value the user did select
 */
const Cards = ({onCardSelected, ownEstimate, cardConfig})=> {

  const totalCardCount = cardConfig.size;

  return (
    <div className={`pure-g cards cards-${totalCardCount}`}>
      {
        cardConfig.map((config, index) => <Card key={'card_'+index} card={config} onCardSelected={onCardSelected}
                                                totalCardCount={totalCardCount} ownEstimate={ownEstimate}/>)
      }
    </div>
  );
};

export default Cards;
