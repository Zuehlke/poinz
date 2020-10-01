import React from 'react';
import {connect} from 'react-redux';
import Anchorify from 'react-anchorify-text';
import PropTypes from 'prop-types';

import {newEstimationRound, reveal} from '../actions';

import Cards from './Cards';
import ConsensusBadge from './ConsensusBadge';
import {getCardConfigForValue} from '../services/getCardConfigForValue';
import {
  BoardActionButtons,
  StyledApplauseHighlight,
  StyledEstimation,
  StyledSelectedStory,
  StyledStoryText
} from '../styled/Board';
import {StyledStoryTitle} from '../styled/StyledStoryTitle';

/**
 * Displays
 * - the currently selected story
 * - a list of available cards if the user can currently give estimations.
 * - action buttons ("reveal manually" and "new round")
 *
 */
const Estimation = ({t, selectedStory, applause, user, cardConfig, newEstimationRound, reveal}) => {
  const ownEstimate = selectedStory.estimations[user.id];

  const revealed = selectedStory.revealed;
  const isExcluded = user.excluded;
  const userCanCurrentlyEstimate = !revealed && !isExcluded;

  return (
    <StyledEstimation>
      <StyledSelectedStory>
        <StyledStoryTitle>
          {selectedStory.title}
          {selectedStory.consensus && (
            <ConsensusBadge cardConfig={cardConfig} consensusValue={selectedStory.consensus} />
          )}
        </StyledStoryTitle>

        <StyledStoryText>
          <Anchorify text={selectedStory.description} />
        </StyledStoryText>

        {selectedStory.consensus && applause && (
          <ApplauseHighlight cardConfig={cardConfig} consensusValue={selectedStory.consensus} />
        )}
      </StyledSelectedStory>

      {userCanCurrentlyEstimate && <Cards ownEstimate={ownEstimate} />}

      {!revealed && (
        <BoardActionButtons>
          <button
            type="button"
            className="pure-button pure-button-primary"
            onClick={() => reveal(selectedStory.id)}
          >
            {t('revealManually')}
            <i className="icon-hand-paper-o button-icon-right"></i>
          </button>
        </BoardActionButtons>
      )}

      {revealed && (
        <BoardActionButtons>
          <button
            type="button"
            className="pure-button pure-button-primary"
            onClick={() => newEstimationRound(selectedStory.id)}
          >
            {t('newRound')}
            <i className="icon-ccw button-icon-right"></i>
          </button>
        </BoardActionButtons>
      )}
    </StyledEstimation>
  );
};

Estimation.propTypes = {
  t: PropTypes.func,
  cardConfig: PropTypes.array,
  selectedStory: PropTypes.object,
  applause: PropTypes.bool,
  user: PropTypes.object,
  newEstimationRound: PropTypes.func,
  reveal: PropTypes.func
};

export default connect(
  (state) => ({
    t: state.translator,
    selectedStory: state.stories[state.selectedStory],
    user: state.users[state.userId],
    applause: state.applause,
    cardConfig: state.cardConfig
  }),
  {newEstimationRound, reveal}
)(Estimation);

const ApplauseHighlight = ({cardConfig, consensusValue}) => {
  if (!consensusValue) {
    return null;
  }

  const matchingCardConfig = getCardConfigForValue(cardConfig, consensusValue);
  const highlightColor = matchingCardConfig.color;
  return (
    <StyledApplauseHighlight
      style={{boxShadow: '0 0 10px ' + highlightColor, border: '1px solid ' + highlightColor}}
    ></StyledApplauseHighlight>
  );
};

ApplauseHighlight.propTypes = {
  cardConfig: PropTypes.array,
  consensusValue: PropTypes.number
};
