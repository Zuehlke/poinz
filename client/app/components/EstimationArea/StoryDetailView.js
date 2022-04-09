import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {getStoryForId, hasStoryConsensus} from '../../state/stories/storiesSelectors';
import {getMatchingCardConfig} from '../../state/room/roomSelectors';
import {getHighlightedStoryId} from '../../state/ui/uiSelectors';
import ValueBadge from '../common/ValueBadge';
import EstimationSummary from './EstimationSummary';
import StoryDescription from '../common/StoryDescription';

import {StyledStoryTitle} from '../_styled';
import {StyledApplauseHighlight, StyledEstimation, StyledSelectedStory} from './_styled';

/**
 * Displays
 * - The currently highlighted (in the backlog) story
 * - estimation summary if the story is revealed
 *
 */
const StoryDetailView = ({highlightedStory, consensusCardConfig, hasConsensus}) => {
  if (!highlightedStory) {
    return null;
  }

  const revealed = highlightedStory.revealed;

  return (
    <StyledEstimation data-testid="estimationArea">
      <StyledSelectedStory data-testid="story">
        <StyledStoryTitle>
          {highlightedStory.title}
          {hasConsensus && <ValueBadge cardValue={highlightedStory.consensus} />}
        </StyledStoryTitle>

        <StoryDescription
          storyId={highlightedStory.id}
          text={highlightedStory.description}
          textExpandThreshold={500}
        />

        {hasConsensus && <StyledApplauseHighlight color={consensusCardConfig.color} />}
      </StyledSelectedStory>

      {revealed && <EstimationSummary storyId={highlightedStory.id} />}
    </StyledEstimation>
  );
};

StoryDetailView.propTypes = {
  highlightedStory: PropTypes.object,
  hasConsensus: PropTypes.bool,
  consensusCardConfig: PropTypes.object
};

export default connect((state) => {
  const highlightedStoryId = getHighlightedStoryId(state);
  if (!highlightedStoryId) {
    return {};
  }
  const highlightedStory = getStoryForId(state, highlightedStoryId);
  if (!highlightedStory) {
    return {};
  }

  const hasConsensus = hasStoryConsensus(highlightedStory);
  const consensusCardConfig = getMatchingCardConfig(state, highlightedStory.consensus);

  return {
    highlightedStory,
    consensusCardConfig,
    hasConsensus
  };
})(StoryDetailView);
