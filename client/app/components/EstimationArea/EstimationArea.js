import React, {useContext} from 'react';
import {connect} from 'react-redux';
import Anchorify from 'react-anchorify-text';
import PropTypes from 'prop-types';
import log from 'loglevel';

import {L10nContext} from '../../services/l10n';
import {newEstimationRound, reveal, selectNextStory} from '../../state/actions/commandActions';
import {findNextStoryIdToEstimate} from '../../state/estimations/estimationsSelectors';
import {
  hasSelectedStoryConsensus,
  getSelectedStory,
  isAStorySelected
} from '../../state/stories/storiesSelectors';
import {getOwnUser} from '../../state/users/usersSelectors';
import {getMatchingCardConfig} from '../../state/room/roomSelectors';
import {hasApplause} from '../../state/ui/uiSelectors';
import Cards from './Cards';
import ValueBadge from '../common/ValueBadge';
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
  const {t} = useContext(L10nContext);
  const revealed = selectedStory.revealed;

  return (
    <StyledEstimation data-testid="estimationArea">
      <StyledSelectedStory data-testid="story">
        <StyledStoryTitle>
          {selectedStory.title}
          {hasConsensus && <ValueBadge cardValue={selectedStory.consensus} />}
        </StyledStoryTitle>

        <StyledStoryText>
          <Anchorify text={selectedStory.description || ''} />
        </StyledStoryText>

        {hasConsensus && applause && <StyledApplauseHighlight color={consensusCardConfig.color} />}
      </StyledSelectedStory>

      {!revealed && (
        <EstimationAreaButtons alignment="space-between">
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
          <EstimationAreaButtons alignment="flex-end">
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
    if (!isAStorySelected(state)) {
      log.error('No Story Selected! must not render EstimationArea');
      return {};
    }

    const selectedStory = getSelectedStory(state);
    const isExcluded = getOwnUser(state).excluded;
    const userCanCurrentlyEstimate = !selectedStory.revealed && !isExcluded;

    const hasConsensus = hasSelectedStoryConsensus(state);
    const consensusCardConfig = getMatchingCardConfig(state, selectedStory.consensus);

    return {
      selectedStory,
      consensusCardConfig,
      hasConsensus,
      userCanCurrentlyEstimate,
      applause: hasApplause(state),
      hasNextStory: !!findNextStoryIdToEstimate(state)
    };
  },
  {newEstimationRound, reveal, selectNextStory}
)(EstimationArea);
