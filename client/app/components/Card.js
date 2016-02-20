import React from 'react';
import classnames from 'classnames';

const Card = ({card, ownEstimate, onCardSelected}) => {

  const classes = classnames(`card pure-u-1 pure-u-md-2-24`, {
    'card-selected': card.get('value') === ownEstimate
  });

  return (
    <div className={classes} onClick={() => onCardSelected(card)}>
      <div className='card-inner'>{card.get('label')}</div>
    </div>
  );
};

export default Card;
