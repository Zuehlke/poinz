import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { giveStoryEstimate } from '../services/actions';

const Card = ({card, selectedStoryId, ownEstimate, giveStoryEstimate}) => {

  const classes = classnames(`card pure-u-1 pure-u-md-2-24`, {
    'card-selected': card.get('value') === ownEstimate
  });


  const customCardStyle = card.get('color') ? {background: card.get('color'), color: 'white'} : {};
  return (
    <button className={classes} onClick={() => giveStoryEstimate(selectedStoryId, card.get('value'))}>
      <div className='card-inner' style={customCardStyle}>{card.get('label')}</div>
    </button>
  );
};

export default connect(
  state =>({
    selectedStoryId: state.get('selectedStory'),
    ownEstimate: state.getIn(['stories', state.get('selectedStory'), 'estimations', state.get('userId')])
  }),
  dispatch => bindActionCreators({giveStoryEstimate}, dispatch)
)(Card);
