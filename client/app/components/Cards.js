import React from 'react';
import Immutable from 'immutable';
import classnames from 'classnames';

// for the moment, this is fix.
// TODO: creator of room can choose card values
// TODO: store creator's selection to local storage and use as default
const cardConfig = Immutable.fromJS([
  {label: '0', value: 0},
  {label: '1/2', value: 0.5},
  {label: '1', value: 1},
  {label: '2', value: 2},
  {label: '3', value: 3},
  {label: '5', value: 5},
  {label: '8', value: 8},
  {label: '13', value: 13},
  {label: '?', value: -1},
  {label: 'Coffee', value: -2}
]);

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
const Cards = ({onCardSelected, ownEstimate})=> {

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
