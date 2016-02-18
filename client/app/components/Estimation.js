import React from 'react';
import Anchorify from 'react-anchorify-text'
import Cards from './Cards'

const Estimation = ({ selectedStory,  ownId, actions }) => {

  const ownEstimate = selectedStory.getIn(['estimations', ownId]);

  const isEstimationChangeAllowed = !selectedStory.get('allEstimatesGiven');

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
        isEstimationChangeAllowed &&
        <Cards
          ownEstimate={ownEstimate}
          onCardSelected={selectedCard => actions.giveStoryEstimate(selectedStory.get('id'), selectedCard.get('value')) }/>
      }
    </div>
  );
};

export default Estimation;
