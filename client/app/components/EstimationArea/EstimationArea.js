import React from 'react';
import {connect} from 'react-redux';
import Anchorify from 'react-anchorify-text';
import PropTypes from 'prop-types';

import {newEstimationRound, reveal, selectNextStory} from '../../state/actions/commandActions';
import {findNextStoryIdToEstimate} from '../../state/selectors/storiesAndEstimates';
import Cards from './Cards';
import ConsensusBadge from '../common/ConsensusBadge';
import ApplauseHighlight from './ApplauseHighlight';
import EstimationSummary from './EstimationSummary';

import {StyledStoryTitle} from '../_styled';
import {
  EstimationAreaButtons,
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
  userCanCurrentlyEstimate,
  cardConfig,
  newEstimationRound,
  reveal,
  hasNextStory
}) => {
  const revealed = selectedStory.revealed;
  const hasConsensus = selectedStory.consensus !== undefined && selectedStory.consensus !== null; // value could be "0" which is falsy, check for undefined

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
  cardConfig: PropTypes.array,
  userCanCurrentlyEstimate: PropTypes.bool,
  selectedStory: PropTypes.object,
  applause: PropTypes.bool,
  hasNextStory: PropTypes.bool,
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
      cardConfig: state.cardConfig,
      hasNextStory: !!findNextStoryIdToEstimate(state)
    };
  },
  {newEstimationRound, reveal, selectNextStory}
)(EstimationArea);
