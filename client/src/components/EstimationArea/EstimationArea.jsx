import React, {useContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';
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
import EasterEgg from '../common/EasterEgg';
import StoryDescription from '../common/StoryDescription';

import {StyledStoryTitle} from '../_styled';
import {
  EstimationAreaButtons,
  StyledApplauseHighlight,
  StyledEstimation,
  StyledSelectedStory
} from './_styled';

/**
 * Displays
 * - the currently selected story
 * - a list of available cards if the user can currently give estimations.
 * - action buttons ("reveal manually" and "new round")
 *
 */
const EstimationArea = () => {
  const {t} = useContext(L10nContext);
  const dispatch = useDispatch();

  const isStorySelected = useSelector(isAStorySelected);
  if (!isStorySelected) {
    log.error('No Story Selected! must not render EstimationArea');
    return null;
  }

  const selectedStory = useSelector(getSelectedStory);
  const isExcluded = useSelector(state => getOwnUser(state).excluded);
  const userCanCurrentlyEstimate = !selectedStory.revealed && !isExcluded;
  const hasConsensus = useSelector(hasSelectedStoryConsensus);
  const consensusCardConfig = useSelector(state => getMatchingCardConfig(state, selectedStory.consensus));
  const applause = useSelector(hasApplause);
  const hasNextStory = useSelector(state => !!findNextStoryIdToEstimate(state));
  const activeEasterEgg = useSelector(state => state.ui.activeEasterEgg);

  const handleReveal = () => dispatch(reveal(selectedStory.id));
  const handleNewRound = () => dispatch(newEstimationRound(selectedStory.id));
  const handleSelectNextStory = () => dispatch(selectNextStory());

  const revealed = selectedStory.revealed;

  return (
    <StyledEstimation data-testid="estimationArea">
      <StyledSelectedStory data-testid="story">
        <StyledStoryTitle>
          {selectedStory.title}
          {hasConsensus && <ValueBadge cardValue={selectedStory.consensus} />}
        </StyledStoryTitle>

        <StoryDescription
          storyId={selectedStory.id}
          text={selectedStory.description}
          textExpandThreshold={500}
        />

        {hasConsensus && applause && <StyledApplauseHighlight $color={consensusCardConfig.color} />}
        {hasConsensus && activeEasterEgg && applause && (
          <EasterEgg activeEasterEgg={activeEasterEgg} />
        )}
      </StyledSelectedStory>

      {!revealed && (
        <EstimationAreaButtons $alignment="space-between">
          <button
            type="button"
            className="pure-button pure-button-primary"
            onClick={handleReveal}
          >
            {t('reveal')}
            <i className="icon-hand-paper-o button-icon-right"></i>
          </button>
        </EstimationAreaButtons>
      )}

      {revealed && (
        <React.Fragment>
          <EstimationAreaButtons $alignment="flex-end">
            <button
              type="button"
              className="pure-button pure-button-primary"
              onClick={handleNewRound}
              data-testid="newRoundButton"
            >
              {t('newRound')}
              <i className="icon-ccw button-icon-right"></i>
            </button>

            {hasNextStory && (
              <button
                type="button"
                className="pure-button pure-button-primary"
                onClick={handleSelectNextStory}
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
  reveal: PropTypes.func,
  activeEasterEgg: PropTypes.object
};

export default EstimationArea;
