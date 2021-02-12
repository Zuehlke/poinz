import React from 'react';
import {connect} from 'react-redux';
import Anchorify from 'react-anchorify-text';
import PropTypes from 'prop-types';
import log from 'loglevel';

import {newEstimationRound, reveal, selectNextStory} from '../../state/actions/commandActions';
import {
  findNextStoryIdToEstimate,
  getSelectedStory,
  hasSelectedStoryConsensus,
  isAStorySelected
} from '../../state/selectors/storiesAndEstimates';
import {getCardConfigForValue} from '../../state/selectors/getCardConfigForValue';
import Cards from './Cards';
import ConsensusBadge from '../common/ConsensusBadge';
import EstimationSummary from './EstimationSummary';

import {StyledStoryTitle} from '../_styled';
import {
  EstimationAreaButtons,
  StyledApplauseHighlight,
  StyledEstimation,
  StyledSelectedStory,
  StyledStoryText
} from './_styled';

/**
 * Displays
 * - the currently selected story
 * - a list of available cards if the user can currently give estimations.
 * - action buttons ("reveal manually" and "new round")
 *
 */
const EstimationArea = ({
  t,
  selectedStory,
  selectNextStory,
  applause,
  consensusCardConfig,
  hasConsensus,
  userCanCurrentlyEstimate,
  newEstimationRound,
  reveal,
  hasNextStory
}) => {
  const revealed = selectedStory.revealed;

  return (
    <StyledEstimation data-testid="estimationArea">
      <StyledSelectedStory data-testid="story">
        <StyledStoryTitle>
          {selectedStory.title}
          {hasConsensus && <ConsensusBadge consensusValue={selectedStory.consensus} />}
        </StyledStoryTitle>

        <StyledStoryText>
          <Anchorify text={selectedStory.description || ''} />
        </StyledStoryText>

        {hasConsensus && applause && <StyledApplauseHighlight color={consensusCardConfig.color} />}
      </StyledSelectedStory>

      {!revealed && (
        <EstimationAreaButtons>
          <button
            type="button"
            className="pure-button pure-button-primary"
            onClick={() => reveal(selectedStory.id)}
          >
            {t('reveal')}
            <i className="icon-hand-paper-o button-icon-right"></i>
          </button>
        </EstimationAreaButtons>
      )}

      {revealed && (
        <React.Fragment>
          <EstimationAreaButtons>
            <button
              type="button"
              className="pure-button pure-button-primary"
              onClick={() => newEstimationRound(selectedStory.id)}
              data-testid="newRoundButton"
            >
              {t('newRound')}
              <i className="icon-ccw button-icon-right"></i>
            </button>

            {hasNextStory && (
              <button
                type="button"
                className="pure-button pure-button-primary"
                onClick={selectNextStory}
                data-testid="nextStoryButton"
              >
                {t('nextStory')}
                <i className="icon-right-big button-icon-right"></i>
              </button>
            )}
          </EstimationAreaButtons>

          <EstimationSummary />
        </React.Fragment>
      )}

      {userCanCurrentlyEstimate && <Cards />}
    </StyledEstimation>
  );
};

EstimationArea.propTypes = {
  t: PropTypes.func,
  selectNextStory: PropTypes.func,
  userCanCurrentlyEstimate: PropTypes.bool,
  selectedStory: PropTypes.object,
  consensusCardConfig: PropTypes.object,
  hasConsensus: PropTypes.bool,
  applause: PropTypes.bool,
  hasNextStory: PropTypes.bool,
  newEstimationRound: PropTypes.func,
  reveal: PropTypes.func
};

export default connect(
  (state) => {
    if (!isAStorySelected) {
      log.error('No Story Selected! must not render EstimationArea');
      return {};
    }

    const selectedStory = getSelectedStory(state);
    const isExcluded = state.users[state.userId].excluded;
    const userCanCurrentlyEstimate = !selectedStory.revealed && !isExcluded;

    const hasConsensus = hasSelectedStoryConsensus(state);
    const consensusCardConfig = hasConsensus
      ? getCardConfigForValue({
          ...state,
          cardConfigLookupValue: selectedStory.consensus
        })
      : {};

    return {
      t: state.translator,
      selectedStory,
      consensusCardConfig,
      hasConsensus,
      userCanCurrentlyEstimate,
      applause: state.applause,
      hasNextStory: !!findNextStoryIdToEstimate(state)
    };
  },
  {newEstimationRound, reveal, selectNextStory}
)(EstimationArea);
