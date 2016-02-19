import React from 'react';
import Immutable from 'immutable';
import classnames from 'classnames';


// TODO: mark your selected estimation card
// TODO: on click of selected card -> unselect
const Card = ({card, cardGridWitdh, ownEstimate, onCardSelected}) => {

  const classes = classnames(`card pure-u-1 pure-u-md-${cardGridWitdh}-24`, {
    'card-selected': card.get('value') === ownEstimate
  });

  return <div className={classes}
              onClick={() => onCardSelected(card)}>
    <div className='card-inner'>{card.get('label')}</div>
  </div>
};

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
