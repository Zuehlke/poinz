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
import {StyledStoryTitle} from '../styled/Story';

/**
 * Displays
 * - the currently selected story
 * - a list of available cards if the user can currently give estimations.
 * - action buttons ("reveal manually" and "new round")
 *
 */
const Estimation = ({
  t,
  selectedStory,
  applause,
  userCanCurrentlyEstimate,
  cardConfig,
  newEstimationRound,
  reveal
}) => {
  const revealed = selectedStory.revealed;
  const hasConsensus = selectedStory.consensus !== undefined; // value could be "0" which is falsy, check for undefined

  return (
    <StyledEstimation data-testid="estimationArea">
      <StyledSelectedStory data-testid="story">
        <StyledStoryTitle>
          {selectedStory.title}
          {hasConsensus && (
            <ConsensusBadge cardConfig={cardConfig} consensusValue={selectedStory.consensus} />
          )}
        </StyledStoryTitle>

        <StyledStoryText>
          <Anchorify text={selectedStory.description || ''} />
        </StyledStoryText>

        {hasConsensus && applause && (
          <ApplauseHighlight cardConfig={cardConfig} consensusValue={selectedStory.consensus} />
        )}
      </StyledSelectedStory>

      {userCanCurrentlyEstimate && <Cards />}

      {!revealed && (
        <BoardActionButtons>
          <button
            type="button"
            className="pure-button pure-button-primary"
            onClick={() => reveal(selectedStory.id)}
          >
            {t('reveal')}
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
            data-testid="newRoundButton"
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
  userCanCurrentlyEstimate: PropTypes.bool,
  selectedStory: PropTypes.object,
  applause: PropTypes.bool,
  newEstimationRound: PropTypes.func,
  reveal: PropTypes.func
};

export default connect(
  (state) => {
    const selectedStory = state.stories[state.selectedStory];
    const isExcluded = state.users[state.userId].excluded;
    const userCanCurrentlyEstimate = !selectedStory.revealed && !isExcluded;

    return {
      t: state.translator,
      selectedStory,
      userCanCurrentlyEstimate,
      applause: state.applause,
      cardConfig: state.cardConfig
    };
  },
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
