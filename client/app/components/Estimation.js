import React from 'react';
import Immutable from 'immutable';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Anchorify from 'react-anchorify-text';

import {newEstimationRound, reveal, displayNotification} from '../services/actions';

import Cards from './Cards';

import {TYPE} from './Notification';

/**
 * Displays
 * - the currently selected story
 * - a list of available cards if the user can currently give estimations.
 * - action buttons ("reveal manually" and "new round")
 *
 */
const Estimation = ({t, selectedStory, user, newEstimationRound, reveal, displayNotification}) => {

  const ownEstimate = selectedStory.getIn(['estimations', user.get('id')]);

  const revealed = selectedStory.get('revealed');
  const isVisitor = user.get('visitor');
  const userCanCurrentlyEstimate = !revealed && !isVisitor;

  //check if the cards were reveled
  if (revealed) {
    const estimations = selectedStory.get('estimations');
    if (isConsentAchieved(estimations)) {
      displayNotification(TYPE.SUCCESS, t('spConsent'));
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
    </div>
  );
  /**
   * Tests if the consent was achieved
   * @param estimations the estimations
   * @return {boolean} true if the consent was achieved otherwise false
   */
  function isConsentAchieved(estimations) {
    //This is the case when no one gave an estimation
    if (estimations.size === 0) {
      return false;
    }
    const estimationValues = estimations.valueSeq();
    var firstValue = estimationValues.get(0);
    return estimationValues.every((v) => v === firstValue);
  }
};

Estimation.propTypes = {
  t: React.PropTypes.func,
  selectedStory: React.PropTypes.instanceOf(Immutable.Map),
  user: React.PropTypes.instanceOf(Immutable.Map),
  newEstimationRound: React.PropTypes.func,
  displayNotification: React.PropTypes.func,
  reveal: React.PropTypes.func
};

export default connect(
  state => ({
    t: state.get('translator'),
    selectedStory: state.getIn(['stories', state.get('selectedStory')]),
    user: state.getIn(['users', state.get('userId')])
  }),
  dispatch => bindActionCreators({newEstimationRound, reveal, displayNotification}, dispatch)
)(Estimation);
