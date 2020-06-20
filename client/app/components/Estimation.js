import React from 'react';
import {connect} from 'react-redux';
import Anchorify from 'react-anchorify-text';
import PropTypes from 'prop-types';

import {newEstimationRound, reveal} from '../actions';

import Cards from './Cards';
import ConsensusBadge from './ConsensusBadge';

/**
 * Displays
 * - the currently selected story
 * - a list of available cards if the user can currently give estimations.
 * - action buttons ("reveal manually" and "new round")
 *
 */
const Estimation = ({t, selectedStory, user, cardConfig, newEstimationRound, reveal}) => {
  const ownEstimate = selectedStory.estimations[user.id];

  const revealed = selectedStory.revealed;
  const isExcluded = user.excluded;
  const userCanCurrentlyEstimate = !revealed && !isExcluded;

  return (
    <div className="estimation">
      <div className="selected-story">
        <h4>
          {selectedStory.title}
          {selectedStory.consensus && (
            <ConsensusBadge cardConfig={cardConfig} consensusValue={selectedStory.consensus} />
          )}
        </h4>
        <div className="story-text">
          <Anchorify text={selectedStory.description} />
        </div>
      </div>

      {userCanCurrentlyEstimate && <Cards ownEstimate={ownEstimate} />}

      {!revealed && (
        <div className="board-actions">
          <button
            type="button"
            className="pure-button pure-button-primary"
            onClick={() => reveal(selectedStory.id)}
          >
            {t('revealManually')}
            <i className="fa fa-hand-paper-o button-icon-right"></i>
          </button>
        </div>
      )}

      {revealed && (
        <div className="board-actions">
          <button
            type="button"
            className="pure-button pure-button-primary"
            onClick={() => newEstimationRound(selectedStory.id)}
          >
            {t('newRound')}
            <i className="fa fa-undo  button-icon-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

Estimation.propTypes = {
  t: PropTypes.func,
  cardConfig: PropTypes.array,
  selectedStory: PropTypes.object,
  user: PropTypes.object,
  newEstimationRound: PropTypes.func,
  reveal: PropTypes.func
};

export default connect(
  (state) => ({
    t: state.translator,
    selectedStory: state.stories[state.selectedStory],
    user: state.users[state.userId],
    cardConfig: state.cardConfig
  }),
  {newEstimationRound, reveal}
)(Estimation);
