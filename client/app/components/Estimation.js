import React from 'react';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Anchorify from 'react-anchorify-text';

import { newEstimationRound, reveal } from '../services/actions';

import Cards from './Cards';

import PopUp from './PopUp';

/**
 * Displays
 * - the currently selected story
 * - a list of available cards if the user can currently give estimations.
 * - action buttons ("reveal manually" and "new round")
 *
 */
const Estimation = ({t, selectedStory, user, newEstimationRound, reveal}) => {

    const ownEstimate = selectedStory.getIn(['estimations', user.get('id')]);

    const revealed = selectedStory.get('revealed');
    const isVisitor = user.get('visitor');
    const userCanCurrentlyEstimate = !revealed && !isVisitor;

    console.log("Self reveled");
    console.log(selectedStory);

    //check if the cards were reveled
    if (revealed) {
      const estimations = selectedStory.getIn(['estimations']);
      //needed for Reveal Manually
      if (estimations._root && estimations._root.entries) {
        let lastStoryPointsValue = 0;
        var storyPointConsentAchieved = true;
        for (let i = 0; i < estimations._root.entries.length; i++) {
          let entry = estimations._root.entries[i];
          let currentStoryPointsValue = entry[1]; //the story points value are always at this position
          if (i === 0) { //for the fist iteration
            lastStoryPointsValue = currentStoryPointsValue;
          }
          else if (currentStoryPointsValue !== lastStoryPointsValue) {
            storyPointConsentAchieved = false;
            break;
          }
          lastStoryPointsValue = currentStoryPointsValue;
        }
      }
    }

    return (
      <div className="estimation">

        <div className="selected-story">
          <h4>
            {selectedStory.get('title')}
          </h4>
          <div className="story-text">
            <Anchorify text={selectedStory.get('description')}/>
          </div>
        </div>

        {
          userCanCurrentlyEstimate &&
          <Cards ownEstimate={ownEstimate}/>
        }

        {
          userCanCurrentlyEstimate &&
          <div className="board-actions">
            <button type="button" className="pure-button pure-button-primary"
                    onClick={() => reveal(selectedStory.get('id'))}>
              {t('revealManually')}
              <i className="fa fa-hand-paper-o button-icon-right"></i>
            </button>
          </div>
        }

        {
          revealed &&
          <div className="board-actions">
            <button type="button" className="pure-button pure-button-primary"
                    onClick={() => newEstimationRound(selectedStory.get('id'))}>
              {t('newRound')}
              <i className="fa fa-undo  button-icon-right"></i>
            </button>
          </div>
        }
        {
          revealed && storyPointConsentAchieved && <PopUp messageType="success" message={t('spConsent')}/>
        }
      </div>
    );
  }
  ;

Estimation.propTypes = {
  t: React.PropTypes.func,
  selectedStory: React.PropTypes.instanceOf(Immutable.Map),
  user: React.PropTypes.instanceOf(Immutable.Map),
  newEstimationRound: React.PropTypes.func,
  reveal: React.PropTypes.func
};

export default connect(
  state => ({
    t: state.get('translator'),
    selectedStory: state.getIn(['stories', state.get('selectedStory')]),
    user: state.getIn(['users', state.get('userId')])
  }),
  dispatch => bindActionCreators({newEstimationRound, reveal}, dispatch)
)(Estimation);
