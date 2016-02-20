import React from 'react';
import { pure } from 'recompose';
import classnames from 'classnames';

const Card = ({card, ownEstimate, onCardSelected}) => {

  const classes = classnames(`card pure-u-1 pure-u-md-2-24`, {
    'card-selected': card.get('value') === ownEstimate
  });

  const onClick = onCardSelected.bind(undefined, card);

  return (
    <div className={classes} onClick={onClick}>
      <div className='card-inner'>{card.get('label')}</div>
    </div>
  );
};

export default pure(Card);
