import React from 'react';
import Anchorify from 'react-anchorify-text';
import { pure } from 'recompose';

import Cards from './Cards';

const Estimation = ({ selectedStory, cardConfig, user, moderatorId, actions }) => {

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
        <Cards
          cardConfig={cardConfig}
          ownEstimate={ownEstimate}
          onCardSelected={selectedCard => actions.giveStoryEstimate(selectedStory.get('id'), selectedCard.get('value')) }/>
      }

      {
        !isEstimationChangeAllowed && isModerator &&

        <div className="moderator-actions">
          <button type="button" className='pure-button pure-button-primary'
                  onClick={() => actions.newEstimationRound(selectedStory.get('id'))}>New Round
          </button>
        </div>

      }
    </div>
  );
};

export default pure(Estimation);
