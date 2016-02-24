import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Anchorify from 'react-anchorify-text';

import { newEstimationRound } from '../services/actions';

import Cards from './Cards';

const Estimation = ({ selectedStory,  user, moderatorId,  newEstimationRound }) => {

  const ownEstimate = selectedStory.getIn(['estimations', user.get('id')]);

  const isEstimationChangeAllowed = !selectedStory.get('allEstimatesGiven');
  const isVisitor = user.get('visitor');
  const isModerator = user.get('id') === moderatorId;

  return (
    <div className='estimation'>

      <div className='selected-story'>
        <h4>
          {selectedStory.get('title')}
        </h4>
        <div>
          <Anchorify text={selectedStory.get('description')}/>
        </div>
      </div>

      {
        isEstimationChangeAllowed && !isVisitor &&
        <Cards ownEstimate={ownEstimate}/>
      }

      {
        !isEstimationChangeAllowed && isModerator &&

        <div className="moderator-actions">
          <button type="button" className='pure-button pure-button-primary'
                  onClick={() => newEstimationRound(selectedStory.get('id'))}>New Round
          </button>
        </div>

      }
    </div>
  );
};

export default connect(
  state => ({
    selectedStory: state.getIn(['stories', state.get('selectedStory')]),
    cardConfig: state.get('cardConfig'),
    user: state.getIn(['users', state.get('userId')]),
    moderatorId: state.get('moderatorId')
  }),
  dispatch => bindActionCreators({newEstimationRound}, dispatch)
)(Estimation);
